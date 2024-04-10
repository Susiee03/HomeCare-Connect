import {
    collection,
    addDoc,
    doc,
    deleteDoc,
    getDocs,
    updateDoc,
    query,
    where,
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

  export async function getUserByEmail(email) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        console.log("Document data:", userDoc.data());
        return userDoc.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (err) {
      console.error("Error getting document:", err);
      return null;
    }
  }

  export async function updateUserByEmail(email, newData) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, newData);
        console.log("User updated successfully.");
      } else {
        console.log("No user found with the provided email.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }
  
  export async function deleteUserFromDB(email) {
    try {
      await deleteDoc(doc(db, "users", email));
    } catch (err) {
      console.log(err);
    }
  }