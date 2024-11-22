import { Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import {  NLogin, Introduction, ALogin, Home, EmployeeDashboard, AdminDashboard } from './helpers';

const App = () => {
  const navigate = useNavigate();
  // const userId = localStorage.getItem('userId');

  // useEffect(() => {
  //   if (userId) { // If user is logged in, redirect to home page
  //     navigate('/');
  //   } else {
  //     navigate('/dangnhap'); // If user is not logged in, redirect to login page
  //   }
  // }, [navigate, userId]);
  return (
    <AuthProvider>

      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/quanly/dangnhap" element={<ALogin />} />
        <Route path="/nhanvien/dangnhap" element={<NLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quanly/nguyenkiet" element={<AdminDashboard />} />
        <Route path="/dangnhap" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>

    </AuthProvider>
  );
};

export default App;