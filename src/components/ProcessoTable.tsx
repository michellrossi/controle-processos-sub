import { useState } from 'react';
import { Processo } from '@/types/processo';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProcessoForm } from './ProcessoForm';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProcessoTableProps {
  processos: Processo[];
  onUpdate: (processo: Partial<Processo> & { id: string }) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export function ProcessoTable({ processos, onUpdate, onDelete, isUpdating }: ProcessoTableProps) {
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [showObservacoes, setShowObservacoes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleOpenObservacoes = (processo: Processo) => {
    setSelectedProcesso(processo);
    setShowObservacoes(true);
  };

  const handleOpenEdit = (processo: Processo) => {
    setSelectedProcesso(processo);
    setShowEdit(true);
  };

  const handleOpenDelete = (processo: Processo) => {
    setSelectedProcesso(processo);
    setShowDelete(true);
  };

  const handleUpdate = (data: any) => {
    if (selectedProcesso) {
      onUpdate({ id: selectedProcesso.id, ...data });
      setShowEdit(false);
      setSelectedProcesso(null);
    }
  };

  const handleDelete = () => {
    if (selectedProcesso) {
      onDelete(selectedProcesso.id);
      setShowDelete(false);
      setSelectedProcesso(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (processos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum processo encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nº Demanda</TableHead>
              <TableHead className="font-semibold">Nº SEI</TableHead>
              <TableHead className="font-semibold">Postura</TableHead>
              <TableHead className="font-semibold">SQL</TableHead>
              <TableHead className="font-semibold">Data Vistoria</TableHead>
              <TableHead className="font-semibold">Endereço</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id} className="table-row-hover">
                <TableCell className="font-medium">{processo.numero_demanda}</TableCell>
                <TableCell className="font-mono text-sm">{processo.numero_sei || '-'}</TableCell>
                <TableCell>{processo.postura}</TableCell>
                <TableCell className="font-mono text-sm">{processo.sql_numero || '-'}</TableCell>
                <TableCell>{formatDate(processo.data_vistoria)}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={processo.endereco || ''}>
                  {processo.endereco || '-'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={processo.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenObservacoes(processo)}
                      title="Ver observações"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(processo)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDelete(processo)}
                      title="Excluir"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Observações */}
      <Dialog open={showObservacoes} onOpenChange={setShowObservacoes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Observações</DialogTitle>
            <DialogDescription>
              Processo: {selectedProcesso?.numero_demanda}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedProcesso?.observacoes ? (
              <p className="text-sm whitespace-pre-wrap">{selectedProcesso.observacoes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhuma observação registrada.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
            <DialogDescription>
              Atualize as informações do processo {selectedProcesso?.numero_demanda}
            </DialogDescription>
          </DialogHeader>
          {selectedProcesso && (
            <ProcessoForm
              processo={selectedProcesso}
              onSubmit={handleUpdate}
              onCancel={() => setShowEdit(false)}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação de Exclusão */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o processo <strong>{selectedProcesso?.numero_demanda}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
