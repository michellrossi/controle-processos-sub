export type PosturaType =
  | 'ATIVIDADE'
  | 'OBRAS'
  | 'MPL'
  | 'POP'
  | 'Falta de AFLR'
  | 'Acessibilidade'
  | 'Limpeza'
  | 'SABESP'
  | 'Área Pública'
  | 'Invasão'
  | 'Ambulante'
  | 'Equipamento'
  | 'Recurso Multa'
  | 'COMGÁS'
  | 'Publicidade'
  | 'Comando Noturno'
  | 'Manejo Arbóreo';

export type StatusType =
  | 'Ação necessária'
  | 'Demanda concluída'
  | 'Demanda devolvida'
  | 'Demanda agrupada'
  | 'Auto emitido'
  | 'A.R. devolvido'
  | 'A.R. entregue';

export interface Processo {
  id: string;
  user_id: string;
  numero_demanda: string;
  numero_sei: string | null;
  postura: PosturaType;
  sql_numero: string | null;
  data_vistoria: string;
  endereco: string | null;
  status: StatusType;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export const POSTURAS: PosturaType[] = [
  'ATIVIDADE',
  'OBRAS',
  'MPL',
  'POP',
  'Falta de AFLR',
  'Acessibilidade',
  'Limpeza',
  'SABESP',
  'Área Pública',
  'Invasão',
  'Ambulante',
  'Equipamento',
  'Recurso Multa',
  'COMGÁS',
  'Publicidade',
  'Comando Noturno',
  'Manejo Arbóreo',
];

export const STATUS_LIST: StatusType[] = [
  'Ação necessária',
  'Demanda concluída',
  'Demanda devolvida',
  'Demanda agrupada',
  'Auto emitido',
  'A.R. devolvido',
  'A.R. entregue',
];

export const STATUS_COLORS: Record<StatusType, { bg: string; text: string; label: string }> = {
  'Ação necessária': { bg: 'bg-status-acao', text: 'text-white', label: 'Ação necessária' },
  'Demanda concluída': { bg: 'bg-status-concluida', text: 'text-white', label: 'Demanda concluída' },
  'Demanda devolvida': { bg: 'bg-status-devolvida', text: 'text-white', label: 'Demanda devolvida' },
  'Demanda agrupada': { bg: 'bg-status-agrupada', text: 'text-white', label: 'Demanda agrupada' },
  'Auto emitido': { bg: 'bg-status-auto', text: 'text-white', label: 'Auto emitido' },
  'A.R. devolvido': { bg: 'bg-status-ar-devolvido', text: 'text-white', label: 'A.R. devolvido' },
  'A.R. entregue': { bg: 'bg-status-ar-entregue', text: 'text-white', label: 'A.R. entregue' },
};
