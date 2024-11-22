import { useNavigate } from 'react-router-dom';
const Introduction = () => {
    const navigate = useNavigate();
    const handleNavigate = (path: string) => {
        navigate(path);
        console.log(path);
    }
    return (
        <div className="max-w-screen h-screen flex justify-center items-center bg-[#15B392] overflow-hidden">

            <div className="flex justify-center items-center text-center flex-col gap-y-7">
                <p className="font-bold text-white drop-shadow-sm">CỬA HÀNG</p>
                <h1 className="text-5xl font-bold text-white drop-shadow-md md:text-[100px]"><span className="text-[#D2FF72]">NGUYỄN</span> <span >KIỆT</span></h1>
                <div className="flex justify-between items-center gap-x-5">
                    <button onClick={() => handleNavigate("/quanly/dangnhap")} className="cursor-pointer hover:shadow-xl text-[#15B392] bg-white px-5 py-3 rounded-full font-bold shadow-lg drop-shadow-md transition-all">QUẢN LÝ</button>
                    <button onClick={() => handleNavigate("/nhanvien/dangnhap")} className="cursor-pointer hover:shadow-xl text-[#15B392] bg-white px-5 py-3 rounded-full font-bold shadow-lg drop-shadow-md transition-all">NHÂN VIÊN</button>
                </div>
            </div>

        </div>
    )
}

export default Introduction;