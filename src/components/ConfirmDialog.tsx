import React, { useContext } from 'react'
import ConfirmContext from '../contexts/ConfirmContext';

const ConfirmDialog = () => {
    const { isOpen, deleteItem, cancle } = useContext(ConfirmContext);
    return (
        <>
            {isOpen && <div className={`z-10 w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,.5)] flex flex-col justify-center items-center gap-y-2`}>
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-y-2">
                    <h1 className="text-xl font-semibold text-[#15b392]">Xác nhận xóa</h1>
                    <p>Bạn có chắc chắn muốn xóa mục này?</p>
                    <div className="flex gap-x-4">
                        <button onClick={deleteItem} className="bg-red-500 text-white px-4 py-2 rounded-lg">Xóa</button>
                        <button onClick={cancle} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Hủy</button>
                    </div>
                </div>
            </div>}
        </>

    )
}

export default ConfirmDialog