import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
// import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home'
import Introduction from './pages/Introduction';

const App = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  if (userId) {
    console.log('userId', userId);
    navigate('/');
  } else {

    navigate('/dangnhap');
  }
  console.log('userId', userId);
  return (
    <AuthProvider>

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Introduction />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dangnhap" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>

    </AuthProvider>
  );
};

export default App;