import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const role = user.role || user.Role;

    if (adminOnly && role !== 'admin') {
        return <Navigate to="/user/dashboard" />;
    }

    return children;
};

export default PrivateRoute;