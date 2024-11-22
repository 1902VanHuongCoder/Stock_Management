import { useAuth } from '../contexts/AuthContext';
import { NavigationBar } from '../helpers';

const AdminDashboard = () => {
    const authContext = useAuth();
    if (!authContext) {
        return <div>Error: Auth context is not available</div>;
    }
    return (
        <div className='bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div>
                
            </div>
        </div>
    );
};

export default AdminDashboard;