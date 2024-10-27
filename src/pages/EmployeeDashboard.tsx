import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = () => {
    const authContext = useAuth();
    if (!authContext) {
        return <div>Error: Auth context is not available</div>;
    }
    const { logout } = authContext;

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <button onClick={logout}>Logout</button>
            {/* Add form for inputting daily inventory data */}
        </div>
    );
};

export default EmployeeDashboard;