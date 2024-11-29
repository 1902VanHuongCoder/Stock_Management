import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../../helpers';
import { collection, addDoc, getDocs } from 'firebase/firestore/lite';
import { db } from '../../services/firebaseConfig';

const AddStaff = () => {
  const [branchCode, setBranchCode] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaffs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields
    if (!branchCode) {
      setError('Branch code is required');
      return;
    }
    if (!staffCode) {
      setError('Staff code is required');
      return;
    }
    if (!staffName) {
      setError('Staff name is required');
      return;
    }
    if (!password || password.length <= 7) {
      setError('Password must be longer than 7 characters');
      return;
    }

    // Clear error
    setError('');

    // Save to Firestore
    try {
      await addDoc(collection(db, 'staffs'), {
        branchCode,
        staffCode,
        staffName,
        password, // Note: In a real application, you should hash the password before saving
        createdAt: new Date().toISOString(),
      });
      alert('Staff added successfully');
      // Clear form fields
      setBranchCode('');
      setStaffCode('');
      setStaffName('');
      setPassword('');
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
    } catch (error) {
      console.error('Error adding staff:', error);
      setError('Error adding staff. Please try again.');
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
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md w-full max-w-md'>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          <div className='mb-4'>
            <label htmlFor="branchCode" className='block text-gray-700 font-medium mb-2'>Branch Code</label>
            <input
              type="text"
              id="branchCode"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className='w-full p-3 rounded-lg border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="staffCode" className='block text-gray-700 font-medium mb-2'>Staff Code</label>
            <input
              type="text"
              id="staffCode"
              value={staffCode}
              onChange={(e) => setStaffCode(e.target.value)}
              className='w-full p-3 rounded-lg border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="staffName" className='block text-gray-700 font-medium mb-2'>Staff Name</label>
            <input
              type="text"
              id="staffName"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className='w-full p-3 rounded-lg border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="password" className='block text-gray-700 font-medium mb-2'>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 rounded-lg border border-gray-300 outline-none'
              required
            />
          </div>
          <div className='flex justify-end'>
            <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600'>
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className='flex justify-center items-center pt-10'>
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr>
              <th className='border border-gray-300 px-4 py-2'>Branch Code</th>
              <th className='border border-gray-300 px-4 py-2'>Staff Code</th>
              <th className='border border-gray-300 px-4 py-2'>Staff Name</th>
              <th className='border border-gray-300 px-4 py-2'>Password</th>
              <th className='border border-gray-300 px-4 py-2'>Created At</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff) => (
              <tr key={staff.id}>
                <td className='border border-gray-300 px-4 py-2'>{staff.branchCode}</td>
                <td className='border border-gray-300 px-4 py-2'>{staff.staffCode}</td>
                <td className='border border-gray-300 px-4 py-2'>{staff.staffName}</td>
                <td className='border border-gray-300 px-4 py-2'>{staff.password}</td>
                <td className='border border-gray-300 px-4 py-2'>{staff.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddStaff;