// Mais_Saudavel_FrontEnd/admin/src/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}
