// TO VAN HUONG - PAUL TO - VIET NAM
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavigationBar, SideBarOfAdmin, ReportModal, ModifyStockDataInADay, UpdateRemainStock, UpdateReportModal } from '../helpers';
import * as XLSX from 'xlsx';
import { FaEdit, FaEye, FaPenAlt, FaTrash } from "react-icons/fa";
import { FaPenToSquare } from 'react-icons/fa6';

import { collection, DocumentData, getDocs, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

import LoadingContext from '../contexts/LoadingContext';
import NotificationContext from '../contexts/NotificationContext';
import { IoMdRefresh } from 'react-icons/io';

type Branch = {
    createdAt: Timestamp | string;
    branchImage: string;
    branchImagePublicId: string;
    name: string;
    password: string;
    branchId: string;
    id: string;
};

const StockDetails = () => {
    const { branchId } = useParams<{ branchId: string }>(); // Get branchId from URL params that passed from the previos page 
    const [refresh, setRefresh] = useState(false); // State to control refresh button to re-fetch branches from Firestore
    const [dayToUpdateReport, setDayToUpdateReport] = useState(0); // State to control day to update report and view report on tab 02 
    const [selectedBranch, setSelectedBranch] = useState(branchId || ''); // State to control selected branch to display accordingly datas
    const [nameOfBranch, setNameOfBranch] = useState('');  // State to control name of branch to display page title, modal title, etc 
    const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`); // This state is used to update stock data, delete stock data, add stock data, etc
    const [branches, setBranches] = useState<DocumentData[]>([]); // State to store all branches that fetched from Firestore
    const [showUpdateRemainStockModal, setShowUpdateRemainStockModal] = useState(false); // State to control modal for updating stock
    const [showUpdateReportModal, setShowUpdateReportModal] = useState(false); // State to control modal for updating report
    const [modifyStockDataInADay, setModifyStockDataInADay] = useState({ // State to control modal for modifying stock data in a day 
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
    });
    const [noCupsLeftInTheStore, setNoCupsLeftInTheStore] = useState({ '500ml': 0, '700ml': 0, '800ml': 0 }); // State to store the number of cups left in the store 
    // allStockDataInAMonth is an array of tuples. Each tuple contains a string and an object. The string is the day of the month and the object is the stock data of that day
    const [allStockDataInAMonth, setAllStockDataInAMonth] = useState<[string, { noCupsLeftInTheStore: { '500ml': number; '700ml': number; '800ml': number }; deliveryMore: { '500ml': number; '700ml': number; '800ml': number }; totalNoCupsPerDay: { '500ml': number; '700ml': number; '800ml': number }; totalCupsSole: { '500ml': number; '700ml': number; '800ml': number }; breakGlass: { '500ml': number; '700ml': number; '800ml': number } }][]>([]);
    // allStock02DataInAMonth is an array of tuples. Each tuple contains a string and an object. The string is the day of the month and the object is the stock data of that day
    const [allStock02DataInAMonth, setAllStock02DataInAMonth] = useState<[string, {
        glassesOnApp: { 'glass800': number; 'lGlass': number; 'mGlass': number }, glassesOnForceMachine: number, initialMoney: string, moneyUsed: string, note: string, remainRevenue: string, revenueOnApp: string, total: string
    }][]>([]);
    const [tab, setTab] = useState(0); // State to control tab to display stock data or report data 
    const [reFetchStockData, setReFetchStockData] = useState(false); // State to control re-fetch stock data when update, delete, add stock data
    const [toViewReportModal, setToViewReportModal] = useState({ show: false, index: 0 }); // State to control modal for viewing report

    const { open, close } = useContext(LoadingContext); // context to control loading spinner
    const { setTypeAndMessage } = useContext(NotificationContext); // context to control notification message 

    // Function to handle show according datas when user choose branch or date 
    const handleChosingBranchAndDate = async () => {
        open();
        const month = selectedDate.slice(-2);
        const year = selectedDate.slice(0, 4);
        const documentId = `${selectedBranch}${year}${month}`; // Create document id to access stock data in Firestore depend on selected branch and selected date
        const docRef = doc(db, 'stocks', documentId); // Create document reference to access stock data in Firestore
        try {
            const docSnap = await getDoc(docRef); // Get stock data in a month from Firestore 
            if (docSnap.exists()) { // If stock data exists in Firestore 
                const data = docSnap.data();
                const allData = Object.entries(data); // Convert object to array of tuples 
                setAllStockDataInAMonth(allData); // Set all stock data in a month to state 
                const lastDay = allData.length;
                const lastDayData = allData[lastDay - 1][1];
                setNoCupsLeftInTheStore(lastDayData.noCupsLeftInTheStore); // Set the number of cups left in the store to state 
                close(); // Close loading spinner
                fetchStock02Data(`${selectedBranch}${selectedDate.slice(0, 4)}${selectedDate.slice(-2)}02`); // Fetch stock02 data in a month from Firestore
            } else {
                setAllStockDataInAMonth([]);
                setAllStock02DataInAMonth([]);
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

    // Function to fetch stock data (TAB 01) in a month from Firestore
    const fetchStockData = async () => {
        const currentYear = selectedDate.slice(0, 4);
        const currentMonth = selectedDate.slice(-2);
        const documentId = `${selectedBranch}${currentYear}${currentMonth}`; // Create document id to access stock data in Firestore depend on selected branch and selected date

        const docRef = doc(db, 'stocks', documentId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const allData = Object.entries(data);
                setAllStockDataInAMonth(allData); // Set all stock data in a month to allStockDataInAMonth state

                const lastDay = allData.length;
                const lastDayData = allData[lastDay - 1][1];
                setNoCupsLeftInTheStore(lastDayData.noCupsLeftInTheStore); // Set the number of cups left of the last day in the store to noCupsLeftInTheStore state
            }
        } catch (error) {
            console.error("Error getting documents: ", error);
            setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
        }

    }

    // Function to fetch stock02 data (TAB 02) in a month from Firestore
    const fetchStock02Data = async (documentId: string) => {
        const docRef = doc(db, 'stocks02', documentId); // Create document reference to access stock02 data in Firestore 
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const allData = Object.entries(data); // Convert object to array of tuples 
            setAllStock02DataInAMonth(allData); // Set all stock 02 data in a month to allStock02DataInAMonth state
        } else {
            console.log("No such document!");
        }
    }

    // Function to delete stock data in one day 
    const handleDeleteStockDataInOneDay = async (day: string) => {  // Function to delete stock data in one day 
        /*
        Summary idea: 
        - Delete stock data in selected day 
        - Update stock data in the day after the selected day if it exists (use a number of cups left in the store of the day before the selected day to calculate for the day after the selected day)
        - Delete stock02 data in selected day. Stock02 data is used to tab 02 which contains datas about revenue, initial money, money used, etc 
        
        Detail bewlow:
         */

        const month = selectedDate.slice(-2); // Get the month from selected date 
        const year = selectedDate.slice(0, 4); // Get the year from selected date
        const deleteReportDataInSomeDay = async () => { // Functio to delete stock02 data in selected day 
            const documentIdToDeleteStock02Data = `${selectedBranch}${year}${month}02`; // Create document id to access stock02 data in Firestore depend on selected branch and selected date
            const newStock02Data = allStock02DataInAMonth.filter((data) => data[0] !== day); // Filter stock02 data in a month to delete stock02 data in selected day 
            const docRefToDeleteStock02Data = doc(db, 'stocks02', documentIdToDeleteStock02Data);
            if (newStock02Data.length > 0) { // If stock 02 data in a month is not empty. It means that there is other datas in the month, so we just need to delete stock02 data in selected day
                await setDoc(docRefToDeleteStock02Data, Object.fromEntries(newStock02Data));
            } else { // If stock 02 data in a month is empty. It means that there is no other datas in the month, so we need to delete the whole document
                await deleteDoc(docRefToDeleteStock02Data);
            }
        }
        try {
            let soLyConLaiTrongNgay: { [key: string]: number } = {}; // Number of cups left in the store of the day before the selected day. This data is used to calculate for the day after the selected day
            // obj1 is an object that contains stock data in the day after the selected day. This data is used to calculate for the day after the selected day 
            let obj1 = Object.fromEntries(allStockDataInAMonth);

            // obj2 is an object that contains stock data in the day before the selected day. This data is used to calculate for the day after the selected day
            let obj2 = Object.fromEntries(allStockDataInAMonth);

            // yearToAccessData and monthToAccessData are used to access stock data in the day before the selected day 
            // For example: If the selected day is 2024-11-01, we need to access stock data in 2024-10-31 or previous to calculate for the day after the selected day. 
            let yearToAccessData = selectedDate.slice(0, 4);
            let monthToAccessData = selectedDate.slice(-2);
            let ngayTruocNgayBiXoa = (parseInt(day) - 1).toString();  // The day before the day to be deleted


            // yearToUpdate and monthToUpdate are used to update stock data in the day after the selected day
            // For example: If the selected day is 2024-11-01, we need to update stock data in 2024-12-02 or next day 
            let yearToUpdate = selectedDate.slice(0, 4);
            let monthToUpdate = selectedDate.slice(-2);
            let ngaySauNgayBiXoa = (parseInt(day) + 1).toString(); // The day after the day to be deleted 

            let flagToTerminateLoop = 0; // Flag to terminate the loop. I use this flag to only find the data of two months before for updating.  

            // If the day before the selected day is not in the stock data, we need to find the day before the day before the selected day again. 
            while (obj2[`${ngayTruocNgayBiXoa}`] === undefined && flagToTerminateLoop < 2) {
                if (parseInt(ngayTruocNgayBiXoa) > 0) { // if ngayTruocNgayBiXoa > 0, we just need to reduce 1 day to find the day before the selected day 
                    ngayTruocNgayBiXoa = (parseInt(ngayTruocNgayBiXoa) - 1).toString();
                }
                if (parseInt(ngayTruocNgayBiXoa) < 1 && monthToAccessData !== '01') { // if ngayTruocNgayBiXoa < 1 and monthToAccessData !== '01', we need to decrease 1 month and set ngayTruocNgayBiXoa to 31 to find the day before the selected day that has data
                    monthToAccessData = String(parseInt(monthToAccessData) - 1).padStart(2, '0'); // decrease 1 month 
                    const newDocumentId = `${selectedBranch}${yearToAccessData}${monthToAccessData}`; // Create document id to access stock data in Firestore based on month that have just decreased

                    const newDocRef = doc(db, 'stocks', newDocumentId);
                    const newDocSnap = await getDoc(newDocRef);
                    if (newDocSnap.exists()) {
                        obj2 = newDocSnap.data();
                        flagToTerminateLoop += 1; // Increase 1 when we decrease 1 month
                        ngayTruocNgayBiXoa = "31"; // Set ngayTruocNgayBiXoa to 31 to find the day before the selected day that has data 
                    } else if (!newDocSnap.exists()) {
                        flagToTerminateLoop += 1;
                        ngayTruocNgayBiXoa = "0";
                    }
                }
                else if (parseInt(ngayTruocNgayBiXoa) < 1 && monthToAccessData === '01') { // if ngayTruocNgayBiXoa < 1 and monthToAccessData === '01', we need to decrease 1 year and set monthToAccessData to 12 to find the day before the selected day that has data

                    yearToAccessData = (parseInt(yearToAccessData) - 1).toString(); // decrease 1 year
                    monthToAccessData = "12"; // set monthToAccessData to 12
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

            let flagToTerminateLoop2 = 0; // Flag to only allow to find the data of two months after for updating.
            while (obj1[`${ngaySauNgayBiXoa}`] === undefined && flagToTerminateLoop2 < 2) {
                ngaySauNgayBiXoa = (parseInt(ngaySauNgayBiXoa) + 1).toString(); // Increase 1 day to find the day after the selected day 
                if (parseInt(ngaySauNgayBiXoa) > 31 && monthToUpdate !== '12') { // if ngaySauNgayBiXoa > 31 and monthToUpdate !== '12', we need to increase 1 month and set ngaySauNgayBiXoa to 1 to find the day after the selected day that has data
                    monthToUpdate = String(parseInt(monthToUpdate) + 1).padStart(2, '0');
                    const newDocumentId = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
                    const newDocRef = doc(db, 'stocks', newDocumentId);
                    const newDocSnap = await getDoc(newDocRef);
                    if (newDocSnap.exists()) {
                        obj1 = newDocSnap.data();
                        flagToTerminateLoop2 += 1; // Increase 1 when we increase 1 month 
                        ngaySauNgayBiXoa = "1";
                    } else if (!newDocSnap.exists()) {
                        flagToTerminateLoop2 += 1;
                    }

                } else if (parseInt(ngaySauNgayBiXoa) > 31 && monthToUpdate === '12') { // if ngaySauNgayBiXoa > 31 and monthToUpdate === '12', we need to increase 1 year and set monthToUpdate to 01 to find the day after the selected day that has data
                    yearToUpdate = (parseInt(yearToUpdate) + 1).toString(); // increase 1 year
                    monthToUpdate = "01"; // set monthToUpdate to 01
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

            // TO VAN HUONG - PAUL TO - VIET NAM

            if (obj2[`${ngayTruocNgayBiXoa}`] !== undefined && obj1[`${ngaySauNgayBiXoa}`] !== undefined) { // If the day before the selected day and the day after the selected day have data. We procce to update
                soLyConLaiTrongNgay = obj2[`${ngayTruocNgayBiXoa}`].noCupsLeftInTheStore; // Number of cups left in the store of the day before the selected day. This data is used to calculate for the day after the selected day
                const tongCoTrongNgay = {
                    '500ml': soLyConLaiTrongNgay['500ml'] + obj1[`${ngaySauNgayBiXoa}`].deliveryMore['500ml']
                    , '700ml': soLyConLaiTrongNgay['700ml'] + obj1[`${ngaySauNgayBiXoa}`].deliveryMore['700ml']
                    , '800ml': soLyConLaiTrongNgay['800ml'] + obj1[`${ngaySauNgayBiXoa}`].deliveryMore['800ml']
                }; // NEW total cups in the day after the selected day
                const tongBanDuoc = {
                    '500ml': tongCoTrongNgay['500ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['500ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['500ml']
                    , '700ml': tongCoTrongNgay['700ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['700ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['700ml']
                    , '800ml': tongCoTrongNgay['800ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['800ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['800ml']
                }; // NEW total cups sold in the day after the selected day 

                const newStockData = { // New stock data for the day after
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
                    if (yearToUpdate === year && monthToUpdate === month) { // if the day that we want to delete and the day that we want to update are in the same month and year, we just need to filter the day that we want to delete and update the day that we want to update
                        const newAllStockDataInAMonth = Object.entries(newStockData).filter((data) => data[0] !== day);
                        await setDoc(docRefToUpdate, Object.fromEntries(newAllStockDataInAMonth));
                    } else { // if the day that we want to delete and the day that we want to update are not in the same month and year, we need to delete the day that we want to delete before and update the day that we want to update after. 
                        const documentContainsElementIsDeleted = `${selectedBranch}${year}${month}`;
                        const docRefToDelete = doc(db, 'stocks', documentContainsElementIsDeleted);
                        const newAllStockDataInAMonth = allStockDataInAMonth.filter((data) => data[0] !== day);
                        await setDoc(docRefToDelete, Object.fromEntries(newAllStockDataInAMonth));
                        await setDoc(docRefToUpdate, newStockData);

                    }
                    deleteReportDataInSomeDay();
                } catch (error) {
                    console.error("Error getting documents: ", error);
                    setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
                }

            } else if (obj2[`${ngayTruocNgayBiXoa}`] === undefined && obj1[`${ngaySauNgayBiXoa}`] !== undefined) { // If the day before the selected day does not have data and the day after the selected day has data. We just need to delete the day that we want to delete and update the day after the selected day
                const tongCoTrongNgay = {
                    '500ml': obj1[`${ngaySauNgayBiXoa}`].deliveryMore['500ml']
                    , '700ml': obj1[`${ngaySauNgayBiXoa}`].deliveryMore['700ml']
                    , '800ml': obj1[`${ngaySauNgayBiXoa}`].deliveryMore['800ml']
                }; // NEW total cups in the day after the selected day

                const tongBanDuoc = {
                    '500ml': tongCoTrongNgay['500ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['500ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['500ml']
                    , '700ml': tongCoTrongNgay['700ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['700ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['700ml']
                    , '800ml': tongCoTrongNgay['800ml'] - obj1[`${ngaySauNgayBiXoa}`].noCupsLeftInTheStore['800ml'] - obj1[`${ngaySauNgayBiXoa}`].breakGlass['800ml']
                }; // NEW total cups sold in the day after the selected day
                const newStockData = { // New stock data for the day after
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
                    if (yearToUpdate === year && monthToUpdate === month) { // if the day that we want to delete and the day that we want to update are in the same month and year, we just need to filter the day that we want to delete and update the day that we want to update
                        const newAllStockDataInAMonth = Object.entries(newStockData).filter((data) => data[0] !== day);
                        await setDoc(docRefToUpdate, Object.fromEntries(newAllStockDataInAMonth));
                    } else { // if the day that we want to delete and the day that we want to update are not in the same month and year, we need to delete the day that we want to delete before and update the day that we want to update after.
                        const documentContainsElementIsDeleted = `${selectedBranch}${year}${month}`;
                        const docRefToDelete = doc(db, 'stocks', documentContainsElementIsDeleted);
                        const newAllStockDataInAMonth = allStockDataInAMonth.filter((data) => data[0] !== day);
                        await setDoc(docRefToDelete, Object.fromEntries(newAllStockDataInAMonth));
                        await setDoc(docRefToUpdate, newStockData);

                    }
                    deleteReportDataInSomeDay(); // Delete stock02 data in selected day 
                } catch (error) {
                    console.error("Error getting documents: ", error);
                    setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
                }
            } else { // If the day before the selected day and the day after the selected day do not have data. We just need to delete the day that we want to delete
                if (monthToUpdate !== month && yearToUpdate !== year) { // if the day that we want to delete and the day that we want to update are not in the same month and year, we only to delete the day that we want to delete 
                    const documentToDeleteStockData = `${selectedBranch}${year}${month}`;
                    const docRefToDeleteStockData = doc(db, 'stocks', documentToDeleteStockData);
                    const newAllStockDataInAMonth = allStockDataInAMonth.filter((data) => data[0] !== day);
                    await setDoc(docRefToDeleteStockData, Object.fromEntries(newAllStockDataInAMonth));
                    deleteReportDataInSomeDay(); // Delete stock02 data in selected day
                }
            }
            setReFetchStockData(!reFetchStockData); // Re-fetch stock data in a month from Firestore to display updated data on screen
            setTypeAndMessage('success', 'Xóa dữ liệu thành công!'); // Display success message 
        } catch (error) {
            setReFetchStockData(!reFetchStockData); // Re-fetch stock data in a month from Firestore to display updated data on screen
            console.error("Error getting documents: ", error); // Display error message 
            setTypeAndMessage('error', 'Kết nối mạng không ổn định. Hãy kiểm tra lại kết nối của bạn và thử lại sau!');
        }
    }

    // Function to export data in a month to excel file
    const exportToExcel = () => {
        // Convert data to the format that XLSX can understand 
        const data = allStockDataInAMonth.map((data: [string, { noCupsLeftInTheStore: { '500ml': number; '700ml': number; '800ml': number }; deliveryMore: { '500ml': number; '700ml': number; '800ml': number }; totalNoCupsPerDay: { '500ml': number; '700ml': number; '800ml': number }; totalCupsSole: { '500ml': number; '700ml': number; '800ml': number }; breakGlass: { '500ml': number; '700ml': number; '800ml': number } }]) => {
            return {
                'Ngày': data[0],
                'Ly tồn quầy 500ml': data[1].noCupsLeftInTheStore['500ml'],
                'Ly tồn quầy 700ml': data[1].noCupsLeftInTheStore['700ml'],
                'Ly tồn quầy 800ml': data[1].noCupsLeftInTheStore['800ml'],
                'Giao thêm 500ml': data[1].deliveryMore['500ml'],
                'Giao thêm 700ml': data[1].deliveryMore['700ml'],
                'Giao thêm 800ml': data[1].deliveryMore['800ml'],
                'Tổng có trong ngày 500ml': data[1].totalNoCupsPerDay['500ml'],
                'Tổng có trong ngày 700ml': data[1].totalNoCupsPerDay['700ml'],
                'Tổng có trong ngày 800ml': data[1].totalNoCupsPerDay['800ml'],
                'Ly ép hư 500ml': data[1].breakGlass['500ml'],
                'Ly ép hư 700ml': data[1].breakGlass['700ml'],
                'Ly ép hư 800ml': data[1].breakGlass['800ml'],
                'Tổng bán được 500ml': data[1].totalCupsSole['500ml'],
                'Tổng bán được 700ml': data[1].totalCupsSole['700ml'],
                'Tổng bán được 800ml': data[1].totalCupsSole['800ml']
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data); // Convert data to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook 
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data"); // Append worksheet to workbook 

        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10); // Format: YYYY-MM-DD
        const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // Format: HH-MM-SS
        const filename = `StockData_${formattedDate}_${formattedTime}.xlsx`; // Filename of the exported file 

        XLSX.writeFile(workbook, filename); // Write file to download 
    };

    const getTime = (createdAt: Timestamp | string | Date): number => { // Get time from createdAt field in branch object to sort branches
        if (createdAt instanceof Timestamp) {
            return createdAt.toMillis();
        } else if (typeof createdAt === 'string') {
            return new Date(createdAt).getTime();
        } else if (createdAt instanceof Date) {
            return createdAt.getTime();
        }
        return 0;
    };

    const sortBranchesByTimeAscending = (branches: Branch[]) => {
        branches.sort((a, b) => getTime(a.createdAt) - getTime(b.createdAt)); // Ascending order
        setBranches([...branches]); // Update state with sorted branches
    };


    useEffect(() => {
        const getAllBranches = async () => {
            open(); // Open loading
            try {
                const querySnapshot = await getDocs(collection(db, 'branches')); // Get all branches from Firestore
                const branches = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return { ...data, id: doc.id, createdAt: data.createdAt };
                }) as Branch[]; // Map data from Firestore to branches array

                // Sort branches by createdAt timestamp in descending order by default
                sortBranchesByTimeAscending(branches);

                setBranches(branches);
                close(); // Close loading
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu chi nhánh:", error);
                setTypeAndMessage('fail', 'Lỗi khi lấy dữ liệu chi nhánh, vui lòng thử lại!');
                close(); // Close loading
            }
        };
        fetchStockData(); // Fetch stock data in a month from Firestore for TAB 01
        fetchStock02Data(`${selectedBranch}${selectedDate.slice(0, 4)}${selectedDate.slice(-2)}02`); // Fetch stock02 data in a month from Firestore for TAB 02
        getAllBranches(); // Get all branches from Firestore
    }, [reFetchStockData, refresh]);

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
        }); // Set name of branch to display page title, modal title, etc 
    }, [selectedBranch, branchId, branches, refresh]);

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
                    <div className='w-full h-fit flex justify-end mt-12 gap-x-2'>
                        <button className='px-4 py-2 bg-yellow-400 rounded-md flex items-center gap-x-2 ' onClick={() => setRefresh(!refresh)}>Làm mới <IoMdRefresh /></button>
                        <button onClick={() => { setShowUpdateRemainStockModal(true) }} className='border-[3px] border-solid border-white flex justify-center items-center px-3 sm:px-5 sm:py-4 sm:text-lg bg-blue-500 text-white py-2 gap-x-2 font-bold rounded-md hover:shadow-lg transition-all cursor-pointer uppercase'><span><FaPenAlt /></span>Cập nhật tồn kho</button>
                    </div>
                    <div className='pt-5 mt-5 pb-10'>
                        <div className='flex items-center gap-x-4'>
                            <button onClick={() => setTab(0)} className={`py-2 px-6 font-bold ${tab === 0 ? 'bg-white' : 'bg-white opacity-80'} border-[4px]  cursor-pointer border-solid border-[#54C392]`}>TAB 01</button>
                            <button onClick={() => setTab(1)} className={`py-2 px-6 font-bold ${tab === 1 ? 'bg-white' : 'bg-white opacity-80'} border-[4px] cursor-pointer border-solid border-[#54C392]`}>TAB 02</button>
                        </div>
                        {tab === 0 && <div className='overflow-x-auto mt-5'>
                            <div className='flex items-center justify-end gap-x-4 py-4 px-2 text-white italic'>
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
                                                <td className='border px-4 py-2 bg-red-200'>{data[1].totalCupsSole['500ml']}</td>
                                                <td className='border px-4 py-2 bg-red-200'>{data[1].totalCupsSole['700ml']}</td>
                                                <td className='border px-4 py-2 bg-red-200'>{data[1].totalCupsSole['800ml']}</td>

                                                <td className='px-4 py-4 flex justify-around border'>
                                                    <button onClick={() => { setModifyStockDataInADay({ ...modifyStockDataInADay, showModal: true, currentData: data[1], dayToModify: data[0], monthToModify: selectedDate.slice(-2), yearToModify: selectedDate.slice(0, 4) }) }} className='text-blue-500 hover:text-blue-700'><FaEdit /></button>
                                                    <button onClick={() => handleDeleteStockDataInOneDay(data[0])} className='text-red-500 hover:text-red-700'><FaTrash /></button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr className='bg-slate-100 text-center'><td colSpan={24} rowSpan={4} className='text-center py-5'>Chưa có dữ liệu kho</td></tr>}
                                </tbody>
                            </table>
                            <div className={`flex justify-start mt-5 ${allStockDataInAMonth.length > 0 ? 'visible' : 'invisible'}`}>
                                <button onClick={exportToExcel} className='border-[3px] border-solid border-slate-800 px-6 py-3 rounded-lg outline-none bg-[#FFEC59] font-bold hover:shadow-xl cursor-pointer transition-all'>XUẤT DỮ LIỆU THÁNG</button> </div>
                        </div>}
                        {tab === 1 && <div className='overflow-x-auto mt-10'>
                            <div className='flex items-center justify-end  gap-x-4 py-4 px-2 text-white italic'>
                                <div className='flex gap-x-2 items-center '><span className="text-blue-500"><FaEye /> </span><span>Nút xem báo cáo</span></div>
                                <div className='flex gap-x-2 items-center '><span className="text-[#dfca2b] hover:text-[#FFEC59]"><FaPenToSquare /> </span><span>Nút cập nhật báo cáo</span></div>
                            </div>
                            <table className='min-w-full bg-white'>
                                <thead className='bg-[rgb(8,110,89)] text-white drop-shadow-lg'>
                                    <tr>
                                        <th rowSpan={3} className='border px-4 py-2'>Ngày</th>
                                        <th colSpan={4} className='border px-4 py-2 uppercase'>Báo cáo app</th>
                                        <th colSpan={6} className='border px-4 py-2 uppercase'>Doanh thu thực tế</th>
                                        <th rowSpan={3} className='border px-4 py-2'>Báo cáo</th>
                                        <th rowSpan={3} className='border px-4 py-2'>Cập nhật</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={3} className='border px-4 py-2'>Số ly</th>
                                        <th rowSpan={2} className='border px-4 py-2'>Số tiền trên app</th>
                                        <th rowSpan={2} className='border px-4 py-2'>Số ly trên máy ép</th>

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

                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {allStock02DataInAMonth.length > 0 ? allStock02DataInAMonth.map((data, index) => {
                                        return (
                                            <tr key={index} className='bg-slate-100'>
                                                <td className='border px-4 py-2 bg-slate-300'>{data[0]}</td>
                                                <td className='border px-4 py-2'>{data[1].glassesOnApp !== undefined ? data[1].glassesOnApp.mGlass : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].glassesOnApp !== undefined ? data[1].glassesOnApp.lGlass : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].glassesOnApp !== undefined ? data[1].glassesOnApp.glass800 : 0}</td>
                                                <td className='border px-4 py-2 bg-yellow-500'>{data[1].revenueOnApp !== undefined ? data[1].revenueOnApp : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].glassesOnForceMachine !== undefined ? data[1].glassesOnForceMachine : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].total !== undefined ? data[1].total : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].moneyUsed != undefined ? data[1].moneyUsed : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].initialMoney != undefined ? data[1].initialMoney : 0}</td>
                                                <td className='border px-4 py-2 bg-green-700 text-white'>{data[1].remainRevenue != undefined ? data[1].remainRevenue : 0}</td>
                                                <td className='border px-4 py-2'>{data[1].note !== undefined ? data[1].note : 0}</td>
                                                <td className='px-4 py-4 border'>
                                                    <button disabled={data[1].note === undefined ? true : false} onClick={() => { setToViewReportModal({ show: true, index: index }); setDayToUpdateReport(parseInt(data[0])) }} className={`text-blue-500 hover:text-blue-700 disabled:opacity-50`}><FaEye /></button>

                                                </td>
                                                <td className='px-4 py-4 border'>
                                                    <button onClick={() => { setShowUpdateReportModal(true); setDayToUpdateReport(parseInt(data[0])) }} className='text-[#dfca2b] hover:text-[#FFEC59]'><FaPenToSquare /></button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr className='bg-slate-100 text-center'><td colSpan={24} rowSpan={4} className='text-center py-5'>Chưa có dữ liệu báo cáo</td></tr>}
                                </tbody>
                            </table>
                        </div>}

                    </div>
                </div>
                {showUpdateRemainStockModal && <UpdateRemainStock closeModal={() => setShowUpdateRemainStockModal(false)} yearAndMonthToUpdate={selectedDate} selectedBranch={selectedBranch} reFetch={() => { setReFetchStockData(!reFetchStockData) }} />}
                {toViewReportModal.show && <ReportModal closeModal={() => { setToViewReportModal({ ...toViewReportModal, show: false }) }} branchName={nameOfBranch} day={dayToUpdateReport} monthAndYear={selectedDate} appData={allStock02DataInAMonth[toViewReportModal.index][1]} realityData={allStockDataInAMonth[toViewReportModal.index][1]} />}
                {showUpdateReportModal && <UpdateReportModal reFetch={() => { setReFetchStockData(!reFetchStockData) }} closeModal={() => setShowUpdateReportModal(false)} branchName={nameOfBranch} dayToUpdateReport={dayToUpdateReport} branchId={selectedBranch} selectedDate={selectedDate} />}
                {modifyStockDataInADay.showModal && <ModifyStockDataInADay reFetch={() => { setReFetchStockData(!reFetchStockData) }} branchId={selectedBranch} currentData={modifyStockDataInADay.currentData} dayToModify={modifyStockDataInADay.dayToModify} monthToModify={modifyStockDataInADay.monthToModify} yearToModify={modifyStockDataInADay.yearToModify} closeModal={() => setModifyStockDataInADay({ ...modifyStockDataInADay, showModal: false })} />}
            </div>
        </div>
    );
};

export default StockDetails;

// TO VAN HUONG - PAUL TO - VIET NAM
