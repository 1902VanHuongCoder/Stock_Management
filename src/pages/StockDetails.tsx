import { useState } from 'react';
import { NavigationBar } from '../helpers';
import { FaEdit, FaPenAlt, FaTrash } from "react-icons/fa";

const StockDetails = () => {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const branches = [
        { id: '1', name: 'Branch 1' },
        { id: '2', name: 'Branch 2' },
        { id: '3', name: 'Branch 3' },
        { id: '4', name: 'Branch 4' },
        { id: '5', name: 'Branch 5' },
        { id: '6', name: 'Branch 6' },
        { id: '7', name: 'Branch 7' },
        { id: '8', name: 'Branch 8' },
    ];

    return (
        <div className='bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div className="flex justify-center items-center pt-10">
                <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] bg-[#D2FF72] inline-block'></span>
                    <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 h-[40px] text-xl text-white font-medium'><span className=''>QUẢN LÝ KHO (23/11)</span></span></p>
            </div>
            <div className='w-full h-fit flex justify-end px-5 pt-5'>
                <button className='flex justify-center items-center px-4 bg-white py-2 gap-x-2 font-bold rounded-md shadow-md cursor-pointer hover:opacity-80'><span><FaPenAlt /></span>Cập nhật tồn kho</button>
            </div>
            <h1 className='w-full text-center text-white pb-5 pt-8 text-xl drop-shadow-md font-bold'>KHU CÔNG NGHIỆP</h1>
            <div className='px-5'>
                <div className='mb-4'>
                    <label htmlFor="branch" className='block text-white font-medium mb-2'>Chọn chi nhánh:</label>
                    <select
                        id="branch"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                    >
                        <option value="">Chọn chi nhánh</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="date" className='block text-white font-medium mb-2'>Chọn ngày:</label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className='w-full p-3 rounded-lg border border-gray-300 outline-none'
                    />
                </div>
                <p className='block text-white font-medium mb-2'>Số ly tồn kho: </p>
                <div className='flex justify-center items-center gap-x-2'>
                    <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-y-3 shadow-xl'>
                        <div className='p-4 bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                            <p>160</p>
                        </div>
                        <p className='text-center'>Ly 500ml size M</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-y-3 shadow-xl'>
                        <div className='p-4 bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                            <p>123</p>
                        </div>
                        <p className='text-center'>Ly 700ml size M</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-y-3 shadow-xl'>
                        <div className='p-4 bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                            <p>160</p>
                        </div>
                        <p className='text-center'>Ly 800ml size lớn</p>
                    </div>
                </div>
                <div className='pt-5 mt-10'>
                    <div className='flex items-center gap-x-4'>
                        <button className='py-2 px-6 font-bold bg-[#FFEC59] border-[4px]  cursor-pointer border-solid border-[#54C392]'>TAB 01</button>
                        <button className='py-2 px-6 font-bold bg-[#FFEC59] border-[4px] cursor-pointer border-solid border-[#54C392]'>TAB 02</button>
                    </div>
                    <div className='overflow-x-auto mt-5'>
                        <table className='min-w-full bg-white'>
                            <thead className='bg-green-500 text-white'>
                                <tr>
                                    <th rowSpan={2} className='border px-4 py-2'>Ngày</th>
                                    <th colSpan={3} className='border px-4 py-2'>Ly tồn quầy</th>
                                    <th colSpan={3} className='border px-4 py-2'>Giao thêm</th>
                                    <th colSpan={3} className='border px-4 py-2'>Tổng có trong ngày</th>
                                    <th colSpan={3} className='border px-4 py-2'>Tổng bán được</th>
                                    <th colSpan={3} className='border px-4 py-2'>Ly ép hư</th>
                                    <th rowSpan={3} className='border px-4 py-2'>Action</th>
                                </tr>
                                <tr>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(31)].map((_, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-100' : ''}`}>
                                        <td className='border px-4 py-2'>{index + 1}</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='px-4 py-4 flex justify-around border'>
                                            <button className='text-blue-500 hover:text-blue-700'><FaEdit /></button>
                                            <button className='text-red-500 hover:text-red-700'><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='overflow-x-auto mt-10'>
                        <table className='min-w-full bg-white'>
                            <thead className='bg-green-500 text-white'>
                                <tr>
                                    <th rowSpan={3} className='border px-4 py-2'>Ngày</th>
                                    <th colSpan={4} className='border px-4 py-2 uppercase'>Báo cáo app</th>
                                    <th colSpan={9} className='border px-4 py-2 uppercase'>Doanh thu thực tế</th>
                                    <th rowSpan={3} className='border px-4 py-2'>Báo cáo</th>
                                    <th rowSpan={3} className='border px-4 py-2'>Cập nhật</th>
                                </tr>
                                <tr>
                                    <th colSpan={3} className='border px-4 py-2'>Số ly</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Số tiền trên app</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Số ly trên máy ép</th>
                                    <th colSpan={3} className='border px-4 py-2'>Ly thực</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Tổng tiền cuối ngày</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Chi trong ngày</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Vốn</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Doanh thu còn</th>
                                    <th rowSpan={2} className='border px-4 py-2'>Ghi chú</th>
                                </tr>
                                <tr>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                    <th className='border px-4 py-2'>500ml</th>
                                    <th className='border px-4 py-2'>700ml</th>
                                    <th className='border px-4 py-2'>800ml</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(31)].map((_, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-100' : ''}`}>
                                        <td className='border px-4 py-2'>{index + 1}</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                        <td className='border px-4 py-2'>0</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetails;