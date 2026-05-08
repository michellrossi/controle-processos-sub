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

export const STATUS_COLORS: Record<StatusType, { badge: string; label: string }> = {
  'Ação necessária': { badge: 'badge-acao', label: 'Ação necessária' },
  'Demanda concluída': { badge: 'badge-concluida', label: 'Demanda concluída' },
  'Demanda devolvida': { badge: 'badge-devolvida', label: 'Demanda devolvida' },
  'Demanda agrupada': { badge: 'badge-agrupada', label: 'Demanda agrupada' },
  'Auto emitido': { badge: 'badge-auto', label: 'Auto emitido' },
  'A.R. devolvido': { badge: 'badge-ar-devolvido', label: 'A.R. devolvido' },
  'A.R. entregue': { badge: 'badge-ar-entregue', label: 'A.R. entregue' },
};

