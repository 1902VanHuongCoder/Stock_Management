// Coder: To Van Huong - Paul To - Viet Nam 
import { ChangeEvent, useContext, useState } from 'react'
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Import the XLSX library to read the Excel file
import { db } from '../services/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import NotificationContext from '../contexts/NotificationContext';
import LoadingContext from '../contexts/LoadingContext';

const UpdateReportModal = ({ closeModal, branchName, dayToUpdateReport, branchId, selectedDate, reFetch }: { closeModal: () => void, branchName: string, dayToUpdateReport: number, branchId: string, selectedDate: string, reFetch: () => void }) => {
    const [report, setReport] = useState({
        noOnForcingMachine: 0,
        total: 0,
        moneyUsed: 0,
        initialMoney: 1000000,
    });
    const { setTypeAndMessage } = useContext(NotificationContext); // Get the function to set the notification message
    const { open, close } = useContext(LoadingContext); // Get the function to open and close the loading modal

    const [dataFromFile, setDataFromFile] = useState({ show: false, lGlass: 0, mGlass: 0, glass800: 0, totalRevenue: "" });

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

    const handleUpdateReport = async () => {
        open(); // Open the loading modal
        const remainRevenueInReality = report.total + report.moneyUsed - report.initialMoney; // Calculate the remaining revenue
        const dataToWriteIntoNote = remainRevenueInReality - parseFormattedNumber(dataFromFile.totalRevenue); // Get the total revenue from the file to save it to the note

        const reportData = {
            glassesOnApp: { lGlass: dataFromFile.lGlass, mGlass: dataFromFile.mGlass, glass800: dataFromFile.glass800 },
            revenueOnApp: dataFromFile.totalRevenue,
            glassesOnForceMachine: report.noOnForcingMachine,
            total: formatNumber(report.total),
            moneyUsed: formatNumber(report.moneyUsed),
            initialMoney: formatNumber(report.initialMoney),
            remainRevenue: formatNumber(remainRevenueInReality),
            note: formatNumber(dataToWriteIntoNote),
        };

        const month = selectedDate.slice(-2);
        const year = selectedDate.slice(0, 4);
        const documentId = `${branchId}${year}${month}02`; // Create the document ID to update the report
        const docRef = doc(db, 'stocks02', documentId); // Get the document reference to update the report
        try {
            const docSnap = await getDoc(docRef); // Get the document snapshot to check if the document exists or not
            if (docSnap.exists()) {
                const docData = docSnap.data(); // Get the document data to check if the report exists or not
                if (docData[`${dayToUpdateReport}`] !== undefined) {
                    await updateDoc(docRef, {
                        [dayToUpdateReport]: reportData
                    }); // Update the report if the document exists
                    setTypeAndMessage('success', 'Cập nhật báo cáo thành công');
                    closeModal();
                    close(); // Close the loading modal
                    reFetch();
                }
            } // Handle the update report event 
        } catch (error) {
            setTypeAndMessage('fail', 'Có lỗi xảy ra, vui lòng thử lại sau');
            console.log(error);
            closeModal();
            close(); // Close the loading modal
        }

    }

    return (
        <div className='w-screen h-screen overflow-auto fixed top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.8)]'>
            <div className='w-full sm:w-[900px] h-fit overflow-auto bg-white p-4 sm:p-6 border-[2px] border-dashed border-slate-500'>
                <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>CẬP NHẬT BÁO CÁO</h2>
                <p className='pb-4 flex justify-between'><span>{branchName}</span></p>
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
                <div className='pt-8 pb-2 flex justify-end gap-x-2'>
                    <button onClick={() => { closeModal() }} className='px-6 py-2 rounded-md border-[2px] border-solid border-red-500 text-red-500 text-lg hover:opacity-80 transition-all'>Đóng</button>
                    <button onClick={handleUpdateReport} className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateReportModal