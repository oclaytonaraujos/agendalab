
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Hook para buscar agendamentos
export const useAgendamentos = () => {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          laboratorios (
            id,
            nome,
            capacidade
          )
        `)
        .order('data', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar materiais
export const useMateriais = () => {
  return useQuery({
    queryKey: ['materiais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar laboratórios
export const useLaboratorios = () => {
  return useQuery({
    queryKey: ['laboratorios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laboratorios')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar perfis de usuários
export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para criar agendamento
export const useCreateAgendamento = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (agendamento: {
      data: string;
      horario: string;
      disciplina: string;
      turma: string;
      laboratorio_id: string;
      observacoes?: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          ...agendamento,
          user_id: user.id,
          professor: user.name,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};

// Hook para atualizar agendamento
export const useUpdateAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('agendamentos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};

// Hook para deletar agendamento
export const useDeleteAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};

// Hook para criar material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (material: {
      nome: string;
      categoria: string;
      estoque: number;
      minimo: number;
      localizacao: string;
    }) => {
      const { data, error } = await supabase
        .from('materiais')
        .insert(material)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
    },
  });
};

// Hook para atualizar material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('materiais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
    },
  });
};

// Hook para movimentação de material
export const useCreateMovimentacao = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (movimentacao: {
      material_id: string;
      tipo: 'entrada' | 'saida';
      quantidade: number;
      observacoes?: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('movimentacoes_materiais')
        .insert({
          ...movimentacao,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estoque do material
      const { data: material } = await supabase
        .from('materiais')
        .select('estoque')
        .eq('id', movimentacao.material_id)
        .single();

      if (material) {
        const novoEstoque = movimentacao.tipo === 'entrada' 
          ? material.estoque + movimentacao.quantidade
          : material.estoque - movimentacao.quantidade;

        await supabase
          .from('materiais')
          .update({ estoque: Math.max(0, novoEstoque) })
          .eq('id', movimentacao.material_id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiais'] });
    },
  });
};
