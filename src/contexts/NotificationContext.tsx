import React, { createContext, useEffect } from 'react';

interface NotificationContextType {
    isShow: boolean,
    type: string,
    message: string,
    close: () => void,
    setTypeAndMessage: (type: string, message: string) => void,
}

const NotificationContext = createContext<NotificationContextType>({
    isShow: false,
    type: '',
    message: '',
    close: () => { },
    setTypeAndMessage: () => { },
});
export default NotificationContext;


// 2. Create a provider to wrap the app with the context
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notification, setNotification] = React.useState({
        isShow: false,
        type: 'fail',
        message: 'Cập nhật thông tin thành công!',
    });
    const close = () => setNotification({ ...notification, isShow: false });
    const setTypeAndMessage = (type: string, message: string) => setNotification({ ...notification, type, message, isShow: true });

    useEffect(() => {
        const timeout = setTimeout(() => {
            close();
        }, 4000);
        return () => clearTimeout(timeout);
    }, [notification.isShow]);
    return ( // pass the state and the functions to the provider
        <NotificationContext.Provider value={{ ...notification, close, setTypeAndMessage }}>
            {children}
        </NotificationContext.Provider>
    )
}