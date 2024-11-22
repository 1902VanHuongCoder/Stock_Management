import { ReactNode} from 'react';
interface ContainerProps {
    children: ReactNode; // ReactNode is a type that represents any valid JSX expression
}
const Container = ({children} : ContainerProps) => {
    return(
        <div className="max-w-screen overflow-hidden min-h-screen bg-[#15B392] flex justify-center items-center flex-col gap-y-7">
            {children}
        </div>
    )
}

export default Container;