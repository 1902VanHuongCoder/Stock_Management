import { Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect, useContext } from 'react';
import { NLogin, Introduction, ALogin, Home, EmployeeDashboard, AdminDashboard, StockDetails, AddStockInfo, AddStaff } from './helpers';
import SideBar from './components/SideBar';
import SideBarContext from './contexts/SideBarContext';

const App = () => {
  const navigate = useNavigate();
  const { isOpen } = useContext(SideBarContext);
  // const userId = localStorage.getItem('userId');

  // useEffect(() => {
  //   if (userId) { // If user is logged in, redirect to home page
  //     navigate('/');
  //   } else {
  //     navigate('/dangnhap'); // If user is not logged in, redirect to login page
  //   }
  // }, [navigate, userId]);
  return (
    <div className='relative'>
      <SideBar />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/quanly/dangnhap" element={<ALogin />} />
          <Route path="/nhanvien/dangnhap" element={<NLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quanly/nguyenkiet" element={<AdminDashboard />} />
          <Route path="/quanly/nguyenkiet/chinhanh/:id" element={<StockDetails />} />
          <Route path="/nhanvien/capnhattonkho" element={<AddStockInfo />} />
          <Route path="/quanly/themnhanvien" element={<AddStaff />} />

          <Route path="/dangnhap" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Routes>

      </AuthProvider>
    </div>

  );
};

export default App;