import { useContext, useEffect, useState } from 'react';
import { NavigationBar } from '../helpers';
import { FaEdit, FaEye, FaPenAlt, FaTrash } from "react-icons/fa";
// import { useParams } from 'react-router-dom';
import { collection, DocumentData, getDocs, setDoc } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
import SideBarOfAdmin from '../components/SideBarOfAdmin';
import UpdateRemainStock from '../components/UpdateRemainStock';
import ReportModal from '../components/ReportModal';
import UpdateReportModal from '../components/UpdateReportModal';
import { FaPenToSquare } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore/lite';
import ModifyStockDataInADay from '../components/ModifyStockDataInADay';
import LoadingContext from '../contexts/LoadingContext';
import NotificationContext from '../contexts/NotificationContext';
const StockDetails = () => {
    const { branchId } = useParams<{ branchId: string }>();
    const [dayToUpdateReport, setDayToUpdateReport] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState(branchId || '');
    const [nameOfBranch, setNameOfBranch] = useState('');
    const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const [branches, setBranches] = useState<DocumentData[]>([]);
    const [showUpdateRemainStockModal, setShowUpdateRemainStockModal] = useState(false); // State to control modal for updating stock
    const [showViewReportModal, setShowViewReportModal] = useState(false); // State to control modal for viewing report
    const [showUpdateReportModal, setShowUpdateReportModal] = useState(false); // State to control modal for updating report
    const [modifyStockDataInADay, setModifyStockDataInADay] = useState({
        showModal: false,
        currentData: {
            noCupsLeftInTheStore: { '500ml': 0, '700ml': 0, '800ml': 0 },
            deliveryMore: { '500ml': 0, '700ml': 0, '800ml': 0 },
            totalNoCupsPerDay: { '500ml': 0, '700ml': 0, '800ml': 0 },
            totalCupsSole: { '500ml': 0, '700ml': 0, '800ml': 0 },
            breakGlass: { '500ml': 0, '700ml': 0, '800ml': 0 }
        },
        dayToModify: "",
        monthToModify: selectedDate.slice(-2),
        yearToModify: selectedDate.slice(0, 4)
    }); // State to control modal for modifying stock data in a day
    const [noCupsLeftInTheStore, setNoCupsLeftInTheStore] = useState({ '500ml': 0, '700ml': 0, '800ml': 0 });
    const [allStockDataInAMonth, setAllStockDataInAMonth] = useState<[string, { noCupsLeftInTheStore: { '500ml': number; '700ml': number; '800ml': number }; deliveryMore: { '500ml': number; '700ml': number; '800ml': number }; totalNoCupsPerDay: { '500ml': number; '700ml': number; '800ml': number }; totalCupsSole: { '500ml': number; '700ml': number; '800ml': number }; breakGlass: { '500ml': number; '700ml': number; '800ml': number } }][]>([]);
    const [tab, setTab] = useState(0);
    const { open, close } = useContext(LoadingContext);
    const { setTypeAndMessage } = useContext(NotificationContext);
    const [reFetchStockData, setReFetchStockData] = useState(false);

    const handleChosingBranchAndDate = async () => {
        open();
        const month = selectedDate.slice(-2);
        const year = selectedDate.slice(0, 4);
        const documentId = `${selectedBranch}${year}${month}`;

        const docRef = doc(db, 'stocks', documentId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const allData = Object.entries(data);
                setAllStockDataInAMonth(allData);
                const lastDay = allData.length;
                const lastDayData = allData[lastDay - 1][1];
                setNoCupsLeftInTheStore(lastDayData.noCupsLeftInTheStore);
                close();
            } else {
                setAllStockDataInAMonth([]);
                setNoCupsLeftInTheStore({ '500ml': 0, '700ml': 0, '800ml': 0 });
                close();
                setTypeAndMessage('fail', 'Tháng này không có dữ liệu tồn kho. Hãy cập nhật!');
            }
        } catch (error) {
            console.error("Error getting documents: ", error);
            close();
            setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
        }
    }

    const fetchStockData = async () => {
        const currentYear = selectedDate.slice(0, 4);
        const currentMonth = selectedDate.slice(-2);
        const documentId = `${selectedBranch}${currentYear}${currentMonth}`;

        const docRef = doc(db, 'stocks', documentId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const allData = Object.entries(data);
                setAllStockDataInAMonth(allData);
                const lastDay = allData.length;
                const lastDayData = allData[lastDay - 1][1];
                setNoCupsLeftInTheStore(lastDayData.noCupsLeftInTheStore);
            }
        } catch (error) {
            console.error("Error getting documents: ", error);
            setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
        }

    }

    const handleDeleteStockDataInOneDay = async (day: string) => {  // Function to delete stock data in one day 
        const month = selectedDate.slice(-2);
        const year = selectedDate.slice(0, 4);
        try {

            let soLyConLaiTrongNgay: { [key: string]: number } = {};
            let obj1 = Object.fromEntries(allStockDataInAMonth);
            let obj2 = Object.fromEntries(allStockDataInAMonth);
            let yearToAccessData = selectedDate.slice(0, 4);
            let monthToAccessData = selectedDate.slice(-2);
            let yearToUpdate = selectedDate.slice(0, 4);
            let monthToUpdate = selectedDate.slice(-2);

            let ngayTruocNgayBiXoa = (parseInt(day) - 1).toString();  // The day before the day to be deleted
            let ngaySauNgayBiXoa = (parseInt(day) + 1).toString(); // The day after the day to be deleted

            let flagToTerminateLoop = 0; // Flag to terminate the loop

            while (obj2[`${ngayTruocNgayBiXoa}`] === undefined && flagToTerminateLoop < 2) {
                if (parseInt(ngayTruocNgayBiXoa) > 0) {
                    ngayTruocNgayBiXoa = (parseInt(ngayTruocNgayBiXoa) - 1).toString();
                }
                if (parseInt(ngayTruocNgayBiXoa) < 1 && monthToAccessData !== '01') {
                    monthToAccessData = String(parseInt(monthToAccessData) - 1).padStart(2, '0');
                    const newDocumentId = `${selectedBranch}${yearToAccessData}${monthToAccessData}`;

                    const newDocRef = doc(db, 'stocks', newDocumentId);
                    const newDocSnap = await getDoc(newDocRef);
                    if (newDocSnap.exists()) {
                        obj2 = newDocSnap.data();
                        flagToTerminateLoop += 1;
                        ngayTruocNgayBiXoa = "31";
                        console.log("Tháng", monthToAccessData, "có dữ liệu tồn kho");
                    } else if (!newDocSnap.exists()) {
                        flagToTerminateLoop += 1;
                        ngayTruocNgayBiXoa = "0";
                        console.log("Tháng", monthToAccessData, " KHÔNG có dữ liệu tồn kho");
                    }
                }
                else if (parseInt(ngayTruocNgayBiXoa) < 1 && monthToAccessData === '01') {
                    console.log("=== '01' runnn ");
                    yearToAccessData = (parseInt(yearToAccessData) - 1).toString();
                    monthToAccessData = "12";
                    const newDocumentId = `${selectedBranch}${yearToAccessData}${monthToAccessData}`;
                    const newDocRef = doc(db, 'stocks', newDocumentId);
                    const newDocSnap = await getDoc(newDocRef);
                    if (newDocSnap.exists() && flagToTerminateLoop < 2) {
                        flagToTerminateLoop += 1;
                        obj2 = newDocSnap.data();
                        ngayTruocNgayBiXoa = "31";
                    } else if (!newDocSnap.exists()) {
                        ngayTruocNgayBiXoa = "0";
                    }
                }
            }

            let flagToTerminateLoop2 = 0; // Flag to terminate the loop
            while (obj1[`${ngaySauNgayBiXoa}`] === undefined && flagToTerminateLoop2 < 2) {
                ngaySauNgayBiXoa = (parseInt(ngaySauNgayBiXoa) + 1).toString();
                if (parseInt(ngaySauNgayBiXoa) > 31 && monthToUpdate !== '12') {
                    monthToUpdate = String(parseInt(monthToUpdate) + 1).padStart(2, '0');
                    const newDocumentId = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
                    const newDocRef = doc(db, 'stocks', newDocumentId);
                    const newDocSnap = await getDoc(newDocRef);
                    if (newDocSnap.exists()) {
                        obj1 = newDocSnap.data();
                        flagToTerminateLoop2 += 1;
                        ngaySauNgayBiXoa = "1";
                    } else if (!newDocSnap.exists()) {
                        flagToTerminateLoop2 += 1;
                    }

                } else if (parseInt(ngaySauNgayBiXoa) > 31 && monthToUpdate === '12') {
                    yearToUpdate = (parseInt(yearToUpdate) + 1).toString();
                    monthToUpdate = "01";
                    const newDocumentId = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
                    const newDocRef = doc(db, 'stocks', newDocumentId);
                    const newDocSnap = await getDoc(newDocRef);
                    if (newDocSnap.exists()) {
                        obj1 = newDocSnap.data();
                        flagToTerminateLoop2 += 1;
                        ngaySauNgayBiXoa = "1";
                    } else if (!newDocSnap.exists()) {
                        flagToTerminateLoop2 += 1;
                    }
                }
            }

            if (obj2[`${ngayTruocNgayBiXoa}`] !== undefined && obj1[`${ngaySauNgayBiXoa}`] !== undefined) {
                soLyConLaiTrongNgay = obj2[`${ngayTruocNgayBiXoa}`].noCupsLeftInTheStore;
                const tongCoTrongNgay = {
                    '500ml': soLyConLaiTrongNgay['500ml'] + obj1[`${ngaySauNgayBiXoa}`].deliveryMore['500ml']
                    , '700ml': soLyConLaiTrongNgay['700ml'] + obj1[`${ngaySauNgayBiXoa}`].deliveryMore['700ml']
                    , '800ml': soLyConLaiTrongNgay['800ml'] + obj1[`${ngaySauNgayBiXoa}`].deliveryMore['800ml']
                };
                const tongBanDuoc = {
                    '500ml': tongCoTrongNgay['500ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['500ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['500ml']
                    , '700ml': tongCoTrongNgay['700ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['700ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['700ml']
                    , '800ml': tongCoTrongNgay['800ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['800ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['800ml']
                };

                const newStockData = {
                    ...obj1,
                    [`${ngaySauNgayBiXoa}`]: {
                        noCupsLeftInTheStore: obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore,
                        deliveryMore: obj1[`${ngaySauNgayBiXoa}`].deliveryMore,
                        totalNoCupsPerDay: tongCoTrongNgay,
                        totalCupsSole: tongBanDuoc,
                        breakGlass: obj1[`${ngaySauNgayBiXoa}`].breakGlass
                    }
                };

                const documentIdToUpdate = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
                // const documentIdToUpdate = `${selectedBranch}${year}${month}`;

                const docRefToUpdate = doc(db, 'stocks', documentIdToUpdate);

                try {
                    if (yearToUpdate === year && monthToUpdate === month) { // 
                        const newAllStockDataInAMonth = Object.entries(newStockData).filter((data) => data[0] !== day);
                        await setDoc(docRefToUpdate, Object.fromEntries(newAllStockDataInAMonth));
                    } else {
                        const documentContainsElementIsDeleted = `${selectedBranch}${year}${month}`;
                        const docRefToDelete = doc(db, 'stocks', documentContainsElementIsDeleted);
                        const newAllStockDataInAMonth = allStockDataInAMonth.filter((data) => data[0] !== day);
                        await setDoc(docRefToDelete, Object.fromEntries(newAllStockDataInAMonth));
                        await setDoc(docRefToUpdate, newStockData);

                    }
                } catch (error) {
                    console.error("Error getting documents: ", error);
                    setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
                }

            } else if (obj2[`${ngayTruocNgayBiXoa}`] === undefined && obj1[`${ngaySauNgayBiXoa}`] !== undefined) {
                const tongCoTrongNgay = {
                    '500ml': obj1[`${ngaySauNgayBiXoa}`].deliveryMore['500ml']
                    , '700ml': obj1[`${ngaySauNgayBiXoa}`].deliveryMore['700ml']
                    , '800ml': obj1[`${ngaySauNgayBiXoa}`].deliveryMore['800ml']
                };

                const tongBanDuoc = {
                    '500ml': tongCoTrongNgay['500ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['500ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['500ml']
                    , '700ml': tongCoTrongNgay['700ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['700ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['700ml']
                    , '800ml': tongCoTrongNgay['800ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['800ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['800ml']
                };
                const newStockData = {
                    ...obj1,
                    [`${ngaySauNgayBiXoa}`]: {
                        noCupsLeftInTheStore: obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore,
                        deliveryMore: obj1[`${ngaySauNgayBiXoa}`].deliveryMore,
                        totalNoCupsPerDay: tongCoTrongNgay,
                        totalCupsSole: tongBanDuoc,
                        breakGlass: obj1[`${ngaySauNgayBiXoa}`].breakGlass
                    }
                };

                const documentIdToUpdate = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
                const docRefToUpdate = doc(db, 'stocks', documentIdToUpdate);
                try {
                    if (yearToUpdate === year && monthToUpdate === month) { // 
                        const newAllStockDataInAMonth = Object.entries(newStockData).filter((data) => data[0] !== day);
                        await setDoc(docRefToUpdate, Object.fromEntries(newAllStockDataInAMonth));

                    } else {
                        const documentContainsElementIsDeleted = `${selectedBranch}${year}${month}`;
                        const docRefToDelete = doc(db, 'stocks', documentContainsElementIsDeleted);
                        const newAllStockDataInAMonth = allStockDataInAMonth.filter((data) => data[0] !== day);
                        await setDoc(docRefToDelete, Object.fromEntries(newAllStockDataInAMonth));
                        await setDoc(docRefToUpdate, newStockData);

                    }
                } catch (error) {
                    console.error("Error getting documents: ", error);
                    setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
                }
            } else {

                if (monthToUpdate !== month && yearToUpdate !== year) {
                    const documentToDeleteStockData = `${selectedBranch}${year}${month}`;
                    const docRefToDeleteStockData = doc(db, 'stocks', documentToDeleteStockData);
                    const newAllStockDataInAMonth = allStockDataInAMonth.filter((data) => data[0] !== day);
                    await setDoc(docRefToDeleteStockData, Object.fromEntries(newAllStockDataInAMonth));
                }
            }
            setReFetchStockData(!reFetchStockData);
            setTypeAndMessage('success', 'Xóa dữ liệu thành công!');
        } catch (error) {
            setReFetchStockData(!reFetchStockData);
            console.error("Error getting documents: ", error);
            setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
        }
    }

    useEffect(() => {
        const getAllBranches = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'branches')) // Get all branches from Firestore 
                const branches = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return { id: doc.id, name: data.name };
                }); // Map data from Firestore to branches array
                setBranches(branches);
            } catch (error) {
                setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
                console.error("Error getting documents: ", error);

            }

        }
        fetchStockData();
        getAllBranches();
    }, [reFetchStockData]);

    useEffect(() => {
        branches.forEach((branch) => {
            if (selectedBranch === '') {
                if (branch.id === branchId) {
                    setNameOfBranch(branch.name);
                }
            } else {
                if (branch.id === selectedBranch) {
                    setNameOfBranch(branch.name);
                }
            }
        });
    }, [selectedBranch, branchId, branches]);

    console.log("1");

    return (
        <div className='relative min-h-screen max-w-screen sm:flex sm:justify-end bg-[#15b392]' >
            <SideBarOfAdmin />
            <div className='sm:basis-[80%]'>
                <NavigationBar />
                <div className="flex sm:hidden justify-center items-center pt-10">
                    <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
                        <span className='w-full flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'><span className=''>QUẢN LÝ KHO (01/11/2024)</span></span></p>
                </div>
                <div className='hidden sm:block w-full text-center bg-[#2a2f2a] h-[80px]'>
                    <h1 className='text-4xl font-bold text-white drop-shadow-md h-full flex justify-center items-center uppercase'>QUẢN LÝ KHO</h1>
                </div>
                <div onClick={() => { setShowUpdateRemainStockModal(true) }} className='w-full h-fit flex justify-end px-5 pt-5'>
                    <button className='border-[3px] border-solid border-slate-800 flex justify-center items-center px-3 sm:px-5 sm:py-4 sm:text-lg bg-white py-2 gap-x-2 font-bold rounded-md hover:shadow-lg transition-all cursor-pointer uppercase'><span><FaPenAlt /></span>Cập nhật tồn kho</button>
                </div>
                <h1 className='w-full text-center text-white pb-5 pt-8 text-xl sm:text-3xl drop-shadow-md font-bold uppercase'>QUẦY {nameOfBranch}</h1>
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
                        <div className='mb-4 h-fit flex justify-end'>
                            <label htmlFor="submit" className='text-white font-medium mb-2 hidden sm:invisible'>Chọn tháng</label>
                            <input
                                type="button"
                                id="submit"
                                onClick={handleChosingBranchAndDate}
                                value={'Xem'}
                                className='sm:translate-y-[15px] border-[3px] border-solid border-slate-800 px-6 py-3 rounded-lg outline-none bg-[#FFEC59] font-bold hover:shadow-lg cursor-pointer transition-all'
                            />
                        </div>

                    </div>
                    <p className='block text-white font-medium mb-2'>Số ly tồn kho </p>
                    <div className='flex justify-center sm:justify-start items-center gap-x-2'>
                        <div className='bg-white rounded-lg p-2 sm:p-6 flex flex-col items-center gap-y-3 shadow-xl'>
                            <div className='p-4 w-[70px] h-[70px] flex justify-center items-center shadow-md sm:h-[100px] sm:w-[100px] sm:flex sm:justify-center sm:items-center bg-[#15b392] rounded-full text-[#FFEC59] font-bold '>
                                <p className='sm:text-2xl sm:drop-shadow-lg'>{String(noCupsLeftInTheStore['500ml']).padStart(2, '0')}</p>
                            </div>
                            <p className='text-center sm:text-xl'>Ly 500ml size M</p>
                        </div>
                        <div className='bg-white rounded-lg p-2 sm:p-6 flex flex-col items-center gap-y-3 shadow-xl'>
                            <div className='p-4 w-[70px] h-[70px] flex justify-center items-center shadow-md sm:h-[100px] sm:w-[100px] sm:flex sm:justify-center sm:items-center bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                                <p className='sm:text-2xl sm:drop-shadow-lg'>{String(noCupsLeftInTheStore['700ml']).padStart(2, '0')}</p>
                            </div>
                            <p className='text-center sm:text-xl'>Ly 700ml size M</p>
                        </div>
                        <div className='bg-white rounded-lg p-2 sm:p-6 flex flex-col items-center gap-y-3 shadow-xl'>
                            <div className='p-4 w-[70px] h-[70px] flex justify-center items-center shadow-md sm:h-[100px] sm:w-[100px] sm:flex sm:justify-center sm:items-center bg-[#15b392] rounded-full text-[#FFEC59] font-bold'>
                                <p className='sm:text-2xl sm:drop-shadow-lg'>{String(noCupsLeftInTheStore['800ml']).padStart(2, '0')}</p>
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
                            <div className='flex items-center justify-end gap-x-4 py-4 px-2 text-white italic'>
                                <p>Ghi chú:</p>
                                <div className='flex gap-x-2 items-center '><span className="text-blue-500"><FaEdit /> </span><span>Nút cập nhật kho</span></div>
                                <div className='flex gap-x-2 items-center '><span className="text-red-500"><FaTrash /> </span><span>Nút xóa kho</span></div>

                            </div>
                            <table className='min-w-full bg-white'>
                                <thead className='bg-[rgb(8,110,89)] text-white'>
                                    <tr>
                                        <th rowSpan={2} className='border px-4 py-2'>Ngày</th>
                                        <th colSpan={3} className='border px-4 py-2'>Ly tồn quầy</th>
                                        <th colSpan={3} className='border px-4 py-2'>Giao thêm</th>
                                        <th colSpan={3} className='border px-4 py-2'>Tổng có trong ngày</th>
                                        <th colSpan={3} className='border px-4 py-2'>Ly ép hư</th>
                                        <th colSpan={3} className='border px-4 py-2'>Tổng bán được</th>

                                        <th rowSpan={3} className='border px-4 py-2'>Hành động</th>
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
                                    {allStockDataInAMonth.length > 0 ? allStockDataInAMonth.map((data: [string, { noCupsLeftInTheStore: { '500ml': number; '700ml': number; '800ml': number }; deliveryMore: { '500ml': number; '700ml': number; '800ml': number }; totalNoCupsPerDay: { '500ml': number; '700ml': number; '800ml': number }; totalCupsSole: { '500ml': number; '700ml': number; '800ml': number }; breakGlass: { '500ml': number; '700ml': number; '800ml': number } }]) => {
                                        return (
                                            <tr key={data[0]} className='bg-slate-100'>
                                                <td className='border px-4 py-2 bg-slate-300'>{data[0]}</td>
                                                <td className='border px-4 py-2'>{data[1].noCupsLeftInTheStore['500ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].noCupsLeftInTheStore['700ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].noCupsLeftInTheStore['800ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].deliveryMore['500ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].deliveryMore['700ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].deliveryMore['800ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].totalNoCupsPerDay['500ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].totalNoCupsPerDay['700ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].totalNoCupsPerDay['800ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].breakGlass['500ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].breakGlass['700ml']}</td>
                                                <td className='border px-4 py-2'>{data[1].breakGlass['800ml']}</td>
                                                <td className='border px-4 py-2 bg-red-300'>{data[1].totalCupsSole['500ml']}</td>
                                                <td className='border px-4 py-2 bg-red-300'>{data[1].totalCupsSole['700ml']}</td>
                                                <td className='border px-4 py-2 bg-red-300'>{data[1].totalCupsSole['800ml']}</td>

                                                <td className='px-4 py-4 flex justify-around border'>
                                                    {/* monthToModify: selectedDate.slice(-2),
                                                    yearToModify: selectedDate.slice(0, 4) */}
                                                    <button onClick={() => { setModifyStockDataInADay({ ...modifyStockDataInADay, showModal: true, currentData: data[1], dayToModify: data[0], monthToModify: selectedDate.slice(-2), yearToModify: selectedDate.slice(0, 4) }) }} className='text-blue-500 hover:text-blue-700'><FaEdit /></button>
                                                    <button onClick={() => handleDeleteStockDataInOneDay(data[0])} className='text-red-500 hover:text-red-700'><FaTrash /></button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr className='bg-slate-100 text-center'><td colSpan={24} rowSpan={4} className='text-center py-5'>Chưa có dữ liệu kho</td></tr>}
                                </tbody>
                            </table>

                        </div>}
                        {tab === 1 && <div className='overflow-x-auto mt-10'>
                            <table className='min-w-full bg-white'>
                                <thead className='bg-[rgb(8,110,89)] text-white drop-shadow-lg'>
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
                                            <td className='border px-4 py-2'><span className='flex justify-center items-center text-[#15B392]' onClick={() => { setShowViewReportModal(true); setDayToUpdateReport(1) }}><FaEye /></span></td>
                                            <td className='border px-4 py-2'><span className='flex justify-center items-center text-[#dfca2b]' onClick={() => { setShowUpdateReportModal(true) }}><FaPenToSquare /></span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}

                    </div>
                </div>
                {showUpdateRemainStockModal && <UpdateRemainStock closeModal={() => setShowUpdateRemainStockModal(false)} yearAndMonthToUpdate={selectedDate} selectedBranch={selectedBranch} reFetch={() => { setReFetchStockData(!reFetchStockData) }} />}
                {showViewReportModal && <ReportModal closeModal={() => setShowViewReportModal(false)} />}
                {showUpdateReportModal && <UpdateReportModal closeModal={() => setShowUpdateReportModal(false)} branchName={nameOfBranch} dayToUpdateReport={dayToUpdateReport} />}
                {modifyStockDataInADay.showModal && <ModifyStockDataInADay reFetch={() => { setReFetchStockData(!reFetchStockData) }} branchId={selectedBranch} currentData={modifyStockDataInADay.currentData} dayToModify={modifyStockDataInADay.dayToModify} monthToModify={modifyStockDataInADay.monthToModify} yearToModify={modifyStockDataInADay.yearToModify} closeModal={() => setModifyStockDataInADay({ ...modifyStockDataInADay, showModal: false })} />}
            </div>
        </div>
    );
};

export default StockDetails;