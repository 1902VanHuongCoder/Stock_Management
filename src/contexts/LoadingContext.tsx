import { createContext, ReactNode, useState } from 'react';

interface LoadingContextType {
    loading: boolean; // Define a property called loading of type boolean
    open: () => void; // Define a function called open that returns void
    close: () => void; // Define a function called close that returns void
};

const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    open: () => { },
    close: () => { },
});

export default LoadingContext;

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false); // Create a state called loading with a default value of false
    const open = () => setLoading(true); // Create a function called open that sets the loading state to true
    const close = () => setLoading(false); // Create a function called close that sets the loading state to false

    return (
        <LoadingContext.Provider value={{ loading, open, close }}>
            {children}
        </LoadingContext.Provider>
    )
}