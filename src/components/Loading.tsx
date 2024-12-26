import { useContext } from "react"
import LoadingContext from "../contexts/LoadingContext"

const Loading = () => {
    const { loading } = useContext(LoadingContext);
    return (
        <>
            {loading && <div className={`z-10 w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,.5)] flex flex-col justify-center items-center gap-y-2`}>
                <div className='animate-spin animate-infinite animate-ease-out w-[50px] h-[50px] rounded-full border-[4px] border-solid border-r-[#15b392] border-l-white'></div>
                <p className='text-white text-xl italic'>Loading...</p>
            </div>}
        </>

    )
}

export default Loading