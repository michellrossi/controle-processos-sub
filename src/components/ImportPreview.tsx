import { ValidationResult } from '@/utils/csvParser';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
} from 'lucide-react';

interface ImportPreviewProps {
  validation: ValidationResult;
  onConfirm: () => void;
  onCancel: () => void;
  isImporting: boolean;
}

export function ImportPreview({
  validation,
  onConfirm,
  onCancel,
  isImporting,
}: ImportPreviewProps) {
  const { summary, errors, warnings, columns, validRows, invalidRows } = validation;
  const hasValidRows = summary.valid > 0;
  const hasErrors = summary.errors > 0;

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
          <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{summary.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-status-concluida/10">
          <CheckCircle2 className="h-5 w-5 text-status-concluida" />
          <div>
            <p className="text-sm text-muted-foreground">Válidos</p>
            <p className="text-lg font-semibold text-status-concluida">{summary.valid}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm text-muted-foreground">Com erros</p>
            <p className="text-lg font-semibold text-destructive">{summary.errors}</p>
          </div>
        </div>
      </div>

      {/* Colunas detectadas */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Colunas detectadas:</p>
        <div className="flex flex-wrap gap-2">
          {columns.map((col, idx) => (
            <Badge
              key={idx}
              variant={col.mappedTo ? 'default' : 'outline'}
              className={!col.mappedTo ? 'opacity-50' : ''}
            >
              {col.header}
              {col.mappedTo && (
                <span className="ml-1 opacity-70">→ {col.mappedTo}</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Avisos */}
      {warnings.length > 0 && (
        <Alert variant="default" className="border-status-ar-devolvido/50 bg-status-ar-devolvido/10">
          <AlertTriangle className="h-4 w-4 text-status-ar-devolvido" />
          <AlertTitle className="text-status-ar-devolvido">Avisos</AlertTitle>
          <AlertDescription>
            {warnings.map((w, i) => (
              <p key={i}>{w.message}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Erros detalhados */}
      {hasErrors && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Linhas com erros ({invalidRows.length}):
          </p>
          <ScrollArea className="h-[200px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Linha</TableHead>
                  <TableHead className="w-24">Campo</TableHead>
                  <TableHead>Erro</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invalidRows.slice(0, 50).flatMap((row) =>
                  row.errors.map((err, errIdx) => (
                    <TableRow key={`${row.row}-${errIdx}`}>
                      <TableCell className="font-mono text-xs">{err.row}</TableCell>
                      <TableCell className="font-medium">{err.field}</TableCell>
                      <TableCell className="text-destructive text-sm">
                        {err.message}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-[150px] truncate">
                        {err.value || '(vazio)'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          {invalidRows.length > 50 && (
            <p className="text-xs text-muted-foreground">
              Mostrando apenas as primeiras 50 linhas com erro...
            </p>
          )}
        </div>
      )}

      {/* Preview de dados válidos */}
      {hasValidRows && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-status-concluida flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Prévia dos dados válidos ({validRows.length}):
          </p>
          <ScrollArea className="h-[150px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Demanda</TableHead>
                  <TableHead>Postura</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Vistoria</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validRows.slice(0, 10).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {row.numero_demanda}
                    </TableCell>
                    <TableCell>{row.postura}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.data_vistoria}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          {validRows.length > 10 && (
            <p className="text-xs text-muted-foreground">
              Mostrando apenas os primeiros 10 registros...
            </p>
          )}
        </div>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isImporting}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!hasValidRows || isImporting}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isImporting
            ? 'Importando...'
            : `Importar ${summary.valid} registro${summary.valid !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}
