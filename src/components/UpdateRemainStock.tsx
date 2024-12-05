import { useState } from 'react'

const UpdateRemainStock = ({ closeModal }: { closeModal: () => void }) => {
    const [selectedDateToUpdate, setSelectedDateToUpdate] = useState('');
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
        <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,0,0,.8)]'>
            <div className="px-5 w-[95%] sm:w-[80%] bg-white pt-5 border-[2px] border-dashed border-slate-500">
                <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>CẬP NHẬT TỒN KHO</h2>
                <div className='mb-4'>
                    <label htmlFor="date" className='block text-black font-medium mb-2'>Chọn ngày <span className="text-red-500">(*)</span></label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDateToUpdate}
                        onChange={(e) => setSelectedDateToUpdate(e.target.value)}
                        className='w-full sm:w-[400px] p-3 rounded-lg border border-gray-300 outline-none'
                        required
                    />
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
                    <button onClick={() => { closeModal() }} className='px-6 py-2 rounded-md border-[2px] border-solid border-red-500 text-red-500 text-lg hover:opacity-80 transition-all'>Đóng</button>
                    <button className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateRemainStock