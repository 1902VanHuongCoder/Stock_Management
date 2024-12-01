import React, { createContext, useContext, useState } from "react";
import NotificationContextType from "./NotificationContext";
import { deleteDoc, doc } from "firebase/firestore/lite";
import { db } from "../services/firebaseConfig";

interface ConfirmContextType {
    isOpen: boolean;
    title: string;
    idToDelete: string; // Id of the item to delete
    collection: string; // Collection of the item to delete 
    setDataToDelete: (title: string, id: string, collection: string) => void; // Function to show the confirm dialog
    cancle: () => void; // Function to close the confirm dialog
    deleteItem: () => void; // Function to delete the item
}

const ConfirmContext = createContext<ConfirmContextType>({
    isOpen: false,
    title: "",
    idToDelete: "",
    collection: "",
    setDataToDelete: () => { }
    , cancle: () => { },
    deleteItem: () => { }

}) // Create a context with default values

export default ConfirmContext;

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
    const { setTypeAndMessage } = useContext(NotificationContextType);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [idToDelete, setIdToDelete] = useState("");
    const [collection, setCollection] = useState("");

    const setDataToDelete = (title: string, id: string, collection: string) => {  // Function to show the confirm dialog
        setTitle(title);
        setIdToDelete(id);
        setCollection(collection);
        setIsOpen(true);
    }

    const cancle = () => {
        setIsOpen(false);
        setTitle("");
        setIdToDelete("");
        setCollection("");
    }
    const deleteItem = async () => {
        // Code to delete the item
        try {
            await deleteDoc(doc(db, collection, idToDelete));
            setTypeAndMessage('success', 'Xóa mục thành công!');
            window.location.reload();
        } catch (error) {
            console.log(error);
            setTypeAndMessage('fail', 'Lỗi trong quá trình xóa mục này! Hãy thử lại sau!');
        }
    }

    return (
        <ConfirmContext.Provider value={{ deleteItem, cancle, isOpen, title, idToDelete, collection, setDataToDelete }}>
            {children}
        </ConfirmContext.Provider>
    )
}