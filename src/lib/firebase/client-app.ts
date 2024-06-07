"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

export const firebaseApp =
	getApps().length === 0
		? initializeApp(firebaseConfig)
		: (getApps()[0] as FirebaseApp);
export const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");
export const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, "localhost", 8080);
export const storage = getStorage(firebaseApp);
connectStorageEmulator(storage, "localhost", 9199);
