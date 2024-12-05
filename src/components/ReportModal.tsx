const ReportModal = ({ closeModal }: { closeModal: () => void }) => {
    // console.log(branches);


    return (
        <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.8)]'>
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
                    <button onClick={() => { closeModal() }} className='px-6 py-2 rounded-md border-[2px] border-solid border-red-500 text-red-500 text-lg hover:opacity-80 transition-all'>Đóng</button>
                </div>
            </div>
        </div>
    )
}

export default ReportModal