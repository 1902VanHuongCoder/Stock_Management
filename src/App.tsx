import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ApprovePageTab02, ApprovePage, ErrorPage, ConfirmDialog, Loading, SideBar, StaffDashboard, UpdateBranch, Notification, NLogin, Introduction, ALogin, Home, EmployeeDashboard, AdminDashboard, StockDetails, AddStockInfo, AddStaff } from './helpers';
// TO VAN HUONG - PAUL TO - VIET NAM
const App = () => {
  return (
    <div className='relative'>
      <Notification /> {/* Notification coponent */}
      <SideBar /> {/* SideBar component */}
      <Loading />
      <ConfirmDialog />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/quanly/dangnhap" element={<ALogin />} />
          <Route path="/nhanvien/dangnhap" element={<NLogin />} />
          <Route path="/nguyenkiet/nhanvien/nhaplieukho/:branchId" element={<Home />} />
          {/* TO VAN HUONG - PAUL TO - VIET NAM */}
          <Route path="/quanly/nguyenkiet" element={<AdminDashboard />} />
          <Route path="/quanly/nguyenkiet/chinhanh/:branchId" element={<StockDetails />} />
          <Route path="/nhanvien/capnhattonkho" element={<AddStockInfo />} />
          <Route path="/quanly/themnhanvien" element={<AddStaff />} />
          <Route path="/quanly/capnhatchinhanh/:id" element={<UpdateBranch />} />
          <Route path="/quanly/duyetthongtin/01" element={<ApprovePage />} />
          <Route path="/quanly/duyetthongtin/02" element={<ApprovePageTab02 />} />
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

// TO VAN HUONG - PAUL TO - VIET NAM