import { useState } from 'react'
import { FaFileExcel } from 'react-icons/fa';

const UpdateReportModal = ({ closeModal }: { closeModal: () => void }) => {
    const [report, setReport] = useState({
        noOnForcingMachine: 0,
        total: 0,
        moneyUsed: 0,
        initialMoney: 0,
    });
    return (
        <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.8)]'>
            <div className='w-full sm:w-[900px] h-fit bg-white p-4 sm:p-6 border-[2px] border-dashed border-slate-500'>
                <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>CẬP NHẬT BÁO CÁO</h2>
                <p className='pb-4 flex justify-between'><span>KHU CÔNG NGHIỆP</span><span>01/11/2024</span></p>
                <div>
                    <form>
                        <div className="flex gap-x-3 flex-col sm:flex-row">
                            <div className='mb-4'>
                                <label htmlFor="noOnForcingMachine" className='block font-medium text-black mb-2'>Số ly trên máy ép <span className='text-red-500'>(*)</span></label>
                                <input
                                    type="number"
                                    id="noOnForcingMachine"
                                    value={report.noOnForcingMachine}
                                    onChange={(e) => setReport({ ...report, noOnForcingMachine: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="total" className='block font-medium text-black mb-2'>Tổng tiền cuối ngày <span className='text-red-500'>(*)</span></label>
                                <input
                                    type="number"
                                    id="total"
                                    value={report.total}
                                    onChange={(e) => setReport({ ...report, total: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="moneyUsed" className='block font-medium text-black mb-2'>Chi trong ngày <span className='text-red-500'>(*)</span></label>
                                <input
                                    type="number"
                                    id="moneyUsed"
                                    value={report.moneyUsed}
                                    onChange={(e) => setReport({ ...report, moneyUsed: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="initialMoney" className='block font-medium text-black mb-2'>Vốn <span className='text-red-500'>(*)</span></label>
                                <input
                                    type="number"
                                    id="initialMoney"
                                    value={report.initialMoney}
                                    onChange={(e) => setReport({ ...report, initialMoney: parseInt(e.target.value) })}
                                    className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <p className='font-bold'>Chọn FILE báo cáo</p>
                    <div className='mt-2 text-4xl text-green-600 bg-slate-200 w-fit p-4 rounded-lg shadow-md border-[2px] border-dashed border-slate-900'>
                        <FaFileExcel />
                    </div>
                </div>
                <div className='pt-8 pb-2 flex justify-end gap-x-2'>
                    <button onClick={() => { closeModal() }} className='px-6 py-2 rounded-md border-[2px] border-solid border-red-500 text-red-500 text-lg hover:opacity-80 transition-all'>Đóng</button>
                    <button className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateReportModal