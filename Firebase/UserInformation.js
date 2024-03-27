import {
    collection,
    addDoc,
    doc,
    deleteDoc,
    getDocs,
    updateDoc,
  } from "firebase/firestore";
import { db } from "./FirebaseSetup";
  
export async function writeUserToDB(data) {
    try {
      await addDoc(collection(db, "users"), data);
    } catch (err) {
      console.log(err);
    }
  }
  
  export async function getAllDocs(path) {
    try {
      const querySnapshot = await getDocs(collection(db, path));
      let newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push(doc.data());
        console.log(doc.data());
      });
      return newArray;
    } catch (err) {
      console.log(err);
    }
  }

  export async function updateUserInDB(id, data) {
    const userDocRef = doc(db, "users", id);
    try {
      await updateDoc(userDocRef, data);
    } catch (err) {
      console.log(err);
    }
  }
  
  export async function deleteUserFromDB(id) {
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      console.log(err);
    }
  }