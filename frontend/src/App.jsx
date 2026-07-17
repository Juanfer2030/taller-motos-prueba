import { Routes, Route, Link } from 'react-router-dom';
import WorkOrdersList from './pages/WorkOrdersList';
import WorkOrderCreate from './pages/WorkOrderCreate';
import WorkOrderDetail from './pages/WorkOrderDetail';

function App() {
  return (
    <div>
       <nav>
        <Link to="/">Órdenes</Link> | <Link to="/work-orders/new">Nueva Orden</Link>
       </nav>

      <Routes>
        <Route path="/" element={<WorkOrdersList />} />
        <Route path="/work-orders/new" element={<WorkOrderCreate />} />
        <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
      </Routes>
    </div>
  );
}

export default App;