import { useState } from 'react';
import { NavigationBar } from '../helpers';
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebaseConfig'; // Đảm bảo import đúng file cấu hình Firestore
import { collection, addDoc } from 'firebase/firestore';

const AdminDashboard = () => {
    const branches = [
        { image: 'https://images.unsplash.com/photo-1731928962673-4d5a6a98b069?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8', name: 'Branch 1' },
        { image: 'https://images.unsplash.com/photo-1731928962528-5b76c6d578c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8', name: 'Branch 2' },
        { image: 'https://images.unsplash.com/photo-1732003039812-39c4cd9fce9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 3' },
        { image: 'https://images.unsplash.com/photo-1721332149346-00e39ce5c24f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 4' },
        { image: 'https://images.unsplash.com/photo-1732019065295-eb9ece640258?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D', name: 'Branch 5' },
        { image: 'https://images.unsplash.com/photo-1664566484452-03b6f3817fdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 6' },
        { image: 'https://images.unsplash.com/photo-1731570225640-7ddad4231679?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 7' },
        { image: 'https://images.unsplash.com/photo-1731688687605-e1e7aa7fb42c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 8' },
    ];
    const navigate = useNavigate(); // Hook for navigation
    const handleNavigate = (branchId: string) => {
        navigate(`/quanly/nguyenkiet/chinhanh/${branchId}`);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branchName, setBranchName] = useState('');
    const [password, setPassword] = useState('');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Hàm thêm chi nhánh vào Firestore
    const addBranchToFirestore = async (branchName: string, password: string) => {
        // Kiểm tra điều kiện ràng buộc
        if (!branchName || branchName.length <= 5) {
            alert("Tên chi nhánh phải lớn hơn 5 ký tự và không được để trống!");
            return;
        }

        if (!password || password.length <= 8) {
            alert("Mật khẩu phải lớn hơn 8 ký tự và không được để trống!");
            return;
        }

        try {
            // Thêm tài liệu mới vào Firestore
            await addDoc(collection(db, 'branches'), {
                name: branchName,
                password: password, // Lưu trữ thô, nhưng bạn có thể hash mật khẩu để bảo mật
                createdAt: new Date().toISOString(),
            });
            alert("Thêm chi nhánh thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm chi nhánh:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    // Cập nhật handleAddBranch để sử dụng hàm thêm chi nhánh
    const handleAddBranch = () => {
        addBranchToFirestore(branchName, password);
        handleCloseModal();
    };


    return (
        <div className='bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div className="flex justify-center items-center pt-10">
                <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] bg-[#D2FF72] inline-block'></span>
                    <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 h-[40px] text-xl text-white font-medium'><span className=''>TẤT CẢ CHI NHÁNH</span></span></p>
            </div>
            <div className='w-full h-fit flex justify-end px-5 pt-5'>
                <button onClick={handleOpenModal} className='flex justify-center items-center px-4 bg-white py-2 gap-x-2 font-bold rounded-md shadow-md cursor-pointer hover:opacity-80'><span><FaPlusCircle /></span>Thêm chi nhánh</button>
            </div>
            <div className='w-full h-fit grid grid-cols-2 gap-y-2 gap-x-6 pt-5 px-5' >
                {branches.map((branch, index) => (
                    <div onClick={() => handleNavigate("123")} key={index} className='flex items-start mb-4 flex-col gap-y-2 group'>
                        <div className='bg-white w-full p-2 rounded-md'>
                            <div className='w-full h-[100px] p-2 bg-[#73EC8D] shadow-2xl rounded-md overflow-hidden'>
                                <div className='w-full h-full rounded-md overflow-hidden'>
                                    <img src={branch.image} alt={branch.name} className='w-full h-full object-cover group-hover:scale-110 transition-all' />
                                </div></div>
                        </div>

                        <span className='text-white text-lg uppercase'>{branch.name}</span>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4">THÊM CHI NHÁNH</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tên chi nhánh</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mật khẩu</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleAddBranch}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;