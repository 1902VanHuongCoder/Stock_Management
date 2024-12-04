import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// import { useContext } from 'react';
// import SideBarContext from './contexts/SideBarContext';
import { ErrorPage, ConfirmDialog, Loading, SideBar, StaffDashboard, UpdateBranch, Notification, NLogin, Introduction, ALogin, Home, EmployeeDashboard, AdminDashboard, StockDetails, AddStockInfo, AddStaff } from './helpers';

const App = () => {
  // const navigate = useNavigate();
  // const { isOpen } = useContext(SideBarContext);
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
      <Notification />
      <SideBar />
      <Loading />
      <ConfirmDialog />
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
          <Route path="/quanly/capnhatchinhanh/:id" element={<UpdateBranch />} />
          <Route path="/nhanvien/kho" element={<StaffDashboard />} />

          <Route path="/dangnhap" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />

          <Route path="*" element={<ErrorPage />} /> {/* Catch-all route */}
        </Routes>

      </AuthProvider>
    </div>

  );
};

export default App;