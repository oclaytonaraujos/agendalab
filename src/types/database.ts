
import { Database } from '@/integrations/supabase/types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Type aliases for convenience
export type Profile = Tables<'profiles'>;
export type Agendamento = Tables<'agendamentos'>;
export type Material = Tables<'materiais'>;
export type Laboratorio = Tables<'laboratorios'>;
export type MovimentacaoMaterial = Tables<'movimentacoes_materiais'>;
