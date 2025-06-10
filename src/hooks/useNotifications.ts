
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  relatedTo?: {
    type: 'agendamento' | 'material' | 'usuario';
    id: string;
  };
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simular notificações baseadas no tipo de usuário
  useEffect(() => {
    if (!user) return;

    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Novo agendamento',
        message: 'Você tem um novo agendamento para hoje às 14:00',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        relatedTo: { type: 'agendamento', id: 'ag1' }
      },
      {
        id: '2',
        title: 'Material em falta',
        message: 'O material "Microscópio Digital" está com estoque baixo',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        relatedTo: { type: 'material', id: 'mat1' }
      },
      {
        id: '3',
        title: 'Agendamento aprovado',
        message: 'Seu agendamento para o Laboratório A foi aprovado',
        type: 'success',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        relatedTo: { type: 'agendamento', id: 'ag2' }
      }
    ];

    // Adicionar notificações específicas para admin/coordenação
    if (user.role === 'admin' || user.role === 'coordenacao') {
      mockNotifications.unshift(
        {
          id: '4',
          title: 'Novo usuário cadastrado',
          message: 'Um novo professor foi cadastrado no sistema',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
          relatedTo: { type: 'usuario', id: 'user1' }
        },
        {
          id: '5',
          title: 'Agendamento cancelado por professor',
          message: 'Prof. Maria Silva cancelou seu agendamento de Química para hoje às 10:00',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
          relatedTo: { type: 'agendamento', id: 'ag3' }
        },
        {
          id: '6',
          title: 'Agendamento editado por professor',
          message: 'Prof. João Santos alterou seu agendamento de Física para amanhã às 14:00',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
          relatedTo: { type: 'agendamento', id: 'ag4' }
        }
      );
    }

    setNotifications(mockNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };
};
