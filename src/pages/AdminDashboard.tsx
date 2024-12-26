import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationBar, SideBarOfAdmin } from '../helpers';

import { db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore/lite';


import NotificationContextType from '../contexts/NotificationContext';
import LoadingContext from '../contexts/LoadingContext';
import ConfirmContext from '../contexts/ConfirmContext';

import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { uploadImage } from '../cloudinary';

type Branch = {
    createdAt: Timestamp | string;
    branchImage: string;
    branchImagePublicId: string;
    name: string;
    password: string;
    branchId: string;
    id: string;
};

const AdminDashboard = () => {
    const navigate = useNavigate(); // Hook for navigation

    const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling adding branch modal 

    // 4 states for adding branch form 
    const [branchName, setBranchName] = useState('');
    const [branchId, setBranchId] = useState('');
    const [password, setPassword] = useState('');
    const [img, setImg] = useState<File | null>(null);

    const [branches, setBranches] = useState<{ createdAt: Timestamp | string; branchImage: string; branchImagePublicId: string; name: string; password: string; branchId: string; id: string; }[]>([]); // state to store branches that fetched from Firestore 

    const { setTypeAndMessage } = useContext(NotificationContextType); // Context for notification
    const { open, close } = useContext(LoadingContext); // Context for loading
    const { setDataToDelete } = useContext(ConfirmContext); // Context for confirm dialog 


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Hàm thêm chi nhánh vào Firestore
    const addBranchToFirestore = async (branchName: string, password: string, img: File) => {
        // Kiểm tra điều kiện ràng buộc
        open(); // Open loading
        const regex = /^CN.{3}$/;
        if (!regex.test(branchId)) {
            close(); // Close loading
            setTypeAndMessage('fail', 'Mã chi nhánh phải bắt đầu bằng CN và theo sau là 3 ký tự số!');
            return;
        }
        if (!password || password.length <= 7) {
            close(); // Close loading
            setTypeAndMessage('fail', 'Mật khẩu phải lớn hơn 7 ký tự và không được để trống!');
            return;
        }
        const { public_id, url } = await uploadImage(img); // Upload image to Cloudinary and get image URL
        try {
            await addDoc(collection(db, 'branches'), { // Add branch to Firestore
                branchImage: url, // Upload image to Cloudinary and get image URL
                branchImagePublicId: public_id, // Upload image to Cloudinary and get public_id
                name: branchName,
                password: password,
                createdAt: new Date().toISOString(),
                branchId: branchId
            });

            const querySnapshot = await getDocs(collection(db, 'branches')) // Get all branches from Firestore
            const branches = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, id: doc.id, createdAt: data.createdAt, branchImage: data.branchImage, branchImagePublicId: data.branchImagePublicId, name: data.name, password: data.password, branchId: data.branchId };
            }); // Map data from Firestore to branches array
            setBranches(branches);
            setTypeAndMessage('success', 'Thêm chi nhánh thành công!');
            setBranchName(''); // Reset branch name
            setPassword(''); // Reset password
            setImg(null); // Reset image
            setIsModalOpen(false); // Close modal
            setBranchId(''); // Reset branchId
            close(); // Close loading
        } catch (error) {
            close(); // Close loading
            console.error("Lỗi khi thêm chi nhánh:", error);
            setTypeAndMessage('fail', 'Lỗi khi thêm chi nhánh, vui lòng thử lại!');
        }
    };

    // Cập nhật handleAddBranch để sử dụng hàm thêm chi nhánh
    const handleAddBranch = async () => {

        if (img && branchName !== '' && password !== '') { // If image is selected, upload image to Cloudinary
            await addBranchToFirestore(branchName, password, img);
        } else {
            setTypeAndMessage('fail', "Vui lòng nhập đầy đủ thông tin!"); // Reset notification
        }
    };

    const handleDeleteBranch = async (id: string, public_id: string) => {
        try {
            console.log(public_id);
            setDataToDelete('Xác nhận xóa', id, 'branches');
        } catch (error) {
            console.log("Lỗi khi xóa chi nhánh:", error);
            setTypeAndMessage('fail', 'Lỗi khi xóa chi nhánh, vui lòng thử lại!');
        }

    }
    const handleUpdateBranch = (id: string) => {
        navigate(`/quanly/capnhatchinhanh/${id}`);
    }

    const handleNavigateToStockDetail = (branchId: string) => {
        navigate(`/quanly/nguyenkiet/chinhanh/${branchId}`);
    }

    useEffect(() => {
        const getAllBranches = async () => {
            open(); // Open loading
            try {
                const querySnapshot = await getDocs(collection(db, 'branches')); // Get all branches from Firestore
                const branches = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return { ...data, id: doc.id, createdAt: data.createdAt };
                }) as Branch[]; // Map data from Firestore to branches array

                console.log(branches);

                // Sort branches by createdAt timestamp in descending order by default
                sortBranchesByTimeDescending(branches);

                setBranches(branches);
                close(); // Close loading
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu chi nhánh:", error);
                setTypeAndMessage('fail', 'Lỗi khi lấy dữ liệu chi nhánh, vui lòng thử lại!');
                close(); // Close loading
            }
        };
        getAllBranches();
    }, []);

    const getTime = (createdAt: Timestamp | string | Date): number => { // Get time from createdAt field in branch object to sort branches
        if (createdAt instanceof Timestamp) {
            return createdAt.toMillis();
        } else if (typeof createdAt === 'string') {
            return new Date(createdAt).getTime();
        } else if (createdAt instanceof Date) {
            return createdAt.getTime();
        }
        return 0;
    };

    const sortBranchesByTimeDescending = (branches: Branch[]) => {
        branches.sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt)); // Descending order
        setBranches([...branches]); // Update state with sorted branches
    };

    const sortBranchesByTimeAscending = (branches: Branch[]) => {
        branches.sort((a, b) => getTime(a.createdAt) - getTime(b.createdAt)); // Ascending order
        setBranches([...branches]); // Update state with sorted branches
    };


    return (
        <div className='relative bg-[#15B392] min-h-screen max-w-screen sm:flex sm:justify-end'>
            <SideBarOfAdmin />
            <div className='sm:basis-[80%]'>
                <NavigationBar />
                <div className="flex sm:hidden justify-center items-center pt-10 sm:pt-0 ">
                    <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] sm:hidden inline-block'></span><span className='w-full bg-[rgba(0,0,0,.5)] sm:bg-transparent sm:text-center flex items-center pl-2 sm:pl-0 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-0'><span className=''>TẤT CẢ CHI NHÁNH</span></span></p>
                </div>
                <div className='hidden sm:block w-full text-center bg-[#2a2f2a] h-[80px]'>
                    <h1 className='text-4xl font-bold text-white drop-shadow-md h-full flex justify-center items-center uppercase'>TẤT CẢ CHI NHÁNH</h1>
                </div>
                <div className='w-full h-fit flex justify-end px-5 pt-5'>
                    <button onClick={handleOpenModal} className='border-[3px] border-solid border-slate-800 hover:shadow-xl transition-all uppercase flex justify-center items-center px-3 sm:px-5 sm:text-lg bg-white py-2 sm:py-4 gap-x-2 font-bold rounded-md shadow-md cursor-pointer'><span><FaPlusCircle /></span>Thêm chi nhánh</button>
                </div>
                <div className='px-5 flex flex-col gap-y-2 mt-5'>
                    <p className='text-white'>Sắp xếp theo</p>
                    <div className='flex gap-x-2'>
                        <button className='px-4 py-2 bg-white rounded-md' onClick={() => sortBranchesByTimeAscending(branches)}>Cũ nhất</button>
                        <button className='px-4 py-2 bg-white rounded-md' onClick={() => sortBranchesByTimeDescending(branches)}>Mới nhất</button>
                    </div>

                    {/* Your existing JSX to display branches */}
                </div>
                {/* onClick={() => handleNavigate("123")} */}
                <div className='w-full h-fit grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-6 pt-5 px-5' >
                    {branches.map((branch, index) => (
                        <div key={index} className='sm:bg-[rgba(0,0,0,.5)] bg-[rgba(0,0,0,.2)] flex items-start mb-4 flex-col gap-y-2 group cursor-pointer rounded-md p-2'>

                            <div onClick={() => handleNavigateToStockDetail(branch.id)} className='w-full h-[100px] sm:h-[200px] rounded-md overflow-hidden'>
                                <img src={branch.branchImage} alt={branch.name} className='w-full h-full object-cover group-hover:scale-110 transition-all' />
                            </div>

                            <div className='text-white font-bold pl-2 text-lg uppercase sm:text-2xl sm:w-full text-center sm:py-3 w-full'>{String(index + 1).padStart(2, "0")} - {branch.name}</div>
                            <div className='flex gap-x-4 justify-between w-full px-2'>
                                <button className='text-white font-bold text-2xl hover:text-red-600' onClick={() => handleDeleteBranch(branch.id, branch.branchImagePublicId)}><MdDelete /></button>
                                <button className='text-white font-bold text-2xl hover:text-yellow-400' onClick={() => handleUpdateBranch(branch.id)}> <FaPenToSquare /> </button>
                            </div>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

                        <div className="relative bg-white p-5 rounded-md shadow-md pt-24 w-[320px] sm:w-[400px] pb-24">
                            <div className='w-[110%] absolute -left-[5%] -top-[20px] h-[80px] bg-[#15B392] flex justify-center items-center rounded-md shadow-lg'><h2 className="text-xl font-bold text-[#FEEC37] drop-shadow-md">THÊM CHI NHÁNH</h2></div>
                            <div className='w-[80px] h-[80px] rounded-full bg-[#15b392] absolute -bottom-[50px] flex justify-center items-center '> <div className='w-[40px] h-[40px] bg-[#FEEC37] rounded-full shadow-xl'></div></div>
                            <div className='w-[100px] h-[100px] rounded-full bg-[#15b392] absolute -bottom-[50px] right-[10px] flex justify-center items-center '> <div className='w-[60px] h-[60px] bg-[#FEEC37] rounded-full  shadow-xl' ></div></div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tên chi nhánh(<span className='text-red-500'>*</span>)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Mật khẩu(<span className='text-red-500'>*</span>)</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Mã chi nhánh(<span className='text-red-500'>*</span>)</label>
                                <input
                                    placeholder="CN***"
                                    type="branchId"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={branchId}
                                    onChange={(e) => setBranchId(e.target.value)}
                                />
                            </div>


                            <div className="mb-4">
                                <label className="block text-gray-700">Hình ảnh(<span className='text-red-500'>*</span>)</label>
                                <input
                                    type="file"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange={(e) => setImg(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>

                            <div className="flex justify-between gap-x-2 pt-2">
                                <button
                                    className="hover:opacity-80 px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="hover:opacity-80 px-4 py-2 bg-[#15b392] text-white rounded-md border-[5px] border-solid border-[#73EC8B] shadow-inner"
                                    onClick={handleAddBranch}
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AdminDashboard;