import React, { useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore/lite';
import { db } from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const NLogin = () => {
    const [branchCode, setBranchCode] = useState('');
    const [staffCode, setStaffCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate input fields
        if (!branchCode || !staffCode || !password) {
            setError('All fields are required');
            return;
        }

        try {
            // Query the staffs collection in Firebase
            const q = query(
                collection(db, 'staffs'),
                where('branchCode', '==', branchCode),
                where('staffCode', '==', staffCode),
                where('password', '==', password)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Invalid branch code, staff code, or password');
            } else {
                setError('');
                alert('Login successful');
                // Redirect or perform other actions after successful login
                navigate('/nhanvien/kho');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Error logging in. Please try again.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label htmlFor="branchCode">Mã chi nhánh</label>
                    <input
                        type="text"
                        id="branchCode"
                        value={branchCode}
                        onChange={(e) => setBranchCode(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="staffCode">Mã nhân viên</label>
                    <input
                        type="text"
                        id="staffCode"
                        value={staffCode}
                        onChange={(e) => setStaffCode(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default NLogin;