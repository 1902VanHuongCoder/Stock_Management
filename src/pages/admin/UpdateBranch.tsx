import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../services/firebaseConfig';
import { NavigationBar } from '../../helpers';
import { uploadImage } from '../../cloudinary';
import NotificationContextType from '../../contexts/NotificationContext';
import LoadingContext from '../../contexts/LoadingContext';

const UpdateBranch = () => {
    const { id } = useParams<{ id: string }>();
    const { setTypeAndMessage } = useContext(NotificationContextType);
    const { open, close } = useContext(LoadingContext);
    const navigate = useNavigate();
    interface BranchData {
        name: string;
        password: string;
        branchId: string;
        branchImage?: string;
    }

    const [branchData, setBranchData] = useState<BranchData>({
        name: '',
        password: '',
        branchId: '',
        branchImage: ''
    });

    console.log("Refresh");

    const [branchImageNew, setBranchImageNew] = useState<File | null>(null);
    useEffect(() => {

        const fetchBranch = async () => {
            open(); // Open loading spinner
            try {
                if (id) {
                    const branchDoc = await getDoc(doc(db, 'branches', id));
                    if (branchDoc.exists()) {
                        const branch = branchDoc.data() as BranchData;
                        setBranchData(branch);
                        close(); // Close loading spinner
                    } else {
                        console.error('Branch not found');
                        setTypeAndMessage('error', 'Chi nhánh không còn tồn tại!');
                        close(); // Close loading spinner
                        navigate('/quanly/nguyenkiet');
                    }
                }
            } catch (error) {
                setTypeAndMessage('error', 'Lỗi khi tải thông tin chi nhánh!');
                console.error('Error fetching branch:', error);
                navigate('/quanly/nguyenkiet');
            }
        };

        fetchBranch();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBranchData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        open(); // Open loading
        if (branchData.name === '' || !branchData.password || !branchData.branchId) {
            return;
        }

        const regex = /^CN.{3}$/;
        if (!regex.test(branchData.branchId)) {
            close(); // Close loading
            setTypeAndMessage('fail', 'Mã chi nhánh phải bắt đầu bằng CN và theo sau là 3 ký tự số!');
            return;
        }

        try {
            if (id) {
                if (branchImageNew instanceof File) {
                    const { url } = await uploadImage(branchImageNew);
                    await updateDoc(doc(db, 'branches', id), {
                        ...branchData,
                        branchImage: url,
                        updatedAt: new Date().toISOString()
                    });
                    setTypeAndMessage('success', 'Cập nhật chi nhánh thành công!');
                    navigate('/quanly/nguyenkiet');
                } else {
                    await updateDoc(doc(db, 'branches', id), {
                        ...branchData,
                        updatedAt: new Date().toISOString()
                    });
                    setTypeAndMessage('success', 'Cập nhật chi nhánh thành công!');
                    navigate('/quanly/nguyenkiet');
                }

            } else {
                console.error('Branch ID not found');
                setTypeAndMessage('error', 'Chi nhánh không tồn tại!');
            }

        } catch (error) {
            console.error('Error updating branch:', error);
            setTypeAndMessage('error', 'Lỗi khi cập nhật chi nhánh! Vui lòng thử lại sau!');
        }
        close(); // Close loading
    };

    return (
        <div className='bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div className="flex justify-center items-center pt-10">
                <p className='w-full px-5 flex items-center'>
                    <span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
                    <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'>
                        <span className=''>CẬP NHẬT CHI NHÁNH</span>
                    </span>
                </p>
            </div>
            <div className='px-6'>
                <form onSubmit={handleUpdate} className='flex flex-col justify-center items-center'>
                    <div className='flex flex-col items-start mt-5 w-full '>
                        <label htmlFor="name" className='text-white drop-shadow-md mb-1'>Tên chi nhánh</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={branchData.name}
                            onChange={handleChange}
                            className='rounded-sm px-2 py-2 w-full outline-none'
                        />
                    </div>
                    <div className='flex flex-col items-start mt-5 w-full '>
                        <label htmlFor="password" className='text-white drop-shadow-md mb-1'>Mật khẩu</label>
                        <input
                            autoComplete='on'
                            type="password"
                            name="password"
                            id="password"
                            value={branchData.password}
                            onChange={handleChange}
                            className='rounded-sm px-2 py-2 w-full outline-none'
                        />
                    </div>
                    <div className='flex flex-col items-start mt-5 w-full '>
                        <label htmlFor="password" className='text-white drop-shadow-md mb-1'>Mã chi nhánh</label>
                        <input
                            type="text"
                            name="branchId"
                            id="branchId"
                            value={branchData.branchId}
                            onChange={handleChange}
                            className='rounded-sm px-2 py-2 w-full outline-none'
                        />
                    </div>
                    <div className='w-full mt-5'>
                        <p className='text-white drop-shadow-md text-left mb-2'>Ảnh hiện tại </p>
                        <div className='w-full h-[250px] border-dashed border-[2px] border-white rounded-md p-2'><img src={branchData.branchImage} alt="branch" className='w-full h-full object-cover' /></div>

                    </div>
                    <div className='flex flex-col items-start mt-5 w-full'>
                        <label htmlFor="branchImageNew" className='text-white drop-shadow-md mb-1'>Chọn ảnh khác</label>
                        <input
                            type="file"
                            name="branchImageNew"
                            id="branchImageNew"
                            onChange={(e) => setBranchImageNew(e.target.files ? e.target.files[0] : null)}
                            className='rounded-sm py-2 w-full outline-none'
                        />
                    </div>
                    <div className='w-full'>  <button type="submit" className='bg-[#D2FF72] w-full py-2 mb-8 text-xl uppercase font-bold hover:opacity-80 cursor-pointer text-[] text-black rounded-md p-1 mt-5'>Cập nhật</button></div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBranch;