import Container from '../../components/Container';
import { db } from '../../services/firebaseConfig'; // Import the db object from the firebase file
import { collection, getDocs } from 'firebase/firestore/lite'; // Import the getFirestore, collection, and getDocs functions from the lite version of the Firebase SDK
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CatIcon } from '../../helpers';
import LoadingContext from '../../contexts/LoadingContext';
import NotificationContext from '../../contexts/NotificationContext';

const ALogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error,] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { open, close } = useContext(LoadingContext);
    const { setTypeAndMessage } = useContext(NotificationContext);
    const validateInputs = () => {
        let isValid = true;
        if (!username) {
            setUsernameError('(*) Username không thể trống');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (!password) {
            setPasswordError('(*) Password không thể trống');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError('(*) Password phải có ít nhất 8 ký tự');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        try {
            open(); // Open loading spinner
            const querySnapshot = await getDocs(collection(db, 'admin'));
            let isValidUser = false;
            querySnapshot.forEach((doc) => {
                if (doc.data().username === username && doc.data().password === password) {
                    localStorage.setItem('adminId', doc.id);
                    isValidUser = true;
                    close(); // Close loading spinner
                    navigate('/quanly/nguyenkiet');
                    setTypeAndMessage('success', 'Đăng nhập thành công');
                }
            });

            if (!isValidUser) {
                close(); // Close loading spinner
                setTypeAndMessage('fail', 'Tên đăng nhập hoặc mật khẩu không đúng');
            }
        } catch (error) {
            console.log('Error signing in: ', error);
            setTypeAndMessage('fail', 'Kết nối mạng không ổn định! Vui lòng thử lại!');
        }
    };

    return (
        <Container>
            <div>
                <img src={CatIcon} alt="logo" className="w-20 h-20" />
            </div>
            <h1 className="text-3xl text-center font-bold text-[#D2FF72] drop-shadow-lg">ĐĂNG NHẬP</h1>
            <div className="flex justify-center items-center h-full">
                <form className="p-10 w-[400px]" onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label htmlFor="username" className="text-white block font-medium">Tên đăng nhập <span className='text-red-500'>*</span></label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            className="shadow-inner outline-none w-full mt-1 p-3 rounded-lg border border-gray-300"
                        />
                        {usernameError && <p className="text-red-500 text-sm mt-1 drop-shadow-2xl">{usernameError}</p>}
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="text-white block font-medium">Mật khẩu <span className='text-red-500'>*</span></label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="shadow-inner outline-none w-full mt-1 p-3 rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-gray-600"
                        >
                            {showPassword ? 'Ẩn' : 'Hiện'}
                        </button>
                        {passwordError && <p className="text-red-500 text-sm mt-1 drop-shadow-2xl">{passwordError}</p>}
                    </div>
                    {error && <p className="text-red-500 text-center mb-4  drop-shadow-2xl uppercase">{error}</p>}
                    <div>
                        <button className=" py-2 px-6 text-[#15B392] bg-white border-solid border-[4px] border-[#D2FF72] shadow-inner font-semibold rounded-lg hover:bg-[#15B392] hover:text-white cursor-pointer transition-all">ĐĂNG NHẬP</button>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default ALogin;