import { useContext, useEffect, useState } from 'react';
import { NavigationBar, SideBarOfAdmin } from '../helpers';
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
import NotificationContext from '../contexts/NotificationContext';
import LoadingContext from '../contexts/LoadingContext';
import { IoMdRefresh } from 'react-icons/io';

interface Approval {
    branchId: string;
    staffName: string;
    branchName: string;
    selectedDay: string;
    selectedDate: string;
    noGlassInDay: {
        cups500ml: number;
        cups700ml: number;
        cups800ml: number;
    };
    deliveryMore: {
        cups500ml: number;
        cups700ml: number;
        cups800ml: number;
    };
    breakGlass: {
        cups500ml: number;
        cups700ml: number;
        cups800ml: number;
    };
    id: string;
}

const ApprovePage = () => {
    const [refresh, setRefresh] = useState(false); // State for refreshing the page
    const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
    const { setTypeAndMessage } = useContext(NotificationContext);
    const { open, close } = useContext(LoadingContext);
    const handleApprove = async (data: Approval, index: number) => {
        const { branchId, selectedDay, selectedDate, noGlassInDay, deliveryMore, breakGlass, id } = data; // Destructure the data object
        open();
        try {
            const year = selectedDate.slice(0, 4);
            const month = selectedDate.slice(-2);
            const documentId = `${branchId}${year}${month}`;

            const docRef = doc(db, 'stocks', documentId);
            const whetherStockExists = await getDoc(docRef);

            let data;

            if (whetherStockExists.exists()) {
                data = whetherStockExists.data();
                if (data[selectedDay] !== undefined) {
                    setTypeAndMessage('fail', 'Thông tin kho vào ngày này đã tồn tại, Hãy sửa nó nhé!');
                    close();
                    return; // Stop the function
                }
            }

            const noCupsLeftInTheStore = { '500ml': 0, '700ml': 0, '800ml': 0 };

            let flagToStopLoop = 0;
            let monthToAccessData = month; // Default month to access data is the selected month
            let yearToAccessData = parseInt(year); // Default year to access data is the selected 
            let previousDay = parseInt(selectedDay); // Default previous day to access data is the selected day

            while (noCupsLeftInTheStore['500ml'] === 0 && noCupsLeftInTheStore['700ml'] === 0 && noCupsLeftInTheStore['800ml'] === 0 && flagToStopLoop < 2) {
                if (month !== '01' && (selectedDay === '1' || previousDay < 1)) {
                    monthToAccessData = String(parseInt(monthToAccessData) - 1).padStart(2, '0');
                    const documentIdOfPreviousMonth = `${branchId}${year}${monthToAccessData}`;
                    const docRefOfPreviousMonth = doc(db, 'stocks', documentIdOfPreviousMonth);

                    const docSnapOfPreviousMonth = await getDoc(docRefOfPreviousMonth);
                    if (docSnapOfPreviousMonth.exists()) {
                        const data = Object.entries(docSnapOfPreviousMonth.data());
                        const previousMonthLastDay = Object.keys(data).length;

                        const previousMonthLastDayData = data[previousMonthLastDay - 1];

                        noCupsLeftInTheStore['500ml'] = previousMonthLastDayData[1].noCupsLeftInTheStore['500ml'];
                        noCupsLeftInTheStore['700ml'] = previousMonthLastDayData[1].noCupsLeftInTheStore['700ml'];
                        noCupsLeftInTheStore['800ml'] = previousMonthLastDayData[1].noCupsLeftInTheStore['800ml'];

                    } else {
                        flagToStopLoop += 1;
                    }
                } else if (month === '01' && (selectedDay === '1' || previousDay < 1)) {
                    yearToAccessData = yearToAccessData - 1;
                    monthToAccessData = '12';
                    const documentIdOfPreviousMonth = `${branchId}${yearToAccessData.toString()}${monthToAccessData}`;
                    const docRefOfPreviousMonth = doc(db, 'stocks', documentIdOfPreviousMonth);

                    const docSnapOfPreviousMonth = await getDoc(docRefOfPreviousMonth);
                    if (docSnapOfPreviousMonth.exists()) {
                        const data = Object.entries(docSnapOfPreviousMonth.data());
                        const previousMonthLastDay = Object.keys(data).length;

                        const previousMonthLastDayData = data[previousMonthLastDay - 1];

                        noCupsLeftInTheStore['500ml'] = previousMonthLastDayData[1].noCupsLeftInTheStore['500ml'];
                        noCupsLeftInTheStore['700ml'] = previousMonthLastDayData[1].noCupsLeftInTheStore['700ml'];
                        noCupsLeftInTheStore['800ml'] = previousMonthLastDayData[1].noCupsLeftInTheStore['800ml'];
                    } else {
                        flagToStopLoop += 1;
                    }
                } else {
                    previousDay = previousDay - 1;
                    if (data && data[`${previousDay}`] !== undefined) {
                        const previousDayData = data[`${previousDay}`];
                        noCupsLeftInTheStore['500ml'] = previousDayData.noCupsLeftInTheStore['500ml'];
                        noCupsLeftInTheStore['700ml'] = previousDayData.noCupsLeftInTheStore['700ml'];
                        noCupsLeftInTheStore['800ml'] = previousDayData.noCupsLeftInTheStore['800ml'];
                    }
                }
            }

            const totalNoCupsPerDayType500ml = noCupsLeftInTheStore['500ml'] + deliveryMore.cups500ml;
            const totalNoCupsPerDayType700ml = noCupsLeftInTheStore['700ml'] + deliveryMore.cups700ml;
            const totalNoCupsPerDayType800ml = noCupsLeftInTheStore['800ml'] + deliveryMore.cups800ml;


            const totalNoCupsPerDay = { '500ml': totalNoCupsPerDayType500ml, '700ml': totalNoCupsPerDayType700ml, '800ml': totalNoCupsPerDayType800ml };

            const totalCupsSole = { '500ml': 0, '700ml': 0, '800ml': 0 };

            totalCupsSole['500ml'] = totalNoCupsPerDayType500ml - noGlassInDay.cups500ml - breakGlass.cups500ml;
            totalCupsSole['700ml'] = totalNoCupsPerDayType700ml - noGlassInDay.cups700ml - breakGlass.cups700ml;
            totalCupsSole['800ml'] = totalNoCupsPerDayType800ml - noGlassInDay.cups800ml - breakGlass.cups800ml;


            const newEntry = {
                'noCupsLeftInTheStore': {
                    '500ml': noGlassInDay.cups500ml,
                    '700ml': noGlassInDay.cups700ml,
                    '800ml': noGlassInDay.cups800ml
                },
                'deliveryMore': {
                    '500ml': deliveryMore.cups500ml,
                    '700ml': deliveryMore.cups700ml,
                    '800ml': deliveryMore.cups800ml
                },
                'totalNoCupsPerDay': {
                    '500ml': totalNoCupsPerDay['500ml'],
                    '700ml': totalNoCupsPerDay['700ml'],
                    '800ml': totalNoCupsPerDay['800ml']
                },
                'totalCupsSole': {
                    '500ml': totalCupsSole['500ml'],
                    '700ml': totalCupsSole['700ml'],
                    '800ml': totalCupsSole['800ml']
                },
                'breakGlass': {
                    '500ml': breakGlass.cups500ml,
                    '700ml': breakGlass.cups700ml,
                    '800ml': breakGlass.cups800ml
                }
            };

            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // Document exists, update the array field
                await updateDoc(docRef, {
                    [selectedDay]: newEntry
                });
            } else {
                // Document does not exist, create a new document with the array field
                await setDoc(docRef, {
                    [selectedDay]: newEntry
                });
            }

            const newDocumentId = `${branchId}${year}${month}02`;
            const newDocRef = doc(db, 'stocks02', newDocumentId);
            const newDocSnap = await getDoc(newDocRef);
            if (newDocSnap.exists()) {
                await updateDoc(newDocRef, {
                    [selectedDay]: {}
                });
            } else {
                await setDoc(newDocRef, {
                    [selectedDay]: {}
                });
            }

            handleUpdateAfterDay(month, year, branchId, selectedDay, noGlassInDay);
            const newPendingApprovals = pendingApprovals.filter((_, i) => i !== index);
            setPendingApprovals(newPendingApprovals);
            await deleteDoc(doc(db, 'pendings', id));

            close();
            setTypeAndMessage('success', `Cập nhật tồn kho cho ngày ${String(selectedDay).padStart(2, '0')} thành công!`);

        } catch (error) {
            console.log(error);
            close();
            setTypeAndMessage('fail', 'Lỗi khi cập nhật tồn kho do kết nối mạng không ổn định! Hãy thử lại sau!');
        }
    }

    const handleUpdateAfterDay = async (month: string, year: string, branchId: string, selectedDay: string, noGlassInDay: { cups500ml: number, cups700ml: number, cups800ml: number }) => {
        open(); // Open the loading spinner
        let documentId = `${branchId}${year}${month}`;
        const docRef = doc(db, 'stocks', documentId);
        try {
            const dataSnapshot = await getDoc(docRef);
            if (dataSnapshot.exists()) {
                let data = dataSnapshot.data();
                let afterDay = parseInt(selectedDay) + 1;
                let monthToUpdate = month;
                let yearToUpdate = parseInt(year);
                let flagToStopLoop = 0;
                while (data[`${afterDay}`] === undefined && flagToStopLoop < 3) {
                    afterDay += 1;
                    if (afterDay > 31 && monthToUpdate !== '12') {
                        if (flagToStopLoop !== 2) {
                            monthToUpdate = String(parseInt(monthToUpdate) + 1).padStart(2, '0');
                            documentId = `${branchId}${yearToUpdate}${monthToUpdate}`;
                            const newDocRef = doc(db, 'stocks', documentId);
                            const newDocSnap = await getDoc(newDocRef);
                            if (newDocSnap.exists()) {
                                data = newDocSnap.data();
                                afterDay = 1;
                            } else {
                                afterDay = 31;
                            }
                            flagToStopLoop += 1;
                        } else {
                            break; // Stop the loop 
                        }
                    } else if (afterDay > 31 && monthToUpdate === '12') {
                        if (flagToStopLoop !== 2) {
                            yearToUpdate = yearToUpdate + 1;
                            monthToUpdate = '01';

                            documentId = `${branchId}${yearToUpdate}${monthToUpdate}`;
                            const newDocRef = doc(db, 'stocks', documentId);
                            const newDocSnap = await getDoc(newDocRef);
                            if (newDocSnap.exists()) {
                                data = newDocSnap.data();
                                afterDay = 1;
                            } else {
                                afterDay = 31;
                            }
                            flagToStopLoop += 1;
                        } else {
                            break; // Stop the loop 
                        }
                    }
                }

                if (data[`${afterDay}`] !== undefined) {
                    const totalNoCupsPerDay = {
                        '500ml': data[`${afterDay}`].deliveryMore['500ml'] + noGlassInDay.cups500ml,
                        '700ml': data[`${afterDay}`].deliveryMore['700ml'] + noGlassInDay.cups700ml,
                        '800ml': data[`${afterDay}`].deliveryMore['800ml'] + noGlassInDay.cups800ml
                    }
                    const totalCupsSole = {
                        '500ml': totalNoCupsPerDay['500ml'] - data[`${afterDay}`].noCupsLeftInTheStore['500ml'] - data[`${afterDay}`].breakGlass['500ml'],
                        '700ml': totalNoCupsPerDay['700ml'] - data[`${afterDay}`].noCupsLeftInTheStore['700ml'] - data[`${afterDay}`].breakGlass['700ml'],
                        '800ml': totalNoCupsPerDay['800ml'] - data[`${afterDay}`].noCupsLeftInTheStore['800ml'] - data[`${afterDay}`].breakGlass['800ml']
                    }


                    const newRef = doc(db, 'stocks', `${branchId}${yearToUpdate}${monthToUpdate}`);
                    await updateDoc(newRef, {
                        [afterDay.toString()]: {
                            ...data[`${afterDay}`], totalNoCupsPerDay, totalCupsSole
                        }
                    });
                }

            }
            close(); // Close the loading spinner
        } catch (error) {
            console.log(error);
            close(); // Close the loading spinner
        }


    }

    const handleDeny = async (data: Approval, index: number) => {
        open();
        try {
            const newPendingApprovals = pendingApprovals.filter((_, i) => i !== index);
            setPendingApprovals(newPendingApprovals);
            await deleteDoc(doc(db, 'pendings', data.id));
            close();
            setTypeAndMessage('success', 'Đã từ chối thông tin cập nhật của nhân viên!');
        } catch (error) {
            console.log(error);
            close();
            setTypeAndMessage('fail', 'Lỗi khi từ chối thông tin cập nhật của nhân viên! Hãy thử lại sau!');
        }
    }
    useEffect(() => {
        const fetchPendingApprovals = async () => {
            try {
                open();
                const querySnapshot = await getDocs(collection(db, 'pendings'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Approval));
                setPendingApprovals(data);
                close();
            } catch (error) {
                close();
                console.error("Lỗi khi lấy dữ liệu pending approvals:", error);
            }
        }
        fetchPendingApprovals();
    }, [])
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
                    {pendingApprovals.length > 0 ?
                        pendingApprovals.map((approval, index) => (
                            <div key={index} className='w-full bg-white h-fit flex flex-col gap-y-4 sm:flex-row justify-between border-[2px] border-dashed border-slate-500 py-4 px-4 text-[14px]'>
                                <p className='flex flex-col gap-y-1'><span>Nhân viên</span><span className="font-bold">{approval.staffName}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Chi nhánh</span><span className="font-bold">{approval.branchName}</span></p>
                                <p className='flex flex-col gap-y-1'><span>Ngày</span><span className="font-bold">{String(approval.selectedDay).padStart(2, "0") + "/" + (approval.selectedDate).slice(-2) + "/" + (approval.selectedDate).slice(0, 4)}</span></p>
                                <div className='flex flex-col gap-y-1'>
                                    <p>Hàng tồn hôm nay</p>
                                    <div className="font-bold flex gap-x-2">
                                        <p><span>500ml: </span><span>{approval.noGlassInDay.cups500ml}</span></p>
                                        <p><span>700ml: </span><span>{approval.noGlassInDay.cups700ml}</span></p>
                                        <p><span>800ml: </span><span>{approval.noGlassInDay.cups800ml}</span></p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-1'>
                                    <p>Hàng giao thêm</p>
                                    <div className="font-bold  flex gap-x-2">
                                        <p><span>500ml: </span><span>{approval.deliveryMore.cups500ml}</span></p>
                                        <p><span>700ml: </span><span>{approval.deliveryMore.cups700ml}</span></p>
                                        <p><span>800ml: </span><span>{approval.deliveryMore.cups800ml}</span></p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-1'>
                                    <p>Số ly vỡ</p>
                                    <div className="font-bold  flex gap-x-2">
                                        <p><span>500ml: </span><span>{approval.breakGlass.cups500ml}</span></p>
                                        <p><span>700ml: </span><span>{approval.breakGlass.cups700ml}</span></p>
                                        <p><span>800ml: </span><span>{approval.breakGlass.cups800ml}</span></p>
                                    </div>
                                </div>
                                <div className='flex flex-row sm:flex-col gap-x-4 justify-end sm:justify-center gap-y-1 '>
                                    <button className='text-green-500' onClick={() => handleApprove(approval, index)}>Duyệt</button>
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

export default ApprovePage;