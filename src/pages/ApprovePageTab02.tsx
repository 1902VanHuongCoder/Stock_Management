import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { NavigationBar, SideBarOfAdmin } from '../helpers';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
import NotificationContext from '../contexts/NotificationContext';
import LoadingContext from '../contexts/LoadingContext';
import * as XLSX from 'xlsx'; // Import the XLSX library to read the Excel file
import { FaFileExcel } from 'react-icons/fa6';
import { IoMdRefresh } from 'react-icons/io';

interface Approval {
    id: string;
    branchId: string;
    branchName: string;
    selectedDay: string;
    selectedDate: string;
    staffCode: string;
    staffName: string;
    initialMoney: string;
    moneyUsed: string;
    note: string;
    total: string;
    noOnForcingMachine: number;
}

const ApprovePageTab02 = () => {
    const [refresh, setRefresh] = useState(false); // State for refreshing the page
    const [pendingApprovalsTab02, setPendingApprovalsTab02] = useState<Approval[]>([]);
    const [dataFromFile, setDataFromFile] = useState({ show: false, lGlass: 0, mGlass: 0, glass800: 0, totalRevenue: "" });
    const { setTypeAndMessage } = useContext(NotificationContext);
    const { open, close } = useContext(LoadingContext);

    const formatNumber = (number: number): string => { // Convert a number to a string with format 000.000.000
        return new Intl.NumberFormat('de-DE').format(number);
    };

    const parseFormattedNumber = (formattedNumber: string): number => { // Convert a formatted number to a number to calculate the total revenue and note
        return parseInt(formattedNumber.replace(/\./g, ''), 10);
    };


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { // Handle file change event to read data from the file
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];

        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target || !e.target.result) return;
            const data = new Uint8Array(e.target.result as ArrayBuffer); // Convert the file data to Uint8Array
            const workbook = XLSX.read(data, { type: 'array' }); // Read the file data as a workbook object

            // Assuming you're interested in the first sheet 
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as (string | number)[][]; // Convert the first sheet to JSON data array

            // Initialize the number of glasses with size L, M, 800 and the total revenue to save the data from the file 
            let mGlass = 0;
            let lGlass = 0;
            let glass800 = 0;
            let totalRevenue = 0;

            jsonData.forEach((row: (string | number)[]) => { // Loop through each row of the JSON data array to get the number of glasses with according size and the total revenue
                if (row[4] !== undefined && typeof row[4] === 'number' && !isNaN(row[4])) { // If the 5th column is a number, it's the number of glasses. That is a signature of a row containing the number of glasses
                    if (typeof row[5] === 'string' && /size L/i.test(row[5]) && !(/(Hủy)/i.test(row[5]))) { // If the 6th column's value contains 'size L' (case-insensitive), it's a glass with size L
                        lGlass += parseInt(row[7].toString()); // The number of according glasses is in the 8th column
                    } else if (typeof row[5] === 'string' && /size M/i.test(row[5]) && !(/(Hủy)/i.test(row[5]))) { // If the 6th column's value contains 'size M' (case-insensitive), it's a glass with size M
                        mGlass += parseInt(row[7].toString()); // The number of according glasses is in the 8th column
                    } else if (typeof row[5] === 'string' && row[5].includes('800') && !(/(Hủy)/i.test(row[5]))) { // If the 6th column's value contains '800', it's a glass with size 800
                        glass800 += parseInt(row[7].toString()); // The number of according glasses is in the 8th column
                    }
                }
                if (row[8] !== undefined && typeof row[8] === 'string' && row[8].includes('Tổng doanh thu')) { // This codition is used to get the total revenue from the file
                    totalRevenue = typeof row[9] === 'number' ? row[9] : 0;
                }
            });
            const newRevenue = formatNumber(totalRevenue); // Format the total revenue to 000.000.000 
            setDataFromFile({ show: true, lGlass, mGlass, glass800, totalRevenue: newRevenue }); // Save the data to the state to display it on the screen
        };

        reader.readAsArrayBuffer(file); // run the reader and extract the data from the file 

    };

    const handleApprove = async (report: Approval, index: number) => {
        open(); // Open the loading modal
        const remainRevenueInReality = parseFormattedNumber(report.total) + parseFormattedNumber(report.moneyUsed) - parseFormattedNumber(report.initialMoney); // Calculate the remaining revenue
        const dataToWriteIntoNote = remainRevenueInReality - parseFormattedNumber(dataFromFile.totalRevenue); // Get the total revenue from the file to save it to the note

        const reportData = {
            glassesOnApp: { lGlass: dataFromFile.lGlass, mGlass: dataFromFile.mGlass, glass800: dataFromFile.glass800 },
            revenueOnApp: dataFromFile.totalRevenue,
            glassesOnForceMachine: report.noOnForcingMachine,
            total: report.total,
            moneyUsed: report.moneyUsed,
            initialMoney: report.initialMoney,
            remainRevenue: formatNumber(remainRevenueInReality),
            note: formatNumber(dataToWriteIntoNote),
        };

        const month = report.selectedDate.slice(-2);
        const year = report.selectedDate.slice(0, 4);
        const documentId = `${report.branchId}${year}${month}02`; // Create the document ID to update the report

        const docRef = doc(db, 'stocks02', documentId); // Get the document reference to update the report
        try {
            const docSnap = await getDoc(docRef); // Get the document snapshot to check if the document exists or not
            if (docSnap.exists()) {
                const docData = docSnap.data(); // Get the document data to check if the report exists or not
                if (docData[`${report.selectedDay}`] !== undefined) {
                    await updateDoc(docRef, {
                        [report.selectedDay]: reportData
                    }); // Update the report if the document exists
                    const newPendingApprovalsTab02 = pendingApprovalsTab02.filter((_, i) => i !== index);
                    setPendingApprovalsTab02(newPendingApprovalsTab02); // Remove the approved report from the pending approvals
                    await deleteDoc(doc(db, 'pendingstab02', report.id));
                    setTypeAndMessage('success', 'Cập nhật báo cáo thành công');
                    close(); // Close the loading modal
                }
            } // Handle the update report event 
        } catch (error) {
            setTypeAndMessage('fail', 'Có lỗi xảy ra, vui lòng thử lại sau');
            console.log(error);
            close(); // Close the loading modal
        }

    }

    const handleDeny = async (data: Approval, index: number) => {
        open();
        try {
            const newPendingApprovalsTab02 = pendingApprovalsTab02.filter((_, i) => i !== index);
            setPendingApprovalsTab02(newPendingApprovalsTab02);
            await deleteDoc(doc(db, 'pendingstab02', data.id));
            close();
            setTypeAndMessage('success', 'Đã từ chối thông tin cập nhật của nhân viên!');
        } catch (error) {
            console.log(error);
            close();
            setTypeAndMessage('fail', 'Lỗi khi từ chối thông tin cập nhật của nhân viên! Hãy thử lại sau!');
        }
    }

    useEffect(() => {
        const fetchPendingApprovalsTab02 = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'pendingstab02'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Approval));
                setPendingApprovalsTab02(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu pending approvals:", error);
            }
        }
        fetchPendingApprovalsTab02();
    }, [refresh])

    return (
        <div className='relative bg-[#15B392] min-h-screen max-w-screen sm:flex sm:justify-end'>
            <SideBarOfAdmin />
            <div className='sm:w-[80%]'>
                <NavigationBar />
                <div className="sm:hidden flex justify-center items-center pt-10">
                    <p className='w-full px-5 flex items-center'>
                        <span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
                        <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'>
                            <span className=''>DUYỆT THÔNG TIN TỒN KHO</span>
                        </span>
                    </p>
                </div>
                <div className='hidden sm:block w-full text-center bg-[#2a2f2a] h-[80px]'>
                    <h1 className='text-4xl font-bold text-white drop-shadow-md  h-full flex justify-center items-center uppercase'>DUYỆT THÔNG TIN DO NHÂN VIÊN CẬP NHẬT</h1>
                </div>
                <div className='px-4 pt-4'>
                    <button className='px-4 py-2 bg-yellow-400 rounded-md flex items-center gap-x-2 ' onClick={() => setRefresh(!refresh)}>Làm mới <IoMdRefresh /></button>

                </div>
                <div className='w-full p-4 flex flex-col gap-y-4'>
                    {pendingApprovalsTab02.length > 0 ?
                        pendingApprovalsTab02.map((approval, index) => (
                            <div key={index} className='w-full bg-white h-fit flex flex-col gap-y-4 sm:flex-row justify-between border-[2px] border-dashed border-slate-500 py-4 px-4 text-[14px]'>
                                <p className='flex flex-col gap-y-1'><span>Nhân viên</span><span className="font-bold">{approval.staffName}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Chi nhánh</span><span className="font-bold">{approval.branchName}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Ngày</span><span className="font-bold">{String(approval.selectedDay).padStart(2, "0") + "/" + (approval.selectedDate).slice(-2) + "/" + (approval.selectedDate).slice(0, 4)}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Ly trên máy ép</span><span className="font-bold">{approval.noOnForcingMachine}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Tiền cuối ngày</span><span className="font-bold">{approval.total}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Tiền đã dùng</span><span className="font-bold">{approval.moneyUsed}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Vốn</span><span className="font-bold">{approval.initialMoney}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Ghi chú</span><span className="font-bold">{approval.note}</span></p>
                                <div>
                                    <p className='font-bold'>Chọn FILE báo cáo</p>
                                    <div className='relative mt-2 text-4xl text-green-600 bg-slate-200 w-fit p-4 rounded-lg shadow-md border-[2px] border-dashed border-slate-900'>
                                        <FaFileExcel />
                                        <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileChange(e)} className='w-[60px] absolute top-0 left-0 h-[60px] opacity-0 z-10' />
                                    </div>
                                </div>
                                {dataFromFile.show && (
                                    <div className='mt-4'>
                                        <p className='font-bold'>Dữ liệu từ file</p>
                                        <table className='w-full mt-2'>
                                            <thead>
                                                <tr>
                                                    <th className='border border-gray-300 p-2'>Size</th>
                                                    <th className='border border-gray-300 p-2'>Số lượng</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='border border-gray-300 p-2'>Ly size L</td>
                                                    <td className='border border-gray-300 p-2 text-center'>{dataFromFile.lGlass}</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-gray-300 p-2'>Ly size M</td>
                                                    <td className='border border-gray-300 p-2 text-center'>{dataFromFile.mGlass}</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-gray-300 p-2'>Ly size 800</td>
                                                    <td className='border border-gray-300 p-2 text-center'>{dataFromFile.glass800}</td>
                                                </tr>
                                                <tr className='bg-green-600 font-bold text-white'>
                                                    <td className='border border-gray-300 p-2'>Tổng doanh thu</td>
                                                    <td className='border border-gray-300 p-2 text-center'>{dataFromFile.totalRevenue} VND</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className='flex flex-row sm:flex-col gap-x-4 justify-end sm:justify-center gap-y-1 '>
                                    <button disabled={dataFromFile.show ? false : true} className='text-green-500 disabled:opacity-50' onClick={() => handleApprove(approval, index)}>Duyệt</button>
                                    <button className='text-red-500' onClick={() => handleDeny(approval, index)}>Từ chối</button>
                                </div>
                            </div>
                        ))
                        : (<p className='text-center text-white'>Không có thông tin cần duyệt</p>)}

                </div>
            </div>

        </div>
    );
};

export default ApprovePageTab02;