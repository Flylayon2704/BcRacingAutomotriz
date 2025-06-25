import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const login = async (username: string, password: string) => {
    // Simular autenticación
    if (username && password) {
      setIsAuthenticated(true);
      setUser({ username });
      return Promise.resolve();
    }
    return Promise.reject('Invalid credentials');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};