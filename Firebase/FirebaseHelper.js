import {
  collection,
  doc,
  addDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  } from "firebase/firestore";
import { db, auth} from "./FirebaseSetup";

// user published task
export async function writeTasksToDB(task) {
    task = {
      ...task, 
      createdAt: new Date(),
      updatedAt: new Date(),
      user: auth.currentUser.uid,
    };
    
    try {
      const docRef = await addDoc(collection(db, "publishedTask"), task);
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.log("writePublishedTaskToDB", err);
    }
}