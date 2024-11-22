import { CatIcon } from "../helpers";
import { FaBars, FaBell } from "react-icons/fa6";
const NavigationBar = () => {
    return (
        <div className="flex justify-between items-center bg-[rgba(0,0,0,.5)] px-5 py-4">
            <div className="w-[50px] h-[50px]"><img src={CatIcon} alt="cat_icon_image" /></div>
            <p className="text-xl font-bold text-white"><span className="text-[#D2FF72]">NGUYỄN</span> <span>KIỆT</span></p>
            <div className="flex text-2xl text-white items-center gap-x-2">
                <span><FaBars /></span><span><FaBell /></span></div>
        </div>
    )
}

export default NavigationBar;