import { POSTURAS, STATUS_LIST, PosturaType, StatusType } from '@/types/processo';

export interface CSVColumn {
  index: number;
  header: string;
  mappedTo: string | null;
}

export interface ValidationIssue {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface ParsedRow {
  numero_demanda: string;
  numero_sei: string | null;
  postura: PosturaType;
  sql_numero: string | null;
  data_vistoria: string;
  endereco: string | null;
  status: StatusType;
  observacoes: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  validRows: ParsedRow[];
  invalidRows: { row: number; data: string[]; errors: ValidationIssue[] }[];
  summary: { total: number; valid: number; errors: number };
  columns: CSVColumn[];
}

// Aliases para cada campo esperado
const COLUMN_ALIASES: Record<string, string[]> = {
  numero_demanda: ['nº demanda', 'numero demanda', 'n demanda', 'demanda', 'num demanda'],
  numero_sei: ['nº sei', 'numero sei', 'n sei', 'sei', 'num sei'],
  postura: ['postura', 'tipo postura', 'categoria'],
  sql_numero: ['sql', 'sql numero', 'nº sql', 'numero sql', 'n sql'],
  data_vistoria: ['data vistoria', 'data da vistoria', 'vistoria', 'data'],
  endereco: ['endereço', 'endereco', 'end', 'logradouro'],
  status: ['status', 'situação', 'situacao', 'estado'],
  observacoes: ['observações', 'observacoes', 'obs', 'notas', 'comentarios', 'comentários'],
};

function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[_\s]+/g, ' ')
    .trim();
}

function findColumnIndex(headers: string[], possibleNames: string[]): number {
  const normalizedHeaders = headers.map((h) => (h ? normalizeColumnName(String(h)) : ''));
  const normalizedNames = possibleNames.map(normalizeColumnName);

  // Prioridade 1: Match exato
  for (const name of normalizedNames) {
    const idx = normalizedHeaders.indexOf(name);
    if (idx !== -1) return idx;
  }

  // Prioridade 2: Começa com
  for (const name of normalizedNames) {
    const idx = normalizedHeaders.findIndex((h) => h.startsWith(name));
    if (idx !== -1) return idx;
  }

  // Prioridade 3: Contém (fallback)
  for (const name of normalizedNames) {
    const idx = normalizedHeaders.findIndex((h) => h.includes(name));
    if (idx !== -1) return idx;
  }

  return -1;
}

export function detectColumns(headers: string[]): CSVColumn[] {
  const columns: CSVColumn[] = headers.map((header, index) => ({
    index,
    header,
    mappedTo: null,
  }));

  const usedIndices = new Set<number>();

  // Mapear cada campo para uma coluna
  for (const [fieldName, aliases] of Object.entries(COLUMN_ALIASES)) {
    const idx = findColumnIndex(headers, aliases);
    if (idx !== -1 && !usedIndices.has(idx)) {
      columns[idx].mappedTo = fieldName;
      usedIndices.add(idx);
    }
  }

  return columns;
}

function detectDelimiter(text: string): string {
  const firstLine = text.split('\n')[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  
  if (semicolonCount > commaCount && semicolonCount > tabCount) return ';';
  if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
  return ',';
}

export function parseCSVText(text: string): string[][] {
  const delimiter = detectDelimiter(text);
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
      } else if (char === delimiter) {
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
}

// Normaliza datas para formato YYYY-MM-DD
function normalizeDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  const cleaned = dateStr.trim();
  
  // Já está no formato correto YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }
  
  // Formato DD/MM/YYYY ou DD-MM-YYYY
  const brMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Tenta parse genérico
  const date = new Date(cleaned);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  return null;
}

function findClosestMatch(value: string, validValues: readonly string[]): string | null {
  if (!value || value.trim() === '') return null;
  
  const normalizedValue = normalizeColumnName(value);
  
  // Match exato (case-insensitive, sem acentos)
  const exactMatch = validValues.find(
    (v) => normalizeColumnName(v) === normalizedValue
  );
  if (exactMatch) return exactMatch;

  // Match sem pontuação (para casos como "A.R." vs "AR")
  const noPunctValue = normalizedValue.replace(/[.\-]/g, '').replace(/\s+/g, ' ').trim();
  const noPunctMatch = validValues.find(
    (v) => normalizeColumnName(v).replace(/[.\-]/g, '').replace(/\s+/g, ' ').trim() === noPunctValue
  );
  if (noPunctMatch) return noPunctMatch;

  // Match parcial mais restrito - apenas se o valor normalizado for substancialmente similar
  const partialMatch = validValues.find((v) => {
    const normalizedValid = normalizeColumnName(v);
    // Requer que pelo menos 70% das palavras coincidam
    const valueWords = normalizedValue.split(' ').filter(w => w.length > 1);
    const validWords = normalizedValid.split(' ').filter(w => w.length > 1);
    
    if (valueWords.length === 0 || validWords.length === 0) return false;
    
    const matchingWords = valueWords.filter(vw => 
      validWords.some(validW => validW.includes(vw) || vw.includes(validW))
    );
    
    return matchingWords.length >= Math.max(1, Math.ceil(validWords.length * 0.7));
  });
  if (partialMatch) return partialMatch;

  return null;
}

