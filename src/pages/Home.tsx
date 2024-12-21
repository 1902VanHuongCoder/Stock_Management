// TO VAN HUONG - PAUL TO - VIET NAM
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CatDrinksMilkTeaGif } from '../helpers';
import { addDoc, collection } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
import NotificationContext from '../contexts/NotificationContext';
import LoadingContext from '../contexts/LoadingContext';
import { RiLogoutBoxLine } from 'react-icons/ri';
const Home = () => {
    const navigate = useNavigate();
    const { branchId } = useParams<{ branchId: string }>(); // Get branchId from URL params that passed from the previos page 
    const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`); // This state is used to update stock data, delete stock data, add stock data, etc

    const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString());
    const [days, setDays] = useState<number[]>([]);

    const [noGlassInDay, setNoGlassInDay] = useState({
        cups500ml: 0,
        cups700ml: 0,
        cups800ml: 0
    });

    const [deliveryMore, setDeliveryMore] = useState({
        cups500ml: 0,
        cups700ml: 0,
        cups800ml: 0
    });

    const [breakGlass, setBreakGlass] = useState({
        cups500ml: 0,
        cups700ml: 0,
        cups800ml: 0
    });

    const { setTypeAndMessage } = useContext(NotificationContext);
    const { open, close } = useContext(LoadingContext);

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(e.target.value);
    };

    const handleSendToAdministrator = async () => {
        const staffInfo = localStorage.getItem('staffInfo');
        const parsedStaffInfo = staffInfo ? JSON.parse(staffInfo) : null;
        const data = {
            branchId: branchId,
            selectedDate: selectedDate,
            selectedDay: selectedDay,
            noGlassInDay: noGlassInDay,
            deliveryMore: deliveryMore,
            breakGlass: breakGlass,
            staffCode: parsedStaffInfo?.id,
            staffName: parsedStaffInfo?.staffName,
            branchName: parsedStaffInfo?.branchName
        }
        open(); // Open loading spinner 
        try {
            await addDoc(collection(db, 'pendings'), data);
            close(); // Close loading spinner
            setTypeAndMessage('success', 'Cập nhật thành công!');
        } catch (error) {
            console.error('Error adding document: ', error);
            close(); // Close loading spinner
            setTypeAndMessage('fail', 'Cập nhật thất bại! Hãy thử lại sau!');
        }
    };

    useEffect(() => {
        const month = selectedDate.slice(-2);
        const year = selectedDate.slice(0, 4);
        const getDaysInMonth = (year: number, month: number): number => {
            return new Date(year, month, 0).getDate();
        };
        const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        setDays(daysArray);

    }, [selectedDate]);

    return (
        <div className='relative min-h-screen max-w-screen sm:flex sm:justify-end bg-[#15b392]' >
            <div className=' sm:basis-[100%] flex flex-col items-center'>
                <div className='w-full text-center bg-[#2a2f2a] h-fit py-6'>
                    <h1 className='text-4xl font-bold text-white drop-shadow-md h-full flex justify-center items-center uppercase'>THÊM THÔNG TIN QUẦY</h1>

                </div>
                <div className="px-6 py-5 w-full"><button onClick={() => navigate("/")} className="flex items-center gap-x-2 h-[40px] px-4 bg-white rounded-md font-bold hover:bg-[#15B392] hover:text-white transition-all hover:border-[2px] hover:border-white"><RiLogoutBoxLine />ĐĂNG XUẤT</button></div>

                <div className='p-4 h-full sm:flex sm:items-center sm:flex-col sm:justify-center'>
                    <div className='mb-4'>
                        <label htmlFor="date" className='block text-white font-medium mb-2'>Chọn tháng</label>
                        <input
                            type="month"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className='w-full p-3  sm:w-[400px] rounded-lg border border-gray-300 outline-none'
                        />
                    </div>
                    <div className='relative w-full flex justify-center'>
                        <div className="px-5 sm:p-6 w-full sm:w-[80%] bg-white pt-5 border-[2px] border-dashed border-slate-500 shadow-white">
                            <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>CẬP NHẬT TỒN KHO</h2>
                            <div className='mb-4'>
                                <label htmlFor="date" className='block text-black font-medium mb-2'>Chọn ngày <span className="text-red-500">(*)</span></label>
                                <select
                                    id="day"
                                    value={selectedDay}
                                    onChange={handleDayChange}
                                    className='w-full sm:w-[400px] p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                >
                                    <option value="" disabled>Chọn ngày</option>
                                    {days.map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:flex sm:gap-x-4">
                                <div className="p-0 sm:p-4 rounded-lg">
                                    <p className="text-black py-4">Hàng tồn kho trong ngày hôm nay <span className="text-red-500">(*)</span></p>
                                    <div className="flex gap-x-3">
                                        <div className='mb-4'>
                                            <label htmlFor="cups500ml" className='block font-medium mb-2 text-[#15B392]'>500ml</label>
                                            <input
                                                type="number"
                                                id="cups500ml"
                                                value={noGlassInDay.cups500ml}
                                                onChange={(e) => setNoGlassInDay({ ...noGlassInDay, cups500ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="cups700ml" className='block font-medium mb-2 text-[#15B392]'>700ml</label>
                                            <input
                                                type="number"
                                                id="cups700ml"
                                                value={noGlassInDay.cups700ml}
                                                onChange={(e) => setNoGlassInDay({ ...noGlassInDay, cups700ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="cups800ml" className='block font-medium mb-2 text-[#15B392]'>800ml</label>
                                            <input
                                                type="number"
                                                id="cups800ml"
                                                value={noGlassInDay.cups800ml}
                                                onChange={(e) => setNoGlassInDay({ ...noGlassInDay, cups800ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                                min={0}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-0 sm:p-4 rounded-lg">
                                    <p className="text-black py-4">Hàng giao thêm cho kho <span className="text-red-500">(*)</span></p>
                                    <div className="flex gap-x-3">
                                        <div className='mb-4'>
                                            <label htmlFor="deliveryCups500ml" className='block font-medium mb-2 text-[#15B392]'>500ml</label>
                                            <input
                                                type="number"
                                                id="deliveryCups500ml"
                                                value={deliveryMore.cups500ml}
                                                onChange={(e) => setDeliveryMore({ ...deliveryMore, cups500ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="deliveryCups700ml" className='block font-medium mb-2 text-[#15B392]'>700ml</label>
                                            <input
                                                type="number"
                                                id="deliveryCups700ml"
                                                value={deliveryMore.cups700ml}
                                                onChange={(e) => setDeliveryMore({ ...deliveryMore, cups700ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="deliveryCups800ml" className='block font-medium mb-2 text-[#15B392]'>800ml</label>
                                            <input
                                                type="number"
                                                id="deliveryCups800ml"
                                                value={deliveryMore.cups800ml}
                                                onChange={(e) => setDeliveryMore({ ...deliveryMore, cups800ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                                min={0}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-0 sm:p-4 rounded-lg">
                                    <p className="text-black py-4">Số ly vỡ <span className="text-red-500">(*)</span></p>
                                    <div className="flex gap-x-3">
                                        <div className='mb-4'>
                                            <label htmlFor="breakCups500ml" className='block font-medium mb-2 text-[#15B392]'>500ml</label>
                                            <input
                                                type="number"
                                                id="breakCups500ml"
                                                value={breakGlass.cups500ml}
                                                onChange={(e) => setBreakGlass({ ...breakGlass, cups500ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="breakCups700ml" className='block font-medium mb-2 text-[#15B392]'>700ml</label>
                                            <input
                                                type="number"
                                                id="breakCups700ml"
                                                value={breakGlass.cups700ml}
                                                onChange={(e) => setBreakGlass({ ...breakGlass, cups700ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="breakCups800ml" className='block font-medium mb-2 text-[#15B392]'>800ml</label>
                                            <input
                                                type="number"
                                                id="breakCups800ml"
                                                value={breakGlass.cups800ml}
                                                onChange={(e) => setBreakGlass({ ...breakGlass, cups800ml: parseInt(e.target.value) })}
                                                className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 pb-5 font-bold gap-x-2">
                                <button onClick={() => { handleSendToAdministrator() }} className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                            </div>
                        </div>

                        <div className='hidden sm:block absolute bottom-0 right-0'>
                            <img src={CatDrinksMilkTeaGif} alt="logo" className="w-24 h-24" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;

// TO VAN HUONG - PAUL TO - VIET NAM
