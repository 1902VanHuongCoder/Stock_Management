import { NavigationBar, SideBarOfAdmin } from '../helpers';

const ApprovePage = () => {
    return (
        <div className='relative bg-[#15B392] min-h-screen max-w-screen sm:flex sm:justify-end'>
            <SideBarOfAdmin />
            <div className='sm:w-[80%]'>
                <NavigationBar />
                <div className="sm:hidden flex justify-center items-center pt-10">
                    <p className='w-full px-5 flex items-center'>
                        <span className='w-[10px] h-[40px] sm:h-[50px] bg-[#D2FF72] inline-block'></span>
                        <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 sm:pl-5 h-[40px] sm:h-[50px] text-xl sm:text-2xl text-white font-medium sm:ml-2'>
                            <span className=''>CẬP NHẬT CHI NHÁNH</span>
                        </span>
                    </p>
                </div>
                <div className='hidden sm:block w-full text-center bg-[#2a2f2a] h-[80px]'>
                    <h1 className='text-4xl font-bold text-white drop-shadow-md  h-full flex justify-center items-center uppercase'>DUYỆT THÔNG TIN DO NHÂN VIÊN CẬP NHẬT</h1>
                </div>
                <div className='w-full p-4 flex flex-col gap-y-4'>
                    <div className='w-full bg-white h-fit flex flex-col gap-y-4 sm:flex-row justify-between border-[2px] border-dashed border-slate-500 py-4 px-4 text-[14px]'>
                        <p className='flex flex-col gap-y-1'><span>Nhân viên</span><span className="font-bold">Tô Văn Hưởng</span></p>
                        <p className='flex flex-col gap-y-1'><span>Chi nhánh</span><span className="font-bold">Cần Thơ</span></p>
                        <p className='flex flex-col gap-y-1'><span>Ngày</span><span className="font-bold">05/12/2024</span></p>
                        <div className='flex flex-col gap-y-1'>
                            <p>Hàng tồn hôm nay</p>
                            <div className="font-bold flex gap-x-2">
                                <p><span>500ml: </span><span>192</span></p>
                                <p><span>700ml: </span><span>211</span></p>
                                <p><span>800ml: </span><span>192</span></p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <p>Hàng giao thêm</p>
                            <div className="font-bold  flex gap-x-2">
                                <p><span>500ml: </span><span>192</span></p>
                                <p><span>700ml: </span><span>211</span></p>
                                <p><span>800ml: </span><span>192</span></p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <p>Số ly vỡ</p>
                            <div className="font-bold  flex gap-x-2">
                                <p><span>500ml: </span><span>192</span></p>
                                <p><span>700ml: </span><span>211</span></p>
                                <p><span>800ml: </span><span>192</span></p>
                            </div>
                        </div>
                        <div className='flex flex-row sm:flex-col gap-x-4 justify-end sm:justify-center gap-y-1 '>
                            <button className='text-green-500'>Duyệt</button>
                            <button className='text-red-500'>Từ chối</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ApprovePage;