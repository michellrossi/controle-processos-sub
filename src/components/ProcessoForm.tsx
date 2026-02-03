import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Processo, POSTURAS, STATUS_LIST, PosturaType, StatusType } from '@/types/processo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const seiRegex = /^\d{4}\.\d{4}\/\d{7}-\d$/;
const sqlRegex = /^\d{3}\.\d{3}\.\d{4}-\d$/;

const formSchema = z.object({
  numero_demanda: z.string().min(1, 'Número da demanda é obrigatório'),
  numero_sei: z.string().regex(seiRegex, 'Formato: xxxx.xxxx/xxxxxxx-x').or(z.literal('')).nullable(),
  postura: z.enum(POSTURAS as [PosturaType, ...PosturaType[]]),
  sql_numero: z.string().regex(sqlRegex, 'Formato: xxx.xxx.xxxx-x').or(z.literal('')).nullable(),
  data_vistoria: z.string().min(1, 'Data da vistoria é obrigatória'),
  endereco: z.string().nullable(),
  status: z.enum(STATUS_LIST as [StatusType, ...StatusType[]]),
  observacoes: z.string().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface ProcessoFormProps {
  processo?: Processo;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProcessoForm({ processo, onSubmit, onCancel, isSubmitting }: ProcessoFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_demanda: processo?.numero_demanda ?? '',
      numero_sei: processo?.numero_sei ?? '',
      postura: processo?.postura ?? 'ATIVIDADE',
      sql_numero: processo?.sql_numero ?? '',
      data_vistoria: processo?.data_vistoria ?? '',
      endereco: processo?.endereco ?? '',
      status: processo?.status ?? 'Em análise',
      observacoes: processo?.observacoes ?? '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      numero_sei: data.numero_sei || null,
      sql_numero: data.sql_numero || null,
      endereco: data.endereco || null,
      observacoes: data.observacoes || null,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numero_demanda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº Demanda *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2024-001" {...field} />
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
                  <Input 
                    placeholder="xxxx.xxxx/xxxxxxx-x" 
                    {...field} 
                    value={field.value ?? ''} 
                  />
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
                <FormLabel>Postura *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a postura" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POSTURAS.map((postura) => (
                      <SelectItem key={postura} value={postura}>
                        {postura}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sql_numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SQL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="xxx.xxx.xxxx-x" 
                    {...field} 
                    value={field.value ?? ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_vistoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Vistoria *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_LIST.map((status) => (
                      <SelectItem key={status} value={status}>
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
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Endereço completo" 
                  {...field} 
                  value={field.value ?? ''} 
                />
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
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações sobre o processo..." 
                  className="min-h-[100px]"
                  {...field} 
                  value={field.value ?? ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : processo ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
