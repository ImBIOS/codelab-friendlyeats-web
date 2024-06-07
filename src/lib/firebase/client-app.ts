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
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

fetch("http://localhost:4000").then(
	() => {
		console.log("\x1b[42m%s\x1b[0m", "Emulator is available, connecting to it");

		connectAuthEmulator(auth, "http://localhost:9099");
		connectFirestoreEmulator(db, "localhost", 8080);
		connectStorageEmulator(storage, "localhost", 9199);
	},
	() => {
		// Emulator is not available
		console.log("\x1b[41m%s\x1b[0m", "Running firebase without emulator");
	},
);
