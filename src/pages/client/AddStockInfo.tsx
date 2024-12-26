import { FaPenAlt } from "react-icons/fa";
import { NavigationBar } from "../../helpers";
import { useState } from "react";

const AddStockInfo = () => {
    const [selectedDate, setSelectedDate] = useState('');
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

    return (
        <div className='bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div className="flex justify-center items-center pt-10">
                <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] bg-[#D2FF72] inline-block'></span>
                    <span className='w-full  flex items-center pl-2 h-[40px] text-xl text-white font-medium'><span className=''>THÊM THÔNG TIN CHO KHO</span></span></p>
            </div>
            <div className='w-full h-fit flex justify-end px-5 pt-5'>
                <button className='flex justify-center items-center px-3 bg-white py-2 gap-x-2 font-bold rounded-md shadow-md cursor-pointer hover:opacity-80'><span><FaPenAlt /></span>Cập nhật tồn kho</button>
            </div>
            <h1 className='w-full text-center text-white pb-5 pt-8 text-xl sm:text-4xl drop-shadow-md font-bold'>KHU CÔNG NGHIỆP</h1>
            <div className="px-5">
                <div className='mb-4'>
                    <label htmlFor="date" className='block text-white font-medium mb-2'>Chọn ngày <span className="text-red-500">(*)</span></label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className='w-full sm:w-[400px] p-3 rounded-lg border border-gray-300 outline-none'
                        required
                    />
                </div>
                <div className="sm:flex sm:gap-x-4">
                    <div className="sm:bg-[rgba(0,0,0,.5)] p-4 rounded-lg">
                        <p className="text-white py-4">Hàng tồn kho trong ngày hôm nay <span className="text-red-500">(*)</span></p>
                        <div className="flex gap-x-3">
                            <div className='mb-4'>
                                <label htmlFor="cups500ml" className='block font-medium mb-2 text-[#FFEC59]'>500ml</label>
                                <input
                                    type="number"
                                    id="cups500ml"
                                    value={noGlassInDay.cups500ml}
                                    onChange={(e) => setNoGlassInDay({ ...noGlassInDay, cups500ml: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="cups700ml" className='block font-medium mb-2 text-[#FFEC59]'>700ml</label>
                                <input
                                    type="number"
                                    id="cups700ml"
                                    value={noGlassInDay.cups700ml}
                                    onChange={(e) => setNoGlassInDay({ ...noGlassInDay, cups700ml: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="cups800ml" className='block font-medium mb-2 text-[#FFEC59]'>800ml</label>
                                <input
                                    type="number"
                                    id="cups800ml"
                                    value={noGlassInDay.cups800ml}
                                    onChange={(e) => setNoGlassInDay({ ...noGlassInDay, cups800ml: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sm:bg-[rgba(0,0,0,.5)] p-4 rounded-lg">
                        <p className="text-white py-4">Hàng giao thêm cho kho <span className="text-red-500">(*)</span></p>
                        <div className="flex gap-x-3">
                            <div className='mb-4'>
                                <label htmlFor="deliveryCups500ml" className='block font-medium mb-2 text-[#FFEC59]'>500ml</label>
                                <input
                                    type="number"
                                    id="deliveryCups500ml"
                                    value={deliveryMore.cups500ml}
                                    onChange={(e) => setDeliveryMore({ ...deliveryMore, cups500ml: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="deliveryCups700ml" className='block font-medium mb-2 text-[#FFEC59]'>700ml</label>
                                <input
                                    type="number"
                                    id="deliveryCups700ml"
                                    value={deliveryMore.cups700ml}
                                    onChange={(e) => setDeliveryMore({ ...deliveryMore, cups700ml: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="deliveryCups800ml" className='block font-medium mb-2 text-[#FFEC59]'>800ml</label>
                                <input
                                    type="number"
                                    id="deliveryCups800ml"
                                    value={deliveryMore.cups800ml}
                                    onChange={(e) => setDeliveryMore({ ...deliveryMore, cups800ml: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sm:bg-[rgba(0,0,0,.5)] p-4 rounded-lg">
                        <p className="text-white py-4">Số ly vỡ <span className="text-red-500">(*)</span></p>
                        <div className="flex gap-x-3">
                            <div className='mb-4'>
                                <label htmlFor="breakCups500ml" className='block font-medium mb-2 text-[#FFEC59]'>500ml</label>
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
                                <label htmlFor="breakCups700ml" className='block font-medium mb-2 text-[#FFEC59]'>700ml</label>
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
                                <label htmlFor="breakCups800ml" className='block font-medium mb-2 text-[#FFEC59]'>800ml</label>
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
                <div className="flex justify-end mt-5 pb-5 font-bold ">
                    <button className='border-[4px] border-solid border-[#73EC8B] w-fit px-7 py-2 bg-white text-[#15B392] font-bold rounded-lg shadow-md hover:opacity-80'>Gửi đi</button>
                </div>
            </div>
        </div>
    );
}

export default AddStockInfo;