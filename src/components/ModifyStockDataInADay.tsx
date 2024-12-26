import { useContext, useState } from 'react'
import NotificationContext from '../contexts/NotificationContext';
import { db } from '../services/firebaseConfig';
import { getDoc, updateDoc, doc } from 'firebase/firestore/lite';
import LoadingContext from '../contexts/LoadingContext';

interface StockData {
    noCupsLeftInTheStore: {
        '500ml': number;
        '700ml': number;
        '800ml': number;
    },
    deliveryMore: {
        '500ml': number;
        '700ml': number;
        '800ml': number;
    },
    breakGlass: {
        '500ml': number;
        '700ml': number;
        '800ml': number;
    }
    , totalNoCupsPerDay: {
        '500ml': number;
        '700ml': number;
        '800ml': number;
    }, totalCupsSole: { '500ml': number, '700ml': number, '800ml': number }

}

const ModifyStockDataInADay = ({ closeModal, dayToModify, monthToModify, yearToModify, currentData, branchId, reFetch }: { closeModal: () => void, dayToModify: string, monthToModify: string, yearToModify: string, currentData: StockData, branchId: string, reFetch: () => void }) => {
    const { setTypeAndMessage } = useContext(NotificationContext);
    const { open, close } = useContext(LoadingContext);
    const [noGlassInDay, setNoGlassInDay] = useState({
        cups500ml: currentData.noCupsLeftInTheStore['500ml'],
        cups700ml: currentData.noCupsLeftInTheStore['700ml'],
        cups800ml: currentData.noCupsLeftInTheStore['800ml']
    });

    const [deliveryMore, setDeliveryMore] = useState({
        cups500ml: currentData.deliveryMore['500ml'],
        cups700ml: currentData.deliveryMore['700ml'],
        cups800ml: currentData.deliveryMore['800ml']
    });

    const [breakGlass, setBreakGlass] = useState({
        cups500ml: currentData.breakGlass['500ml'],
        cups700ml: currentData.breakGlass['700ml'],
        cups800ml: currentData.breakGlass['800ml']
    });

    const handleModifyStockData = async () => {
        open();
        if (currentData.noCupsLeftInTheStore['500ml'] !== noGlassInDay.cups500ml || currentData.noCupsLeftInTheStore['700ml'] !== noGlassInDay.cups700ml || currentData.noCupsLeftInTheStore['800ml'] !== noGlassInDay.cups800ml) {


            let documentId = `${branchId}${yearToModify}${monthToModify}`;
            const stockDataRef = doc(db, 'stocks', documentId);
            const dataSnapshot = await getDoc(stockDataRef);

            try {
                if (dataSnapshot.exists()) {
                    let data = dataSnapshot.data();
                    console.log(data);

                    let afterDay = parseInt(dayToModify) + 1;
                    let monthToUpdate = monthToModify;
                    let yearToUpdate = parseInt(yearToModify);
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

                    const totalCupsSole = {
                        '500ml': currentData.totalNoCupsPerDay['500ml'] - noGlassInDay.cups500ml,
                        '700ml': currentData.totalNoCupsPerDay['700ml'] - noGlassInDay.cups700ml,
                        '800ml': currentData.totalNoCupsPerDay['800ml'] - noGlassInDay.cups800ml
                    }

                    await updateDoc(stockDataRef, {
                        [dayToModify]: {
                            ...currentData, noCupsLeftInTheStore: {
                                '500ml': noGlassInDay.cups500ml,
                                '700ml': noGlassInDay.cups700ml,
                                '800ml': noGlassInDay.cups800ml
                            }, totalCupsSole
                        }
                    });
                    close();
                    closeModal();
                    reFetch();
                    setTypeAndMessage('success', 'Cập nhật dữ liệu thành công');
                }
            } catch (error) {
                console.log(error);
                close();
                closeModal();
                setTypeAndMessage('error', 'Có lỗi xảy ra khi cập nhật dữ liệu');
            }
        }

        if (currentData.deliveryMore['500ml'] !== deliveryMore.cups500ml || currentData.deliveryMore['700ml'] !== deliveryMore.cups700ml || currentData.deliveryMore['800ml'] !== deliveryMore.cups800ml || currentData.breakGlass['500ml'] !== breakGlass.cups500ml || currentData.breakGlass['700ml'] !== breakGlass.cups700ml || currentData.breakGlass['800ml'] !== breakGlass.cups800ml) {
            const documentId = `${branchId}${yearToModify}${monthToModify}`;
            const stockDataRef = doc(db, 'stocks', documentId);

            try {
                const noCupsLeftInTheStoreBefore = {
                    '500ml': currentData.totalNoCupsPerDay['500ml'] - currentData.deliveryMore['500ml'], // 500 = 9 
                    '700ml': currentData.totalNoCupsPerDay['700ml'] - currentData.deliveryMore['700ml'],
                    '800ml': currentData.totalNoCupsPerDay['800ml'] - currentData.deliveryMore['800ml']
                }

                const totalNoCupsPerDay = {
                    '500ml': deliveryMore.cups500ml + noCupsLeftInTheStoreBefore['500ml'], // 500 = 1 + 9 = 10 
                    '700ml': deliveryMore.cups700ml + noCupsLeftInTheStoreBefore['700ml'],
                    '800ml': deliveryMore.cups800ml + noCupsLeftInTheStoreBefore['800ml']
                }

                const totalCupsSole = {
                    '500ml': totalNoCupsPerDay['500ml'] - noGlassInDay.cups500ml - breakGlass.cups500ml, // 500 = 10 - 9 - 0 = 1 
                    '700ml': totalNoCupsPerDay['700ml'] - noGlassInDay.cups700ml - breakGlass.cups700ml,
                    '800ml': totalNoCupsPerDay['800ml'] - noGlassInDay.cups800ml - breakGlass.cups800ml
                };

                await updateDoc(stockDataRef, {
                    [dayToModify]: {
                        breakGlass: {
                            '500ml': breakGlass.cups500ml,
                            '700ml': breakGlass.cups700ml,
                            '800ml': breakGlass.cups800ml
                        },
                        deliveryMore: {
                            '500ml': deliveryMore.cups500ml,
                            '700ml': deliveryMore.cups700ml,
                            '800ml': deliveryMore.cups800ml
                        },
                        noCupsLeftInTheStore: {
                            '500ml': noGlassInDay.cups500ml,
                            '700ml': noGlassInDay.cups700ml,
                            '800ml': noGlassInDay.cups800ml
                        },
                        totalCupsSole: totalCupsSole,
                        totalNoCupsPerDay: totalNoCupsPerDay
                    }
                });
                close();
                closeModal();
                reFetch();
                setTypeAndMessage('success', 'Cập nhật dữ liệu thành công');
            } catch (error) {
                console.log(error);
                close();
                setTypeAndMessage('error', 'Có lỗi xảy ra khi cập nhật dữ liệu');
            }
        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,0,0,.8)]'>
            <div className="px-5 w-[95%] sm:w-[80%] bg-white pt-5 border-[2px] border-dashed border-slate-500">
                <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>SỬA THÔNG TIN NGÀY {dayToModify}</h2>
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
                    <button onClick={() => { handleModifyStockData() }} className='px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}

export default ModifyStockDataInADay; 