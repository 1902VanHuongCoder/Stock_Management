import { useContext } from "react";
import { IoIosArrowDropleft } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import SideBarContext from "../contexts/SideBarContext";
import { useNavigate } from "react-router-dom";
const SideBar = () => {
    const navigate = useNavigate();
    const { isOpen, close } = useContext(SideBarContext); // get the state and the function to close the sidebar
    return (
        <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform w-screen h-screen flex fixed top-0 left-0 z-10`}>
            <div className={`w-[80%] h-full bg-[#15B392] flex flex-col justify-between`}>
                <div onClick={close} className='flex justify-between items-center px-6 py-4 text-2xl border-b-[1px] border-white bg-[rgba(0,0,0,.2)]'>
                    <p><span className="font-bold text-[#D2FF72] drop-shadow-md">NGUYỄN</span> <span className="text-white drop-shadow-md font-bold">KIỆT</span></p><span className="hover:scale-110 hover:opacity-50 text-4xl flex justify-center items-center bg-transparent text-white font-extrabold "><IoIosArrowDropleft /></span>
                </div>
                <div className="h-full items-start pl-3 py-5 flex flex-col gap-y-3">
                    <div className="cursor-pointer flex items-center gap-x-2 h-[40px] px-4 text-white rounded-md font-bold transition-all  drop-shadow-lg hover:text-[#D2FF72]" onClick={() => navigate('/quanly/nguyenkiet')}><span>TRANG CHỦ</span></div>
                    <div className="cursor-pointer flex items-center gap-x-2 h-[40px] px-4  font-bold  transition-all text-white drop-shadow-lg hover:text-[#D2FF72]" onClick={() => navigate('/quanly/themnhanvien')}><span>THÊM NHÂN VIÊN</span></div>
                </div>
                <div className="px-6 py-5 border-t-[1px] border-white"><button className="flex items-center gap-x-2 h-[40px] px-4 bg-white rounded-md font-bold hover:bg-[#15B392] hover:text-white transition-all hover:border-[2px] hover:border-white"><RiLogoutBoxLine />ĐĂNG XUẤT</button></div>
            </div>
            <div className={`w-[20%] h-full `} onClick={close}></div>
        </div>
    )
}

export default SideBar;