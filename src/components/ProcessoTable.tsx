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
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const isAllSelected = processos.length > 0 && selectedIds.size === processos.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < processos.length;

  if (processos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
        <p className="text-lg font-medium">Nenhum processo encontrado</p>
        <p className="text-sm opacity-70">Tente ajustar seus filtros ou cadastre um novo.</p>
      </div>
    );
  }

  return (
    <>
      {/* Barra de ações em lote */}
      {selectedIds.size > 0 && onDeleteMany && (
        <div className="flex items-center justify-between gap-4 p-4 mb-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 animate-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {selectedIds.size}
            </div>
            <span className="text-sm font-semibold text-primary">
              {selectedIds.size === 1 ? 'Processo selecionado' : 'Processos selecionados'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteMany(true)}
              className="gap-2 shadow-lg shadow-destructive/20"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              {onDeleteMany && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                    className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary"
                  />
                </TableHead>
              )}
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5">Nº Demanda</TableHead>
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5">Nº SEI</TableHead>
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5">Postura</TableHead>
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5">Data</TableHead>
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5">Endereço</TableHead>
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5 text-center">Status</TableHead>
              <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest py-5 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id} className="border-b border-slate-100/50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                {onDeleteMany && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(processo.id)}
                      onCheckedChange={(checked) => handleSelectOne(processo.id, !!checked)}
                      aria-label={`Selecionar processo ${processo.numero_demanda}`}
                      className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                )}
                <TableCell className="py-4">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{processo.numero_demanda}</span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {processo.numero_sei || '-'}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{processo.postura}</span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm text-slate-500 dark:text-slate-500">{formatDate(processo.data_vistoria)}</span>
                </TableCell>
                <TableCell className="py-4 max-w-[200px]">
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate" title={processo.endereco || ''}>
                    {processo.endereco || '-'}
                  </p>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <StatusBadge status={processo.status} />
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"
                      onClick={() => handleOpenObservacoes(processo)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"
                      onClick={() => handleOpenEdit(processo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDelete(processo)}
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10"
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

      <Dialog open={showObservacoes} onOpenChange={setShowObservacoes}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Observações</DialogTitle>
            <DialogDescription className="text-sm font-medium text-primary">
              Processo: {selectedProcesso?.numero_demanda}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl mt-2">
            {selectedProcesso?.observacoes ? (
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {selectedProcesso.observacoes}
              </p>
            ) : (
              <p className="text-sm text-center text-slate-400 italic">Nenhuma observação registrada.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">Editar Processo</DialogTitle>
            <DialogDescription className="text-sm font-medium text-primary">
              Informações de {selectedProcesso?.numero_demanda}
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

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Excluir Processo</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 py-2">
              Tem certeza que deseja excluir <strong>{selectedProcesso?.numero_demanda}</strong>? Esta ação removerá permanentemente os dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteMany} onOpenChange={setShowDeleteMany}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-destructive">Atenção!</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 py-2">
              Você está prestes a excluir <strong>{selectedIds.size}</strong> processos simultaneamente. Esta operação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMany} className="rounded-xl bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20">
              Confirmar Exclusão em Lote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}