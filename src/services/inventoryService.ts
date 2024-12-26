import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';

const inventoryCollection = collection(db, 'inventory');

interface InventoryData {
  name: string;
  quantity: number;
  price: number;
  // Add other fields as necessary
}

export const addInventoryData = async (data: InventoryData) => {
  await addDoc(inventoryCollection, data);
};

export const updateInventoryData = async (id: string, data: Partial<InventoryData>) => {
  const inventoryDoc = doc(db, 'inventory', id);
  await updateDoc(inventoryDoc, data);
};

export const getInventoryData = async () => {
  const snapshot = await getDocs(inventoryCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};