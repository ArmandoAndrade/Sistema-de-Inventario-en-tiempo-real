import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  //funcion para conectar el socket
  const connectSocket = useCallback(() => {
    if (!token || !user?.sede_id) return;

    const newSocket = io('http://localhost:4000', { //servidor backend
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    //Eventos del socket
    newSocket.on('connect', () => {
      console.log('Socket conectado');
      newSocket.emit('register-sede', user.sede_id);
      newSocket.emit('register-usuario', user.id);
      setIsSocketConnected(true);

    });

    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
      setIsSocketConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión Socket:', error);
      setIsSocketConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Error de WebSocket:', error);
    });

    newSocket.on('notificacion', (message) => {
      console.log('Notificación recibida:', message);
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          ...message,
          read: false
        }
      ]);
    });

    setSocket(newSocket);
    return newSocket;

  }, [token, user?.sede_id, user?.id]);

  //Función para limpiar notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Función para marcar notificación como leída
  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  //Función para eliminar notificación
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Efecto para manejar autenticación y socket
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Conectar socket cuando hay token y usuario
      const socketInstance = connectSocket();
      setSocket(socketInstance);
      return () => {
        if (socketInstance) {
          console.log('Desconectando socket');
          socketInstance.disconnect()
        }
      };
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setSocket(null);
    }
  }, [token, user, connectSocket]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      user,
      login,
      logout,
      socket,
      isSocketConnected,
      notifications,
      clearNotifications,
      markNotificationAsRead,
      removeNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
};
