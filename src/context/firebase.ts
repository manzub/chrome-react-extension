import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { createContext } from "react";

export type FirebaseContextType = {
  firebase: FirebaseApp,
  auth: Auth,
  firestore: Firestore
}

export const FirebaseContext = createContext<FirebaseContextType | null>(null);