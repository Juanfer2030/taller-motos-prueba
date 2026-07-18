import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const userGuardado = localStorage.getItem('user');

    if (tokenGuardado && userGuardado) {
      setToken(tokenGuardado);
      setUser(JSON.parse(userGuardado));
    }

    setCargando(false);
  }, []);

  function login(tokenNuevo, userNuevo) {
    localStorage.setItem('token', tokenNuevo);
    localStorage.setItem('user', JSON.stringify(userNuevo));
    setToken(tokenNuevo);
    setUser(userNuevo);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}