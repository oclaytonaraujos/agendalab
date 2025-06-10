
-- Primeiro, criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coordenacao', 'professor')),
  departamento TEXT,
  telefone TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de laboratórios
CREATE TABLE public.laboratorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  capacidade INTEGER NOT NULL DEFAULT 30,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de materiais com os status corretos
CREATE TABLE public.materiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,
  minimo INTEGER NOT NULL DEFAULT 0,
  localizacao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'baixo', 'critico')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agendamentos com referência ao laboratório
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  professor TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  turma TEXT NOT NULL,
  laboratorio_id UUID NOT NULL REFERENCES public.laboratorios(id),
  status TEXT NOT NULL DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'pendente', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de movimentações de materiais
CREATE TABLE public.movimentacoes_materiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES public.materiais(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  quantidade INTEGER NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_materiais ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin and coordenacao can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

CREATE POLICY "Admin and coordenacao can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

CREATE POLICY "Admin and coordenacao can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

CREATE POLICY "Admin and coordenacao can delete profiles" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

-- Políticas para laboratórios
CREATE POLICY "Everyone can view active laboratories" ON public.laboratorios
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admin and coordenacao can manage laboratories" ON public.laboratorios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

-- Políticas para materiais
CREATE POLICY "Everyone can view materiais" ON public.materiais
  FOR SELECT USING (true);

CREATE POLICY "Admin and coordenacao can manage materiais" ON public.materiais
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

-- Políticas para agendamentos
CREATE POLICY "Everyone can view agendamentos" ON public.agendamentos
  FOR SELECT USING (true);

CREATE POLICY "Users can create agendamentos" ON public.agendamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agendamentos" ON public.agendamentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin and coordenacao can update all agendamentos" ON public.agendamentos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordenacao')
    )
  );

-- Políticas para movimentações
CREATE POLICY "Everyone can view movimentacoes" ON public.movimentacoes_materiais
  FOR SELECT USING (true);

CREATE POLICY "Users can create movimentacoes" ON public.movimentacoes_materiais
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, departamento, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'professor'),
    COALESCE(NEW.raw_user_meta_data->>'departamento', 'Não informado'),
    COALESCE(NEW.raw_user_meta_data->>'telefone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para calcular status do material baseado no estoque
CREATE OR REPLACE FUNCTION public.calculate_material_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.status = CASE 
    WHEN NEW.estoque <= 0 THEN 'critico'
    WHEN NEW.estoque <= NEW.minimo THEN 'baixo'
    ELSE 'ok'
  END;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger para atualizar status automaticamente
CREATE TRIGGER trigger_calculate_material_status
  BEFORE INSERT OR UPDATE OF estoque, minimo ON public.materiais
  FOR EACH ROW EXECUTE PROCEDURE public.calculate_material_status();

-- Inserir laboratórios padrão
INSERT INTO public.laboratorios (nome, capacidade, descricao) VALUES
  ('Laboratório A', 30, 'Laboratório principal de ciências'),
  ('Laboratório B', 25, 'Laboratório de química'),
  ('Laboratório C', 20, 'Laboratório de física'),
  ('Laboratório de Informática', 35, 'Laboratório de informática educativa');

-- Inserir alguns materiais iniciais
INSERT INTO public.materiais (nome, categoria, estoque, minimo, localizacao) VALUES
  ('Microscópio Digital', 'Equipamentos', 15, 5, 'Armário A1'),
  ('Tubos de Ensaio', 'Vidraria', 5, 20, 'Armário B2'),
  ('Lâminas de Microscópio', 'Vidraria', 8, 25, 'Armário B1'),
  ('Béqueres 250ml', 'Vidraria', 30, 15, 'Armário C1'),
  ('Pipetas Graduadas', 'Vidraria', 25, 10, 'Armário C2'),
  ('Balança Analítica', 'Equipamentos', 3, 2, 'Bancada Central'),
  ('Reagente Ácido Clorídrico', 'Reagentes', 2, 5, 'Armário Segurança'),
  ('Luvas de Procedimento', 'Segurança', 45, 50, 'Armário D1');