export function validateAndParseCSV(text: string): ValidationResult {
  const lines = parseCSVText(text);
  
  if (lines.length < 2) {
    return {
      isValid: false,
      errors: [{ row: 0, field: 'arquivo', message: 'Arquivo CSV vazio ou sem dados' }],
      warnings: [],
      validRows: [],
      invalidRows: [],
      summary: { total: 0, valid: 0, errors: 1 },
      columns: [],
    };
  }

  const [headerRow, ...dataRows] = lines;
  const columns = detectColumns(headerRow);
  
  const validRows: ParsedRow[] = [];
  const invalidRows: { row: number; data: string[]; errors: ValidationIssue[] }[] = [];
  const allErrors: ValidationIssue[] = [];
  const allWarnings: ValidationIssue[] = [];

  // Criar mapa de índice para cada campo
  const fieldIndices: Record<string, number> = {};
  columns.forEach((col) => {
    if (col.mappedTo) {
      fieldIndices[col.mappedTo] = col.index;
    }
  });

  // Verificar colunas obrigatórias
  const requiredFields = ['numero_demanda', 'data_vistoria', 'postura', 'status'];
  const missingFields = requiredFields.filter((f) => fieldIndices[f] === undefined);
  
  if (missingFields.length > 0) {
    allWarnings.push({
      row: 0,
      field: 'colunas',
      message: `Colunas não detectadas: ${missingFields.join(', ')}. Verifique os cabeçalhos.`,
    });
  }

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 porque linha 1 é cabeçalho
    const rowErrors: ValidationIssue[] = [];

    const getValue = (field: string): string => {
      const idx = fieldIndices[field];
      return idx !== undefined ? (row[idx] || '').trim() : '';
    };

    const numero_demanda = getValue('numero_demanda');
    const numero_sei = getValue('numero_sei') || null;
    const posturaRaw = getValue('postura');
    const sql_numero = getValue('sql_numero') || null;
    const dataVistoriaRaw = getValue('data_vistoria');
    const endereco = getValue('endereco') || null;
    const statusRaw = getValue('status');
    const observacoes = getValue('observacoes') || null;

    // Validações
    if (!numero_demanda) {
      rowErrors.push({
        row: rowNumber,
        field: 'Nº Demanda',
        message: 'Campo obrigatório',
        value: numero_demanda,
      });
    }

    // Validar e normalizar data
    let data_vistoria: string | null = null;
    if (!dataVistoriaRaw) {
      rowErrors.push({
        row: rowNumber,
        field: 'Data Vistoria',
        message: 'Campo obrigatório',
        value: dataVistoriaRaw,
      });
    } else {
      data_vistoria = normalizeDate(dataVistoriaRaw);
      if (!data_vistoria) {
        rowErrors.push({
          row: rowNumber,
          field: 'Data Vistoria',
          message: 'Formato de data inválido. Use DD/MM/YYYY ou YYYY-MM-DD',
          value: dataVistoriaRaw,
        });
      }
    }

    // Validar e tentar corrigir postura
    let postura: PosturaType | null = null;
    if (!posturaRaw) {
      rowErrors.push({
        row: rowNumber,
        field: 'Postura',
        message: 'Campo obrigatório',
        value: posturaRaw,
      });
    } else {
      const matchedPostura = findClosestMatch(posturaRaw, POSTURAS);
      if (matchedPostura) {
        postura = matchedPostura as PosturaType;
      } else {
        rowErrors.push({
          row: rowNumber,
          field: 'Postura',
          message: `Valor inválido. Esperado: ${POSTURAS.slice(0, 3).join(', ')}...`,
          value: posturaRaw,
        });
      }
    }

    // Validar e tentar corrigir status
    let status: StatusType | null = null;
    if (!statusRaw) {
      rowErrors.push({
        row: rowNumber,
        field: 'Status',
        message: 'Campo obrigatório',
        value: statusRaw,
      });
    } else {
      const matchedStatus = findClosestMatch(statusRaw, STATUS_LIST);
      if (matchedStatus) {
        status = matchedStatus as StatusType;
      } else {
        rowErrors.push({
          row: rowNumber,
          field: 'Status',
          message: `Valor inválido. Esperado: ${STATUS_LIST.slice(0, 3).join(', ')}...`,
          value: statusRaw,
        });
      }
    }

    if (rowErrors.length === 0 && postura && status && data_vistoria) {
      validRows.push({
        numero_demanda,
        numero_sei,
        postura,
        sql_numero,
        data_vistoria,
        endereco,
        status,
        observacoes,
      });
    } else {
      invalidRows.push({ row: rowNumber, data: row, errors: rowErrors });
      allErrors.push(...rowErrors);
    }
  });

  return {
    isValid: validRows.length > 0 && allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    validRows,
    invalidRows,
    summary: {
      total: dataRows.length,
      valid: validRows.length,
      errors: invalidRows.length,
    },
    columns,
  };
}
