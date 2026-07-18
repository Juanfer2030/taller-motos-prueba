import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import WorkOrdersList from './pages/WorkOrdersList';
import WorkOrderCreate from './pages/WorkOrderCreate';
import WorkOrderDetail from './pages/WorkOrderDetail';
import Login from './pages/Login';
import RutaProtegida from './components/RutaProtegida';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      {user && (
        <nav className="flex justify-between items-center p-4 border-b">
          <div>
            <Link to="/">Órdenes</Link> | <Link to="/work-orders/new">Nueva Orden</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
              Cerrar sesión
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RutaProtegida>
              <WorkOrdersList />
            </RutaProtegida>
          }
        />
        <Route
          path="/work-orders/new"
          element={
            <RutaProtegida>
              <WorkOrderCreate />
            </RutaProtegida>
          }
        />
        <Route
          path="/work-orders/:id"
          element={
            <RutaProtegida>
              <WorkOrderDetail />
            </RutaProtegida>
          }
        />
      </Routes>
    </div>
  );
}

export default App;