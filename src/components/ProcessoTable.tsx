import { useState } from 'react';
import { Processo } from '@/types/processo';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  onDeleteMany?: (ids: string[]) => void;
  isUpdating?: boolean;
}

export function ProcessoTable({ processos, onUpdate, onDelete, onDeleteMany, isUpdating }: ProcessoTableProps) {
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showObservacoes, setShowObservacoes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteMany, setShowDeleteMany] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(processos.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

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

  const handleDeleteMany = () => {
    if (onDeleteMany && selectedIds.size > 0) {
      onDeleteMany(Array.from(selectedIds));
      setSelectedIds(new Set());
      setShowDeleteMany(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const isAllSelected = processos.length > 0 && selectedIds.size === processos.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < processos.length;

  if (processos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum processo encontrado.</p>
      </div>
    );
  }

  return (
    <>
      {/* Barra de ações em lote */}
      {selectedIds.size > 0 && onDeleteMany && (
        <div className="flex items-center gap-4 p-3 mb-4 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">
            {selectedIds.size} {selectedIds.size === 1 ? 'processo selecionado' : 'processos selecionados'}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteMany(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Excluir selecionados
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            Limpar seleção
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {onDeleteMany && (
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        (el as any).indeterminate = isSomeSelected;
                      }
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
              )}
              <TableHead className="font-semibold text-center">Nº Demanda</TableHead>
              <TableHead className="font-semibold text-center">Nº SEI</TableHead>
              <TableHead className="font-semibold text-center">Postura</TableHead>
              <TableHead className="font-semibold text-center">SQL</TableHead>
              <TableHead className="font-semibold text-center">Data Vistoria</TableHead>
              <TableHead className="font-semibold text-center">Endereço</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id} className="table-row-hover">
                {onDeleteMany && (
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.has(processo.id)}
                      onCheckedChange={(checked) => handleSelectOne(processo.id, !!checked)}
                      aria-label={`Selecionar processo ${processo.numero_demanda}`}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium text-center">{processo.numero_demanda}</TableCell>
                <TableCell className="font-mono text-sm text-center">{processo.numero_sei || '-'}</TableCell>
                <TableCell className="text-center">{processo.postura}</TableCell>
                <TableCell className="font-mono text-sm text-center">{processo.sql_numero || '-'}</TableCell>
                <TableCell className="text-center">{formatDate(processo.data_vistoria)}</TableCell>
                <TableCell className="max-w-[200px] truncate text-center" title={processo.endereco || ''}>
                  {processo.endereco || '-'}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={processo.status} />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
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

      {/* Confirmação de Exclusão Individual */}
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

      {/* Confirmação de Exclusão em Lote */}
      <AlertDialog open={showDeleteMany} onOpenChange={setShowDeleteMany}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão em Lote</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{selectedIds.size}</strong> {selectedIds.size === 1 ? 'processo' : 'processos'}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMany} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir {selectedIds.size} {selectedIds.size === 1 ? 'processo' : 'processos'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
