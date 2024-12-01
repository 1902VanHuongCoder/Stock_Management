import { useContext } from "react";
import NotificationContextType from "../contexts/NotificationContext";
import { FaRegCheckCircle } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
const Notification = () => {
    const { message, type, isShow } = useContext(NotificationContextType);
    return (
        <>
            <div className={`z-10 transition-all ${isShow ? "translate-x-0" : "translate-x-full"} fixed top-0 right-0 bg-white ${type === 'success' ? 'border-[4px] border-solid border-green-500' : 'border-[4px] border-solid border-red-500'} w-[95%] h-fit rounded-md`}>
                {type === 'success' && <div className='text-green-500 drop-shadow-md flex items-center p-4 text-md justify-between w-full'><span>{message}</span> <span className="text-3xl"><FaRegCheckCircle /></span></div>}
                {type === 'fail' && <div className='text-red-500 drop-shadow-md flex items-center p-4 text-md justify-between w-full'><span>{message}</span> <span className="text-3xl"><TiWarning /></span></div>}
            </div>
        </>

    );
}

export default Notification;