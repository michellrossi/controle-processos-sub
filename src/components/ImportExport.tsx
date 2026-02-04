import { useRef, useState } from 'react';
import { Processo } from '@/types/processo';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, Download } from 'lucide-react';
import { validateAndParseCSV, ValidationResult, ParsedRow } from '@/utils/csvParser';
import { ImportPreview } from '@/components/ImportPreview';

interface ImportExportProps {
  processos: Processo[];
  onImport: (processos: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => void;
  isImporting?: boolean;
}

export function ImportExport({ processos, onImport, isImporting }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleExport = () => {
    if (processos.length === 0) {
      toast({ title: 'Aviso', description: 'Não há processos para exportar.', variant: 'destructive' });
      return;
    }

    const headers = [
      'Nº Demanda',
      'Nº SEI',
      'Postura',
      'SQL',
      'Data Vistoria',
      'Endereço',
      'Status',
      'Observações',
    ];

    const rows = processos.map((p) => [
      p.numero_demanda,
      p.numero_sei || '',
      p.postura,
      p.sql_numero || '',
      p.data_vistoria,
      p.endereco || '',
      p.status,
      (p.observacoes || '').replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `processos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({ title: 'Sucesso', description: `${processos.length} processos exportados.` });
  };

  // Detecta se o texto tem caracteres inválidos (encoding incorreto)
  const hasInvalidChars = (text: string): boolean => {
    // Caractere de substituição Unicode (aparece quando encoding falha)
    return text.includes('\uFFFD') || /�/.test(text);
  };

  const processFile = (text: string) => {
    try {
      const result = validateAndParseCSV(text);
      setValidation(result);
      setShowPreview(true);
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao processar o arquivo CSV.', variant: 'destructive' });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Primeiro tenta UTF-8
    const readerUtf8 = new FileReader();
    readerUtf8.onload = (e) => {
      const text = e.target?.result as string;
      
      // Se UTF-8 tem caracteres inválidos, tenta Latin1 (windows-1252)
      if (hasInvalidChars(text)) {
        const readerLatin = new FileReader();
        readerLatin.onload = (e2) => {
          const textLatin = e2.target?.result as string;
          processFile(textLatin);
        };
        readerLatin.readAsText(file, 'windows-1252');
      } else {
        processFile(text);
      }
    };

    readerUtf8.readAsText(file, 'UTF-8');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (!validation || validation.validRows.length === 0) return;

    onImport(validation.validRows);
    setShowPreview(false);
    setValidation(null);
  };

  const handleCancelImport = () => {
    setShowPreview(false);
    setValidation(null);
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Importar CSV
        </Button>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview da Importação</DialogTitle>
            <DialogDescription>
              Revise os dados antes de confirmar a importação.
            </DialogDescription>
          </DialogHeader>
          {validation && (
            <ImportPreview
              validation={validation}
              onConfirm={handleConfirmImport}
              onCancel={handleCancelImport}
              isImporting={isImporting || false}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
