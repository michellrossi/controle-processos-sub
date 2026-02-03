-- Drop the default value first
ALTER TABLE public.processos ALTER COLUMN status DROP DEFAULT;

-- Create new enum type
CREATE TYPE status_type_new AS ENUM (
  'Ação necessária',
  'Demanda concluída',
  'Demanda devolvida',
  'Demanda agrupada',
  'Auto emitido',
  'A.R. devolvido',
  'A.R. entregue'
);

-- Convert column to text, map old values to new, then to new enum
ALTER TABLE public.processos 
  ALTER COLUMN status TYPE text USING status::text;

-- Update existing data to new status values
UPDATE public.processos SET status = 'Ação necessária' WHERE status = 'Em análise';
UPDATE public.processos SET status = 'Demanda concluída' WHERE status = 'Regularizado';
UPDATE public.processos SET status = 'Demanda devolvida' WHERE status = 'Arquivado';
UPDATE public.processos SET status = 'Auto emitido' WHERE status = 'Notificado';
UPDATE public.processos SET status = 'A.R. entregue' WHERE status = 'Vistoriado';
UPDATE public.processos SET status = 'A.R. devolvido' WHERE status = 'Irregular';

-- Convert to new enum type
ALTER TABLE public.processos 
  ALTER COLUMN status TYPE status_type_new 
  USING status::status_type_new;

-- Drop old enum and rename new one
DROP TYPE status_type;
ALTER TYPE status_type_new RENAME TO status_type;

-- Set new default
ALTER TABLE public.processos ALTER COLUMN status SET DEFAULT 'Ação necessária'::status_type;