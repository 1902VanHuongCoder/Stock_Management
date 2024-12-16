import { useContext, useEffect, useState } from 'react'
import NotificationContext from '../contexts/NotificationContext';
import { doc } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConfig';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import LoadingContext from '../contexts/LoadingContext';

const UpdateRemainStock = ({ closeModal, yearAndMonthToUpdate, selectedBranch }: { closeModal: () => void, yearAndMonthToUpdate: string, selectedBranch: string }) => {
    const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString());
    const [days, setDays] = useState<number[]>([]);
    const { setTypeAndMessage } = useContext(NotificationContext);
    const { open, close } = useContext(LoadingContext);

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

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(e.target.value);
    };


    const handleUpdateStock = async () => {
        open();
        try {
            const year = yearAndMonthToUpdate.slice(0, 4);
            const month = yearAndMonthToUpdate.slice(-2);
            const documentId = `${selectedBranch}${year}${month}`;

            const docRef = doc(db, 'stocks', documentId);
            const whetherStockExists = await getDoc(docRef);

            let data;

            if (whetherStockExists.exists()) {
                data = whetherStockExists.data();
                if (data[selectedDay] !== undefined) {
                    setTypeAndMessage('fail', 'Thông tin kho vào ngày này đã được cập nhật! Hãy sửa thông tin kho!');
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
                console.log(previousDay);
                if (selectedDay === '1' || previousDay < 1 && month !== '01') {
                    monthToAccessData = String(parseInt(monthToAccessData) - 1).padStart(2, '0');
                    const documentIdOfPreviousMonth = `${selectedBranch}${year}${monthToAccessData}`;
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
                } else if (selectedDay === '1' || previousDay < 1 && month === '01') {
                    yearToAccessData = yearToAccessData - 1;
                    monthToAccessData = '12';
                    const documentIdOfPreviousMonth = `${selectedBranch}${yearToAccessData.toString()}${monthToAccessData}`;
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
            handleUpdateAfterDay(month, year);
            close();
            setTypeAndMessage('success', 'Cập nhật tồn kho thành công!');

        } catch (error) {
            console.log(error);
            close();
            setTypeAndMessage('fail', 'Lỗi trong quá trình cập nhật tồn kho! Hãy thử lại sau!');
        }
    }

    const handleUpdateAfterDay = async (month: string, year: string) => {
        open(); // Open the loading spinner
        let documentId = `${selectedBranch}${year}${month}`;
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
                            documentId = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
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

                            documentId = `${selectedBranch}${yearToUpdate}${monthToUpdate}`;
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

                console.log("Có ngày hôm sau để cập nhật không?", data[`${afterDay}`] !== undefined);
                console.log("Ngay de cap nhat la:", afterDay, "-", monthToUpdate, "-", yearToUpdate);

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


                    const newRef = doc(db, 'stocks', `${selectedBranch}${yearToUpdate}${monthToUpdate}`);

                    console.log("DocumentId của ngày sau ngày cập nhập", `${selectedBranch}${yearToUpdate}${monthToUpdate}`);

                    console.log("Dữ liệu mới để cập nhật cho ngày 16", {
                        ...data[`${afterDay}`], totalNoCupsPerDay, totalCupsSole
                    })

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


    useEffect(() => {
        const today = new Date();
        const currentDay = today.getDate();
        const daysArray = Array.from({ length: currentDay }, (_, i) => i + 1);
        setDays(daysArray);
    }, []);

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,0,0,.8)]'>
            <div className="px-5 w-[95%] sm:w-[80%] bg-white pt-5 border-[2px] border-dashed border-slate-500">
                <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>CẬP NHẬT TỒN KHO</h2>
                <div className='mb-4'>
                    <label htmlFor="date" className='block text-black font-medium mb-2'>Chọn ngày <span className="text-red-500">(*)</span></label>
                    <select
                        id="day"
                        value={selectedDay}
                        onChange={handleDayChange}
                        className='w-full sm:w-[400px] p-3 rounded-lg border border-gray-300 outline-none'
                        required
                    >
                        <option value="" disabled>Chọn ngày</option>
                        {days.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
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
                                    min={0}
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
                                    min={0}
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
                                    min={0}
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
                                    min={0}
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
                                    min={0}
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
                                    min={0}
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
                    <button onClick={() => { handleUpdateStock() }} className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateRemainStock