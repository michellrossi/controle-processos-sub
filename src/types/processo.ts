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
  | 'Em análise'
  | 'Vistoriado'
  | 'Notificado'
  | 'Regularizado'
  | 'Irregular'
  | 'Arquivado';

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
  'Em análise',
  'Vistoriado',
  'Notificado',
  'Regularizado',
  'Irregular',
  'Arquivado',
];

export const STATUS_COLORS: Record<StatusType, { bg: string; text: string; label: string }> = {
  'Em análise': { bg: 'bg-status-analise', text: 'text-white', label: 'Em análise' },
  'Vistoriado': { bg: 'bg-status-vistoriado', text: 'text-white', label: 'Vistoriado' },
  'Notificado': { bg: 'bg-status-notificado', text: 'text-white', label: 'Notificado' },
  'Regularizado': { bg: 'bg-status-regularizado', text: 'text-white', label: 'Regularizado' },
  'Irregular': { bg: 'bg-status-irregular', text: 'text-white', label: 'Irregular' },
  'Arquivado': { bg: 'bg-status-arquivado', text: 'text-white', label: 'Arquivado' },
};
