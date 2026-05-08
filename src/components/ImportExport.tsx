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
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { validateAndParseCSV, ValidationResult, ParsedRow } from '@/utils/csvParser';
import { ImportPreview } from '@/components/ImportPreview';

interface ImportExportProps {
  processos: Processo[];
  onImport: (processos: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => void;
  isImporting?: boolean;
}

const CSV_HEADERS = [
  'Nº Demanda',
  'Nº SEI',
  'Postura',
  'SQL',
  'Data Vistoria',
  'Endereço',
  'Status',
  'Observações',
];

export function ImportExport({ processos, onImport, isImporting }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleDownloadTemplate = () => {
    const exampleRow = [
      '2024-001',
      '6010.2024/0000001-0',
      'Muro',
      '001.002.0003-4',
      '2024-05-20',
      'Rua Exemplo, 123',
      'Ação necessária',
      'Observação de exemplo aqui',
    ];

    const csvContent = [
      CSV_HEADERS.join(','),
      exampleRow.map(cell => `"${cell}"`).join(','),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `modelo_importacao_processos.csv`;
    link.click();

    toast({ 
      title: 'Modelo Baixado', 
      description: 'Use este arquivo como base para suas importações.',
    });
  };

  const handleExport = () => {
    if (processos.length === 0) {
      toast({ title: 'Aviso', description: 'Não há processos para exportar.', variant: 'destructive' });
      return;
    }

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
      CSV_HEADERS.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `processos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({ title: 'Sucesso', description: `${processos.length} processos exportados.` });
  };

  const hasInvalidChars = (text: string): boolean => {
    return text.includes('\uFFFD');
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

    const readerUtf8 = new FileReader();
    readerUtf8.onload = (e) => {
      const text = e.target?.result as string;
      
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
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          className="gap-2 border-dashed"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          Modelo CSV
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Importar
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleExport} 
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview da Importação</DialogTitle>
            <DialogDescription>
              Revise os dados abaixo. Linhas com erros serão ignoradas.
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

