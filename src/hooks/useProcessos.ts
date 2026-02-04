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

  const deleteMany = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('processos')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast({ title: 'Sucesso', description: `${count} processos excluídos com sucesso!` });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const importProcessos = useMutation({
    mutationFn: async (processosToImport: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Log para debug - verificar dados antes de enviar
      console.log('Importando processos:', JSON.stringify(processosToImport.slice(0, 2), null, 2));

      const processosWithUserId = processosToImport.map(p => ({ ...p, user_id: user.id }));
      
      const { data, error } = await supabase
        .from('processos')
        .insert(processosWithUserId)
        .select();
      
      if (error) {
        console.error('Erro Supabase:', error);
        // Mensagem mais detalhada sobre o erro
        if (error.message.includes('invalid input value for enum')) {
          const match = error.message.match(/invalid input value for enum (\w+): "([^"]+)"/);
          if (match) {
            throw new Error(`Valor inválido para ${match[1]}: "${match[2]}". Verifique se os valores de Status e Postura estão corretos no arquivo CSV.`);
          }
        }
        throw error;
      }
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
    deleteMany,
    importProcessos,
  };
}
