import { useForm } from 'react-hook-form';
import { Processo, STATUS_LIST, POSTURAS, StatusType } from '@/types/processo';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Hash, 
  FileDigit, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';

interface ProcessoFormProps {
  processo?: Processo;
  onSubmit: (data: Partial<Processo>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProcessoForm({ processo, onSubmit, onCancel, isSubmitting }: ProcessoFormProps) {
  const form = useForm<Partial<Processo>>({
    defaultValues: processo || {
      numero_demanda: '',
      numero_sei: '',
      postura: 'ATIVIDADE',
      sql_numero: '',
      data_vistoria: new Date().toISOString().split('T')[0],
      endereco: '',
      status: 'Ação necessária',
      observacoes: '',
    },
  });

  // Função auxiliar para renderizar ícones nos labels
  const FormIconLabel = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex items-center gap-2 mb-1">
      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        
        {/* Seção 1: Identificação (Cards agrupados visualmente) */}
        <div className="bg-gray-50 dark:bg-muted/30 p-4 rounded-xl space-y-4 border border-border/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Hash className="h-3 w-3" /> Identificação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numero_demanda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº Demanda</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 12345/2024" className="bg-white dark:bg-card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero_sei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº SEI</FormLabel>
                  <FormControl>
                    <Input placeholder="0000.0000/0000000-0" className="bg-white dark:bg-card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="sql_numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SQL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileDigit className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="000.000.0000-0" className="pl-9 bg-white dark:bg-card" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postura</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-card">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {POSTURAS?.map((postura) => (
                        <SelectItem key={postura} value={postura}>
                          {postura}
                        </SelectItem>
                      )) || <SelectItem value="Padrao">Padrão</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seção 2: Localização e Status */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="data_vistoria"
              render={({ field }) => (
                <FormItem>
                  <FormIconLabel icon={Calendar} label="Data da Vistoria" />
                  <FormControl>
                    <Input type="date" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormIconLabel icon={AlertCircle} label="Status Atual" />
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_LIST.map((status) => (
                        <SelectItem key={status} value={status} className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 
                            ${status === 'Ação necessária' ? 'bg-red-500' : 
                              status === 'Demanda concluída' ? 'bg-emerald-500' :
                              'bg-primary'}`} 
                          />
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormIconLabel icon={MapPin} label="Endereço Completo" />
                <FormControl>
                  <Input placeholder="Rua, Número, Bairro, CEP" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormIconLabel icon={FileText} label="Observações e Detalhes" />
                <FormControl>
                  <Textarea 
                    placeholder="Descreva detalhes importantes sobre o processo..." 
                    className="min-h-[100px] resize-none rounded-xl" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rodapé de Ações */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="gap-2 h-11 px-6 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2 h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {processo ? 'Salvar Alterações' : 'Cadastrar Processo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}