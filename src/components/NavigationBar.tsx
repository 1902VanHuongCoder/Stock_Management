import { useNavigate } from "react-router-dom";
import { CatIcon } from "../helpers";
import { FaBars, FaBell } from "react-icons/fa6";
import { useContext } from "react";
import SideBarContext from "../contexts/SideBarContext";
import { ButtonToHome } from "./ButtonToHome";

const NavigationBar = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/quanly/nguyenkiet');
    }
    const { open } = useContext(SideBarContext) || { open: () => { } };
    return (
        <div className="flex justify-between items-center bg-[rgba(0,0,0,.5)] px-5 py-4">
            <div onClick={handleNavigate} className="w-[50px] h-[50px]"><img src={CatIcon} alt="cat_icon_image" /></div>
            <p className="text-xl sm:text-4xl font-bold text-white"><span className="text-[#D2FF72]">NGUYỄN</span> <span>KIỆT</span></p>
            <div className="sm:hidden flex text-2xl text-white items-center gap-x-2">
                <span onClick={open}><FaBars /></span><span><FaBell /></span></div>

            <div className="justify-center gap-x-10 hidden sm:flex items-center">
                <ButtonToHome path="/quanly/nguyenkiet" />
                <ul className="hidden sm:block self-end">
                    <li className="text-xl font-bold text-white cursor-pointer" onClick={() => {navigate("/quanly/themnhanvien")}}>Thêm nhân viên</li>
                </ul>
                <button className="bg-white py-2 px-4 rounded-md font-bold hover:bg-[#15B392] hover:text-white transition-all">ĐĂNG XUẤT</button></div>
        </div>
    )
}

export default NavigationBar;