import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
    const authContext = useAuth();
    if (!authContext) {
        return <div>Error: Auth context is not available</div>;
    }
    const { logout } = authContext;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={logout}>Logout</button>
            {/* Add components for managing branches, employees, and inventory */}
        </div>
    );
};

export default AdminDashboard;