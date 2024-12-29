import { useContext, useEffect, useState } from "react";
import { IoIosArrowDropleft } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import SideBarContext from "../contexts/SideBarContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../services/firebaseConfig";
const SideBar = () => {
    const navigate = useNavigate();
    const { isOpen, close } = useContext(SideBarContext); // get the state and the function to close the sidebar
    const [pendingApprovals, setPendingApprovals] = useState<object[]>([]);
    const [pendingApprovalsTab02, setPendingApprovalsTab02] = useState<object[]>([]); // new state for pending approvals in tab 02
    useEffect(() => {
        const fetchPendingApprovals = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'pendings'));
                const pendingApprovals = querySnapshot.docs.map(doc => doc.data());
                setPendingApprovals(pendingApprovals);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu pending approvals:", error);
            }
        }

        const fetchPendingApprovalsTab02 = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'pendingstab02'));
                const pendingApprovalsTab02 = querySnapshot.docs.map(doc => doc.data());
                setPendingApprovalsTab02(pendingApprovalsTab02);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu pending approvals tab 02:", error);
            }
        }
        fetchPendingApprovalsTab02();
        fetchPendingApprovals();
    }, [])
    return (
        <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform w-screen h-screen max-h-screen flex fixed top-0 left-0 z-10`}>
            <div className={`w-[80%] h-full bg-[#15B392] flex flex-col justify-between`}>
                <div onClick={close} className='flex justify-between items-center px-6 py-4 text-2xl border-b-[1px] border-white bg-[rgba(0,0,0,.2)]'>
                    <p><span className="font-bold text-[#D2FF72] drop-shadow-md">NGUYỄN</span> <span className="text-white drop-shadow-md font-bold">KIỆT</span></p><span className="hover:scale-110 hover:opacity-50 text-4xl flex justify-center items-center bg-transparent text-white font-extrabold "><IoIosArrowDropleft /></span>
                </div>
                <div className="h-full items-start pl-3 py-5 flex flex-col gap-y-3">
                    <div className="cursor-pointer flex items-center gap-x-2 h-[40px] px-4 text-white rounded-md font-bold transition-all  drop-shadow-lg hover:text-[#D2FF72]" onClick={() => navigate('/quanly/nguyenkiet')}><span>TRANG CHỦ</span></div>
                    <div className="cursor-pointer flex items-center gap-x-2 h-[40px] px-4  font-bold  transition-all text-white drop-shadow-lg hover:text-[#D2FF72]" onClick={() => navigate('/quanly/themnhanvien')}><span>THÊM NHÂN VIÊN</span></div>
                    <div className="relative cursor-pointer flex items-center gap-x-2 h-[40px] px-4  font-bold  transition-all text-white drop-shadow-lg hover:text-[#D2FF72]" onClick={() => navigate('/quanly/duyetthongtin/01')}><span>DUYỆT THÔNG TIN TAB 01</span>{pendingApprovals.length > 0 && <span className='w-[10px] h-[10px] bg-red-500 rounded-full absolute top-1  left-1'></span>}</div>
                    <div className="relative cursor-pointer flex items-center gap-x-2 h-[40px] px-4  font-bold  transition-all text-white drop-shadow-lg hover:text-[#D2FF72]" onClick={() => navigate('/quanly/duyetthongtin/02')}><span>DUYỆT THÔNG TIN TAB 02</span>{pendingApprovalsTab02.length > 0 && <span className='w-[10px] h-[10px] bg-red-500 rounded-full absolute top-1 left-1'></span>}</div>
                </div>
                <div className="px-6 py-5 border-t-[1px] border-white" onClick={() => { navigate("/") }}><button className="flex items-center gap-x-2 h-[40px] px-4 bg-white rounded-md font-bold hover:bg-[#15B392] hover:text-white transition-all hover:border-[2px] hover:border-white"><RiLogoutBoxLine />ĐĂNG XUẤT</button></div>
            </div>
            <div className={`w-[20%] h-full `} onClick={close}></div>
        </div>
    )
}

export default SideBar;