import { NavigationBar } from '../helpers';
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaPenAlt } from "react-icons/fa";
const StockDetails = () => {
    const branches = [
        { image: 'https://images.unsplash.com/photo-1731928962673-4d5a6a98b069?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8', name: 'Branch 1' },
        { image: 'https://images.unsplash.com/photo-1731928962528-5b76c6d578c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8', name: 'Branch 2' },
        { image: 'https://images.unsplash.com/photo-1732003039812-39c4cd9fce9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 3' },
        { image: 'https://images.unsplash.com/photo-1721332149346-00e39ce5c24f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 4' },
        { image: 'https://images.unsplash.com/photo-1732019065295-eb9ece640258?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D', name: 'Branch 5' },
        { image: 'https://images.unsplash.com/photo-1664566484452-03b6f3817fdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 6' },
        { image: 'https://images.unsplash.com/photo-1731570225640-7ddad4231679?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 7' },
        { image: 'https://images.unsplash.com/photo-1731688687605-e1e7aa7fb42c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D', name: 'Branch 8' },
    ];
    const navigate = useNavigate(); // Hook for navigation
    const handleNavigate = (branchId: string) => {
        navigate(`/quanly/nguyenkiet/chinhanh/${branchId}`);
    }
    return (
        <div className='bg-[#15B392] min-h-screen max-w-screen'>
            <NavigationBar />
            <div className="flex justify-center items-center pt-10">
                <p className='w-full px-5 flex items-center'><span className='w-[10px] h-[40px] bg-[#D2FF72] inline-block'></span>
                    <span className='w-full bg-[rgba(0,0,0,.5)] flex items-center pl-2 h-[40px] text-xl text-white font-medium'><span className=''>QUẢN LÝ KHO (23/11)</span></span></p>
            </div>
            <div className='w-full h-fit flex justify-end px-5 pt-5'>
                <button className='flex justify-center items-center px-4 bg-white py-2 gap-x-2 font-bold rounded-md shadow-md cursor-pointer hover:opacity-80'><span><FaPenAlt /></span>Cập nhật tồn kho</button>
            </div>
            <div className='w-full h-fit grid grid-cols-2 gap-y-2 gap-x-6 pt-5 px-5' >
                {branches.map((branch, index) => (
                    <div onClick={() => handleNavigate("123")} key={index} className='flex items-start mb-4 flex-col gap-y-2 group'>
                        <div className='bg-white w-full p-2 rounded-md'>
                            <div className='w-full h-[100px] p-2 bg-[#73EC8D] shadow-2xl rounded-md overflow-hidden'>
                                <div className='w-full h-full rounded-md overflow-hidden'>
                                    <img src={branch.image} alt={branch.name} className='w-full h-full object-cover group-hover:scale-110 transition-all' />
                                </div></div>
                        </div>

                        <span className='text-white text-lg uppercase'>{branch.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockDetails;