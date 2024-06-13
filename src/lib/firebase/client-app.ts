"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

export const firebaseApp =
	getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

if (!firebaseApp) {
	throw new Error("Firebase app has not been initialized");
}

export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
