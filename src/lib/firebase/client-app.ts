"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

export const firebaseApp =
	getApps().length === 0
		? initializeApp(firebaseConfig)
		: (getApps()[0] as FirebaseApp);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
