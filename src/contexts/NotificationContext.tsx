import React, { createContext, useEffect } from 'react';

interface NotificationContextType {
    isShow: boolean,
    type: string,
    message: string,
    close: () => void,
    setTypeAndMessage: (type: string, message: string) => void,
}

const NotificationContextType = createContext<NotificationContextType>({
    isShow: false,
    type: 'success',
    message: 'Cập nhật thông tin thành công!',

    close: () => { },
    setTypeAndMessage: () => { },
});
export default NotificationContextType;


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
        }, 3000);
        return () => clearTimeout(timeout);
    })
    return ( // pass the state and the functions to the provider
        <NotificationContextType.Provider value={{ ...notification, close, setTypeAndMessage }}>
            {children}
        </NotificationContextType.Provider>
    )
}