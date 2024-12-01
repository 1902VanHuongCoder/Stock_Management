import { useEffect, useState } from 'react';
import { NavigationBar } from '../helpers';
import { FaEdit, FaPenAlt, FaTrash } from "react-icons/fa";
import { ButtonToHome } from '../components/ButtonToHome';
import { FaFileExcel } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { collection, DocumentData, getDocs } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
const StockDetails = () => {
    const { id } = useParams<{ id: string }>();

    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [branches, setBranches] = useState<DocumentData[]>([]);
    console.log(branches);
    const [report, setReport] = useState({
        noOnForcingMachine: 0,
        total: 0,
        moneyUsed: 0,
        initialMoney: 0,
    });
    const [tab, setTab] = useState(0);



    useEffect(() => {
        const getAllBranches = async () => {
            const querySnapshot = await getDocs(collection(db, 'branches')) // Get all branches from Firestore
            const branches = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return { id: doc.id, name: data.name };
            }); // Map data from Firestore to branches array
            setBranches(branches);
        }

        getAllBranches();
    }, []);
    return (
        <div className='relative bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div className="flex justify-center items-center pt-10">
                <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
                    <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'><span className=''>QUẢN LÝ KHO (01/11/2024)</span></span></p>
            </div>
            <div className='w-full h-fit flex justify-end px-5 pt-5'>
                <button className='flex justify-center items-center px-3 sm:px-5 sm:py-4 sm:text-lg bg-white py-2 gap-x-2 font-bold rounded-md shadow-md cursor-pointer hover:opacity-80'><span><FaPenAlt /></span>Cập nhật tồn kho</button>
            </div>
            <h1 className='w-full text-center text-white pb-5 pt-8 text-xl sm:text-3xl drop-shadow-md font-bold'>KHU CÔNG NGHIỆP</h1>
            <div className='px-5'>
                <div className='sm:flex gap-x-5 items-center'>
                    <div className='mb-4'>
                        <label htmlFor="branch" className='block text-white font-medium mb-2'>Chọn chi nhánh</label>
                        <select
                            id="branch"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className='w-full p-3 sm:py-[15px] sm:w-[400px] rounded-lg border border-gray-300 outline-none'
                        >
                            <option value="">Chọn chi nhánh</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
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
                </div>
                <p className='block text-white font-medium mb-2'>Số ly tồn kho </p>
                <div className='flex justify-center sm:justify-start items-center gap-x-2'>
                    <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-y-3 shadow-xl'>
                        <div className='p-4 sm:h-[100px] sm:w-[100px] sm:flex sm:justify-center sm:items-center bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                            <p className='sm:text-2xl sm:drop-shadow-lg'>160</p>
                        </div>
                        <p className='text-center sm:text-xl'>Ly 500ml size M</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-y-3 shadow-xl'>
                        <div className='p-4 sm:h-[100px] sm:w-[100px] sm:flex sm:justify-center sm:items-center bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                            <p className='sm:text-2xl sm:drop-shadow-lg'>123</p>
                        </div>
                        <p className='text-center sm:text-xl'>Ly 700ml size M</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-y-3 shadow-xl'>
                        <div className='p-4 sm:h-[100px] sm:w-[100px] sm:flex sm:justify-center sm:items-center bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                            <p className='sm:text-2xl sm:drop-shadow-lg'>160</p>
                        </div>
                        <p className='text-center sm:text-xl'>Ly 800ml size lớn</p>
                    </div>
                </div>
                <div className='pt-5 mt-10 pb-10'>
                    <div className='flex items-center gap-x-4'>
                        <button onClick={() => setTab(0)} className={`py-2 px-6 font-bold ${tab === 0 ? 'bg-white' : 'bg-white opacity-80'} border-[4px]  cursor-pointer border-solid border-[#54C392]`}>TAB 01</button>
                        <button onClick={() => setTab(1)} className={`py-2 px-6 font-bold ${tab === 1 ? 'bg-white' : 'bg-white opacity-80'} border-[4px] cursor-pointer border-solid border-[#54C392]`}>TAB 02</button>
                    </div>
                    {tab === 0 && <div className='overflow-x-auto mt-5'>
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
                            <tbody className='text-center'>
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
                    </div>}
                    {tab === 1 && <div className='overflow-x-auto mt-10'>
                        <table className='min-w-full bg-white'>
                            <thead className='bg-green-500 text-white drop-shadow-lg'>
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
                            <tbody className='text-center'>
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
                    </div>}
                </div>
            </div>

            {/* Create modal for reviewing report */}
            {/* <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center'>
                <div className='w-full sm:w-[700px] h-fit bg-white p-4 sm:p-6 border-[2px] border-dashed border-slate-500'>
                    <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>BÁO CÁO</h2>
                    <p className='pb-4 flex justify-between'><span>KHU CÔNG NGHIỆP</span><span>01/11/2024</span></p>
                    <div>
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-slate-200">
                                <tr>
                                    <th className="border border-gray-300 px-2 sm:px-4 py-2">Mục</th>
                                    <th className="border border-gray-300 px-2 sm:px-4 py-2">App</th>
                                    <th className="border border-gray-300 px-2 sm:px-4 py-2">Thực tế</th>
                                    <th className="border border-gray-300 px-2 sm:px-4 py-2">Chênh lệch</th>
                                    <th className="border border-gray-300 px-2 sm:px-4 py-2">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly M(500ml)</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2"></td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">100</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">5000</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">500000</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly L(700ml)</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly 700ml</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">100</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">7000</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">700000</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly 800ml</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly 800ml</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">100</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">8000</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">800000</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Số tiền</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly 800ml</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">100</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">8000</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">800000</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Máy ép</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly 800ml</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">100</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">8000</td>
                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">800000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='pt-5'>
                        <p className='font-bold'>KẾT LUẬN:</p>
                        <div>
                            <p>Bấm thiếu 03 ly M: <span className='font-bold text-lg text-red-500'>60.000</span> VND</p>
                            <p>Bấm thiếu 01 ly M: <span className='font-bold text-lg text-red-500'>10.000</span> VND</p>
                            <p>Thiếu 03 ly M: <span className='font-bold text-lg text-red-500'>60.000</span> VND</p>
                        </div>
                    </div>
                    <div className='pt-5 pb-2 flex justify-end'>
                        <button className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Đóng</button>
                    </div>
                </div>
            </div> */}
            {/* <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center'>
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
                    <div className='pt-8 pb-2 flex justify-between'>
                        <button className='px-6 py-2 rounded-md border-[2px] border-solid border-red-500 text-red-500 text-lg hover:opacity-80 transition-all'>Đóng</button>
                        <button className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default StockDetails;