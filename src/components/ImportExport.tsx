import { useRef } from 'react';
import { Processo, POSTURAS, STATUS_LIST, PosturaType, StatusType } from '@/types/processo';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Upload, Download } from 'lucide-react';

interface ImportExportProps {
  processos: Processo[];
  onImport: (processos: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => void;
  isImporting?: boolean;
}

export function ImportExport({ processos, onImport, isImporting }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentLine.push(currentField.trim());
          currentField = '';
        } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
          currentLine.push(currentField.trim());
          if (currentLine.some((f) => f)) lines.push(currentLine);
          currentLine = [];
          currentField = '';
          if (char === '\r') i++;
        } else {
          currentField += char;
        }
      }
    }

    if (currentField || currentLine.length) {
      currentLine.push(currentField.trim());
      if (currentLine.some((f) => f)) lines.push(currentLine);
    }

    return lines;
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = parseCSV(text);

        if (lines.length < 2) {
          toast({ title: 'Erro', description: 'Arquivo CSV vazio ou inválido.', variant: 'destructive' });
          return;
        }

        const [, ...dataRows] = lines;
        const validProcessos: Omit<Processo, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [];
        const errors: string[] = [];

        dataRows.forEach((row, index) => {
          const [
            numero_demanda,
            numero_sei,
            postura,
            sql_numero,
            data_vistoria,
            endereco,
            status,
            observacoes,
          ] = row;

          // Validações
          if (!numero_demanda) {
            errors.push(`Linha ${index + 2}: Nº Demanda obrigatório`);
            return;
          }

          if (!POSTURAS.includes(postura as PosturaType)) {
            errors.push(`Linha ${index + 2}: Postura inválida "${postura}"`);
            return;
          }

          if (!STATUS_LIST.includes(status as StatusType)) {
            errors.push(`Linha ${index + 2}: Status inválido "${status}"`);
            return;
          }

          if (!data_vistoria) {
            errors.push(`Linha ${index + 2}: Data da vistoria obrigatória`);
            return;
          }

          validProcessos.push({
            numero_demanda,
            numero_sei: numero_sei || null,
            postura: postura as PosturaType,
            sql_numero: sql_numero || null,
            data_vistoria,
            endereco: endereco || null,
            status: status as StatusType,
            observacoes: observacoes || null,
          });
        });

        if (validProcessos.length > 0) {
          onImport(validProcessos);
        }

        if (errors.length > 0) {
          toast({
            title: 'Avisos na importação',
            description: `${errors.length} linha(s) ignorada(s). ${validProcessos.length} importada(s).`,
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({ title: 'Erro', description: 'Falha ao processar o arquivo CSV.', variant: 'destructive' });
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {isImporting ? 'Importando...' : 'Importar CSV'}
      </Button>
      <Button variant="outline" onClick={handleExport} className="gap-2">
        <Download className="h-4 w-4" />
        Exportar CSV
      </Button>
    </div>
  );
}
