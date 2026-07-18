import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaProtegida({ children }) {
  const { user, cargando } = useAuth();

  if (cargando) {
    return <p className="p-6">Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;