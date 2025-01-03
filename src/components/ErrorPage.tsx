import { useNavigate } from 'react-router-dom';
import sadCat from '../assets/cat+use+phone.gif';

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div className='w-screen h-screen bg-[#15B392]'>
            <div className='flex flex-col items-center justify-center h-screen'>
                <div className='w-[300px] h-[300px]'>
                    <img src={sadCat} alt='Sad cat' className='w-full h-full' />
                </div>
                <h1 className='text-3xl font-bold text-white drop-shadow-lg text-center'>404 - KHÔNG TÌM THẤY TRANG</h1>
                <button onClick={() => { navigate("/") }} className='py-4 px-6 bg-white mt-5 rounded-md font-bold hover:opacity-80 text-[#15B392] drop-shadow-lg'>TRANG CHỦ</button>
            </div>
        </div>
    )
}

export default ErrorPage