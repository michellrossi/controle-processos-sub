import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Processo, PosturaType, StatusType } from '@/types/processo';
import { toast } from '@/hooks/use-toast';

export function useProcessos() {
  const queryClient = useQueryClient();

  const { data: processos = [], isLoading, error } = useQuery({
    queryKey: ['processos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Processo[];
    },
  });

  const createProcesso = useMutation({
    mutationFn: async (processo: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('processos')
        .insert({ ...processo, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast({ title: 'Sucesso', description: 'Processo criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const updateProcesso = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Processo> & { id: string }) => {
      const { data, error } = await supabase
        .from('processos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast({ title: 'Sucesso', description: 'Processo atualizado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const deleteProcesso = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('processos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast({ title: 'Sucesso', description: 'Processo excluído com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const importProcessos = useMutation({
    mutationFn: async (processosToImport: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const processosWithUserId = processosToImport.map(p => ({ ...p, user_id: user.id }));
      
      const { data, error } = await supabase
        .from('processos')
        .insert(processosWithUserId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast({ title: 'Sucesso', description: `${data.length} processos importados com sucesso!` });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro na importação', description: error.message, variant: 'destructive' });
    },
  });

  return {
    processos,
    isLoading,
    error,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    importProcessos,
  };
}
