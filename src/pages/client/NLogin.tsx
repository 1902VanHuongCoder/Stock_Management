import React, { useContext, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore/lite';
import { db } from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/Container';

import { CatDrinksMilkTeaGif } from '../../helpers';
import LoadingContext from '../../contexts/LoadingContext';
import NotificationContext from '../../contexts/NotificationContext';

const NLogin = () => {
    const navigate = useNavigate();

    const [branchCode, setBranchCode] = useState('');
    const [staffCode, setStaffCode] = useState('');
    const [password, setPassword] = useState('');
    const [branchPassword, setBranchPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showBranchPassword, setShowBranchPassword] = useState(false);

    const [error, setError] = useState({
        branchCodeError: '',
        staffCodeError: '',
        passwordError: '',
        branchPasswordError: '',
    });

    const { open, close } = useContext(LoadingContext);
    const { setTypeAndMessage } = useContext(NotificationContext);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setError({
            branchCodeError: '',
            staffCodeError: '',
            passwordError: '',
            branchPasswordError: '',
        });

        // Validate inputs
        if (!branchCode) {
            setError(prev => ({ ...prev, branchCodeError: 'Nè nè! Mã chi nhánh không thể để trống nhé!' }));
            return;
        }
        if (!staffCode) {
            setError(prev => ({ ...prev, staffCodeError: 'Nè nè! Mã nhân viên không thể để trống nhé!' }));
            return;
        }
        if (!password) {
            setError(prev => ({ ...prev, passwordError: 'Nè nè! Mật khẩu không thể để trống nhé!' }));
            return;
        }

        if (!branchPassword) {
            setError(prev => ({ ...prev, branchPasswordError: 'Nè nè! Mật khẩu chi nhánh không thể để trống nhé!' }));
            return;
        }

        open(); // Show loading spinner

        try {
            // Fetch staff data from Firebase
            const staffCollection = collection(db, 'staffs');
            const staffSnapshot = await getDocs(staffCollection);
            const staffList = staffSnapshot.docs.map(doc => doc.data());

            // Find the staff member with the matching branchCode, staffCode, and password
            const staffMember = staffList.find(staff =>
                (staff.branchCode).toLowerCase() === branchCode.toLowerCase() &&
                staff.staffCode.toLowerCase() === staffCode.toLowerCase() &&
                staff.password === password
            );

            if (staffMember) {
                // Fetch branch data from Firebase
                const branchesCollection = collection(db, 'branches');
                const branchesSnapshot = await getDocs(branchesCollection);
                const branchesList = branchesSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as { branchId: string, password: string, name: string }) }));

                // Find the branch with the matching branchCode
                const branch = branchesList.find(branch => branch.branchId === branchCode);

                if (branch) {
                    // Successful login
                    if (branch.password === branchPassword) {
                        localStorage.setItem('staffInfo', JSON.stringify({ id: staffMember.staffCode, staffName: staffMember.staffName, branchName: branch.name }));
                        setTypeAndMessage('success', 'Đăng nhập thành công rồi nè!');
                        navigate(`/nguyenkiet/nhanvien/nhaplieukho/${branch.id}`); // Redirect to the specific branch page
                    } else {
                        setTypeAndMessage('fail', 'Mật khẩu chi nhánh không đúng rồi nè!');
                    }

                } else {
                    setTypeAndMessage('error', 'Chi nhánh không còn nữa rồi nè!');
                }
            } else {
                // Invalid credentials
                setTypeAndMessage('fail', 'Ỏ! Hình như có gì đó không đúng lắm!');
            }
        } catch (error) {
            console.error('Error fetching staff data:', error);
            setTypeAndMessage('fail', 'Kết nối mạng không ổn! Nào có mạng quay lại đăng nhập nghe');
        } finally {
            close(); // Hide loading spinner
        }
    };

    return (
        <Container>
            <div>
                <img src={CatDrinksMilkTeaGif} alt="logo" className="w-24 h-24" />
            </div>
            <div>
                <h1 className="text-3xl text-center font-bold text-[#D2FF72] drop-shadow-lg">ĐĂNG NHẬP</h1>
                <div className="flex justify-center items-center h-full">
                    <form className="p-10 w-[400px]" onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label className="text-white block font-medium" htmlFor="branchCode">Mã chi nhánh</label>
                            <input
                                type="text"
                                id="branchCode"
                                value={branchCode}
                                onChange={(e) => setBranchCode(e.target.value)}
                                required
                                className="shadow-inner outline-none w-full mt-1 p-3 rounded-lg border border-gray-300"
                            />
                            {error.branchCodeError && <p style={{ color: 'red' }}>{error.branchCodeError}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="text-white block font-medium" htmlFor="staffCode">Mã nhân viên</label>
                            <input
                                type="text"
                                id="staffCode"
                                value={staffCode}
                                onChange={(e) => setStaffCode(e.target.value)}
                                required
                                className="shadow-inner outline-none w-full mt-1 p-3 rounded-lg border border-gray-300"
                            />
                            {error.staffCodeError && <p style={{ color: 'red' }}>{error.staffCodeError}</p>}
                        </div>
                        <div className="mb-6 relative">
                            <label className="text-white block font-medium" htmlFor="password">Mật khẩu nhân viên</label>
                            <input
                                className="shadow-inner outline-none w-full mt-1 p-3 rounded-lg border border-gray-300"
                                id="password"
                                value={password}
                                type={showPassword ? 'text' : 'password'}

                                autoComplete='on'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-gray-600"
                            >
                                {showPassword ? 'Ẩn' : 'Hiện'}
                            </button>
                            {error.passwordError && <p style={{ color: 'red' }}>{error.passwordError}</p>}
                        </div>
                        <div className="mb-6 relative">
                            <label className="text-white block font-medium" htmlFor="password">Mật khẩu chi nhánh</label>
                            <input
                                className="shadow-inner outline-none w-full mt-1 p-3 rounded-lg border border-gray-300"
                                type={showBranchPassword ? 'text' : 'password'}
                                id="branchPassword"
                                value={branchPassword}
                                autoComplete='on'
                                onChange={(e) => setBranchPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowBranchPassword(!showBranchPassword)}
                                className="absolute right-3 top-10 text-gray-600"
                            >
                                {showBranchPassword ? 'Ẩn' : 'Hiện'}
                            </button>
                            {error.branchPasswordError && <p style={{ color: 'red' }}>{error.passwordError}</p>}
                        </div>

                        <div className='flex justify-end'>

                            <button className=" py-2 px-6 text-[#15B392] bg-white border-solid border-[4px] border-[#D2FF72] shadow-inner font-semibold rounded-lg hover:bg-[#15B392] hover:text-white cursor-pointer transition-all" type="submit">Login</button>
                        </div>
                    </form></div>

            </div>

        </Container>

    );
};

export default NLogin;