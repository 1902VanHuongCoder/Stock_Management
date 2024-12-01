import React, { createContext, useEffect } from "react";

// 1. Create a context to store the state of the sidebar
interface SideBarContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}
const SideBarContext = createContext<SideBarContextType>({ // create a context with default values
    isOpen: false,
    open: () => { },
    close: () => { }
});
export default SideBarContext;

// 2. Create a provider to wrap the app with the context
export const SideBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false); // create a state to store the state of the sidebar
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    useEffect(() => {
        const timeout = setTimeout(() => { // close the sidebar after 3 seconds
            close();
        }, 10000);
        return () => clearTimeout(timeout);
    }, [isOpen]);
    return ( // pass the state and the functions to the provider
        <SideBarContext.Provider value={{ isOpen, open, close }}>
            {children}
        </SideBarContext.Provider>
    )
}