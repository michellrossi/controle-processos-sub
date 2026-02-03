-- Enum para tipos de postura
CREATE TYPE public.postura_type AS ENUM (
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
  'Manejo Arbóreo'
);

-- Enum para status do processo
CREATE TYPE public.status_type AS ENUM (
  'Em análise',
  'Vistoriado',
  'Notificado',
  'Regularizado',
  'Irregular',
  'Arquivado'
);

-- Tabela principal de processos
CREATE TABLE public.processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero_demanda TEXT NOT NULL,
  numero_sei TEXT,
  postura postura_type NOT NULL,
  sql_numero TEXT,
  data_vistoria DATE NOT NULL,
  endereco TEXT,
  status status_type NOT NULL DEFAULT 'Em análise',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Índices para performance
CREATE INDEX idx_processos_user_id ON public.processos(user_id);
CREATE INDEX idx_processos_status ON public.processos(status);
CREATE INDEX idx_processos_postura ON public.processos(postura);
CREATE INDEX idx_processos_data_vistoria ON public.processos(data_vistoria);

-- Habilitar RLS
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários autenticados acessam apenas seus dados
CREATE POLICY "Users can view their own processos"
  ON public.processos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processos"
  ON public.processos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processos"
  ON public.processos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processos"
  ON public.processos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_processos_updated_at
  BEFORE UPDATE ON public.processos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();