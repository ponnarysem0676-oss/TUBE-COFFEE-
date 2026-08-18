import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const listCollection = async (name, sortField="createdAt") => {
  const q = query(collection(db,name), orderBy(sortField,"desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d=>({id:d.id,...d.data()}));
};
export const listAll = async name => { const snap=await getDocs(collection(db,name)); return snap.docs.map(d=>({id:d.id,...d.data()})); };
export const createRecord = (name,data) => addDoc(collection(db,name), {...data, createdAt:serverTimestamp()});
export const updateRecord = (name,id,data) => updateDoc(doc(db,name,id), data);
export const deleteRecord = (name,id) => deleteDoc(doc(db,name,id));
export const getUserOrders = async uid => {
  const q=query(collection(db,"orders"),where("userId","==",uid),orderBy("createdAt","desc"));
  const snap=await getDocs(q); return snap.docs.map(d=>({id:d.id,...d.data()}));
};

