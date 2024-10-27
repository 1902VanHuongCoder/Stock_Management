import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
// import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>

      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>

    </AuthProvider>
  );
};

export default App;