import logo from '../assets/cat+icon.png'
import { IoHome } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiLogoutBoxLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
const SideBarOfAdmin = () => {
    const navigate = useNavigate();
    const handleNavigate = (path: string) => {
        navigate(path);
    }
    return (
        <div className='hidden sm:flex basis-1/5  bg-[#2a2f2a] shadow-lg flex-col justify-between h-screen w-[20%] fixed top-0 left-0'>
            <div className='flex items-center justify-between px-6 py-4 bg-[rgba(0,0,0,.5)] h-[80px] border-r-[1px] border-r-solid border-r-[rgba(255,255,255,.1)]'>
                <div className='h-[50px] w-[50px]'><img src={logo} alt='cat+icon' className='w-full h-full' /></div>
                <div> <p className='text-xl'><span className="font-bold text-[#D2FF72] drop-shadow-md">NGUYỄN</span> <span className="text-white drop-shadow-md font-bold">KIỆT</span></p></div>
            </div>
            <div className='px-4 py-4 h-full'>
                <div onClick={() => handleNavigate("/quanly/nguyenkiet")} className='cursor-pointer flex items-center gap-x-2 px-4  py-4 text-white rounded-md font-bold transition-all  drop-shadow-lg hover:text-[#D2FF72]'>
                    <IoHome />
                    <span className=''>TRANG CHỦ</span>
                </div>
                <div onClick={() => handleNavigate("/quanly/themnhanvien")} className='cursor-pointer flex items-center gap-x-2 px-4 py-4 font-bold  transition-all text-white drop-shadow-lg hover:text-[#D2FF72]'><span className='flex justify-center items-center'><BsFillPeopleFill /></span><span>THÊM NHÂN VIÊN</span></div>
                {/* <div className='cursor-pointer flex items-center gap-x-2 h-[40px] px-4  font-bold  transition-all text-white drop-shadow-lg hover:text-[#D2FF72]'><span className='flex justify-center items-center'><FaBuilding /></span><span>THÊM CHI NHÁNH    </span></div> */}
            </div>
            <div className="px-6 py-5 border-t-[1px] border-white"><button className="flex items-center gap-x-2 h-[40px] px-4 bg-white rounded-md font-bold hover:bg-[#15B392] hover:text-white transition-all hover:border-[2px] hover:border-white"><RiLogoutBoxLine />ĐĂNG XUẤT</button></div>
        </div>
    )
}

export default SideBarOfAdmin