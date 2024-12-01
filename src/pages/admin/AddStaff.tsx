import React, { useState, useEffect, useContext } from 'react';
import { NavigationBar } from '../../helpers';
import { collection, addDoc, getDocs } from 'firebase/firestore/lite';
import { db } from '../../services/firebaseConfig';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmContext from '../../contexts/ConfirmContext';
import NotificationContext from '../../contexts/NotificationContext';
import LoadingContext from '../../contexts/LoadingContext';
import { doc, updateDoc } from 'firebase/firestore/lite';

const AddStaff = () => {
  const [branchCode, setBranchCode] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [password, setPassword] = useState('');
  const [error,] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({ id: '', branchCode: '', staffCode: '', staffName: '', password: '', createdAt: '' });

  const { setDataToDelete } = useContext(ConfirmContext);
  const { setTypeAndMessage } = useContext(NotificationContext);
  const { open, close } = useContext(LoadingContext);
  interface Staff {
    id: string;
    branchCode: string;
    staffCode: string;
    staffName: string;
    password: string;
    createdAt: string;
  }

  const [staffs, setStaffs] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      open();// Show loading backdrop
      try {
        const querySnapshot = await getDocs(collection(db, 'staffs'));
        const staffList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            branchCode: data.branchCode,
            staffCode: data.staffCode,
            staffName: data.staffName,
            password: data.password,
            createdAt: data.createdAt,
          };
        });
        console.log(staffList)
        setStaffs(staffList);
        close();// Hide loading backdrop
      } catch (error) {
        console.error('Error fetching staff:', error);
        setTypeAndMessage('fail', 'Kết nối không ổn định! Hãy thử lại sau!');
        close();// Hide loading backdrop
      }
    };

    fetchStaffs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    open();// Show loading backdrop

    // Validate input fields
    if (!branchCode || !staffCode || !staffName || !password) {
      setTypeAndMessage('fail', 'Vui lòng điền đầy đủ thông tin!');
      close();// Hide loading backdrop
      return;
    }

    const regex1 = /^CN.{3}$/;
    if (!regex1.test(branchCode)) { // Check if branchCode is in the correct format (CN_ _ _)
      setTypeAndMessage('fail', 'Mã chi nhánh phải bắt đầu bằng CN và theo sau là 3 ký tự số!');
      close();// Hide loading backdrop
      return;
    }

    const regex = /^NV.{3}$/;
    if (!regex.test(staffCode)) { // Check if staffCode is in the correct format (NV_ _ _)
      setTypeAndMessage('fail', 'Mã nhân viên phải bắt đầu bằng NV và theo sau là 3 ký tự số!');
      close();// Hide loading backdrop
      return;
    }

    if (password.length <= 7) { // Check if password is at least 8 characters long
      setTypeAndMessage('fail', 'Mật khẩu phải có ít nhất 8 ký tự');
      close();// Hide loading backdrop
      return;
    }


    // Check if staffCode already exists
    try {
      const querySnapshot = await getDocs(collection(db, 'staffs')); // Get all staffs
      let isStaffExist = false;
      querySnapshot.forEach((doc) => {
        if (doc.data().staffCode === staffCode) { // Check if staffCode already exists 
          isStaffExist = true;
        }
      })

      if (isStaffExist) { // If staffCode already exists, show error message
        setTypeAndMessage('fail', 'Mã nhân viên đã tồn tại! Vui lòng chọn mã khác!');
        close();// Hide loading backdrop
        return;
      }
    } catch (error) {
      close();// Hide loading backdrop
      console.error('Error checking staffCode:', error);
      setTypeAndMessage('fail', 'Kết nối không ổn định! Hãy thử lại sau!');
    }

    // Save to Firestore
    try {
      await addDoc(collection(db, 'staffs'), { // Add new staff if staffCode does not exist
        branchCode,
        staffCode,
        staffName,
        password, // Note: In a real application, you should hash the password before saving
        createdAt: new Date().toISOString(),
      });
      setTypeAndMessage('success', 'Thêm nhân viên thành công!');
      // Clear form fields
      setBranchCode('');
      setStaffCode('');
      setStaffName('');
      setPassword('');
      // Fetch updated staff list
      const querySnapshot1 = await getDocs(collection(db, 'staffs'));
      const staffList = querySnapshot1.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          branchCode: data.branchCode,
          staffCode: data.staffCode,
          staffName: data.staffName,
          password: data.password,
          createdAt: data.createdAt,
        };
      });
      setStaffs(staffList);
      close();// Hide loading backdrop
    } catch (error) {
      console.error('Error adding staff:', error);
      setTypeAndMessage('fail', 'Kết nối không ổn định! Hãy thử lại sau!');
      close();// Hide loading backdrop
    }
  };

  const handleDeleteStaff = (id: string) => {
    setDataToDelete('Xác nhận xóa nhân viên', id, 'staffs');
  }

  const handleEditStaff = (staff: React.SetStateAction<{ id: string; branchCode: string; staffCode: string; staffName: string; password: string; createdAt: string; }>) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    open();// Show loading backdrop
    if (!selectedStaff.branchCode || !selectedStaff.staffCode || !selectedStaff.staffName || !selectedStaff.password) {
      setTypeAndMessage('fail', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const regex1 = /^CN.{3}$/;
    if (!regex1.test(selectedStaff.branchCode)) {
      setTypeAndMessage('fail', 'Mã chi nhánh phải bắt đầu bằng CN và theo sau là 3 ký tự số!');
      close();// Hide loading backdrop
      return;
    }

    const regex = /^NV.{3}$/;
    if (!regex.test(selectedStaff.staffCode)) {
      setTypeAndMessage('fail', 'Mã nhân viên phải bắt đầu bằng NV và theo sau là 3 ký tự số!');
      close();// Hide loading backdrop
      return;
    }

    if (selectedStaff.password.length <= 7) {
      setTypeAndMessage('fail', 'Mật khẩu phải có ít nhất 8 ký tự');
      close();// Hide loading backdrop
      return;
    }

    try {
      await updateDoc(doc(db, 'staffs', selectedStaff.id), {
        branchCode: selectedStaff.branchCode,
        staffCode: selectedStaff.staffCode,
        staffName: selectedStaff.staffName,
        password: selectedStaff.password,
        updatedAt: new Date().toISOString(),
      });
      setTypeAndMessage('success', 'Cập nhật nhân viên thành công!');
      setIsModalOpen(false);
      // Fetch updated staff list
      const querySnapshot = await getDocs(collection(db, 'staffs'));
      const staffList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          branchCode: data.branchCode,
          staffCode: data.staffCode,
          staffName: data.staffName,
          password: data.password,
          createdAt: data.createdAt,
        };
      });
      setStaffs(staffList);
      close();// Hide loading backdrop
    } catch (error) {
      console.error('Error updating staff:', error);
      setTypeAndMessage('fail', 'Kết nối không ổn định! Hãy thử lại sau!');
      close();// Hide loading backdrop
    }
  };

  return (
    <div className='bg-[#15B392] min-h-screen max-w-screen'>
      <NavigationBar />
      <div className="flex justify-center items-center pt-10">
        <p className='w-full px-5 flex items-center'>
          <span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
          <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'>
            <span className=''>THÊM NHÂN VIÊN</span>
          </span>
        </p>
      </div>
      <div className='flex justify-center items-center pt-10'>
        <form onSubmit={handleSubmit} className='px-6 w-full max-w-md'>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          <div className='mb-4'>
            <label htmlFor="branchCode" className='block font-medium mb-2 text-white drop-shadow-md'>Mã chi nhánh (<span className='text-red-500'>*</span>)</label>
            <input
              placeholder='CN_ _ _'
              type="text"
              id="branchCode"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className='w-full p-3 rounded-sm border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="staffCode" className='block text-white font-medium mb-2  drop-shadow-md'>Mã nhân viên (<span className='text-red-500'>*</span>)</label>
            <input
              placeholder='NV_ _ _'
              type="text"
              id="staffCode"
              value={staffCode}
              onChange={(e) => setStaffCode(e.target.value)}
              className='w-full p-3 rounded-sm border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="staffName" className='block text-white font-medium mb-2 drop-shadow-md'>Tên nhân viên(<span className='text-red-500'>*</span>)</label>
            <input
              placeholder='Nhập tên nhân viên...'
              type="text"
              id="staffName"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className='w-full p-3 rounded-sm border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="password" className='block text-white font-medium mb-2 drop-shadow-md'>Mật khẩu (<span className='text-red-500'>*</span>)</label>
            <input
              placeholder='Nhập mật khẩu...'
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 rounded-sm border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='flex justify-end'>
            <button type="submit" className='hover:opacity-80 bg-white px-6 py-2 font-bold rounded-sm border-solid border-[5px] border-[#73EC8B]'>
              THÊM
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center pt-10">
        <p className='w-full px-5 flex items-center'>
          <span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
          <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'>
            <span className=''>DANH SÁCH NHÂN VIÊN</span>
          </span>
        </p>
      </div>
      <div className='px-6 pt-10 pb-6 w-screen overflow-x-auto'>
        <table className='w-[1024px] bg-white border-gray-300 rounded-md'>
          <thead>
            <tr className='bg-slate-200'>
              <th className='border border-gray-300 px-4 py-2'>Mã CN</th>
              <th className='border border-gray-300 px-4 py-2'>Mã NV</th>
              <th className='border border-gray-300 px-4 py-2'>Tên</th>
              <th className='border border-gray-300 px-4 py-2'>Mật khẩu</th>
              <th className='border border-gray-300 px-4 py-2'>Ngày gia nhập</th>
              <th className='border border-gray-300 px-4 py-2'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff) => (
              <tr key={staff.id} className='border'>
                <td className=' border-gray-300 px-4 py-2'>{staff.branchCode}</td>
                <td className=' border-gray-300 px-4 py-2'>{staff.staffCode}</td>
                <td className=' border-gray-300 px-4 py-2'>{staff.staffName}</td>
                <td className=' border-gray-300 px-4 py-2'>{staff.password}</td>
                <td className=' border-gray-300 px-4 py-2'>{staff.createdAt}</td>
                <td className='px-4 py-2 flex justify-around items-center gap-x-4'>
                  <button onClick={() => handleEditStaff(staff)} className='text-blue-500 hover:text-blue-700'><FaEdit /></button>
                  <button onClick={() => handleDeleteStaff(staff.id)} className='text-red-500 hover:text-red-700'><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-sm shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center uppercase py-2 text-[#15B392] drop-shadow-md">Cập nhật nhân viên</h2>
            <form onSubmit={handleUpdateStaff}>
              {error && <p className='text-red-500 mb-4'>{error}</p>}
              <div className='mb-4'>
                <label htmlFor="editBranchCode" className='block text-gray-700 font-medium mb-2'>Mã chi nhánh</label>
                <input
                  type="text"
                  id="editBranchCode"
                  value={selectedStaff?.branchCode || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, branchCode: e.target.value })}
                  className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="editStaffCode" className='block text-gray-700 font-medium mb-2'>Mã nhân viên</label>
                <input
                  type="text"
                  id="editStaffCode"
                  value={selectedStaff?.staffCode || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, staffCode: e.target.value })}
                  className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="editStaffName" className='block text-gray-700 font-medium mb-2'>Tên nhân viên</label>
                <input
                  type="text"
                  id="editStaffName"
                  value={selectedStaff?.staffName || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, staffName: e.target.value })}
                  className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="editPassword" className='block text-gray-700 font-medium mb-2'>Mật khẩu</label>
                <input
                  type="password"
                  id="editPassword"
                  value={selectedStaff?.password || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, password: e.target.value })}
                  className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                  required
                />
              </div>
              <div className='flex justify-end gap-x-2'>
                <button type="button" onClick={() => setIsModalOpen(false)} className='px-4 py-2 bg-gray-300 rounded-lg'>Hủy</button>
                <button type="submit" className='px-4 py-2 bg-[#15B392] text-white rounded-md hover:opacity-80'>Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStaff;