import { IoHome } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export const ButtonToHome = ({ path }: { path: string }) => {
    const naviate = useNavigate();
    const handleClick = () => { naviate(path) }; // Redirect to home page
    return (
        <p className='text-4xl text-white' onClick={handleClick}><IoHome /></p>
    )
}
