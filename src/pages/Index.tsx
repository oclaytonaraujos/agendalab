
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from "./Dashboard";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário for professor, redirecionar para agendamentos
    if (user && user.role === 'professor') {
      navigate('/agendamentos');
    }
  }, [user, navigate]);

  // Se não for professor, mostrar dashboard
  if (user && user.role !== 'professor') {
    return <Dashboard />;
  }

  // Se for professor, não renderizar nada (será redirecionado)
  return null;
};

export default Index;
