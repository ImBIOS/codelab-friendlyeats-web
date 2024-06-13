import { connectAuthEmulator, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { connectStorageEmulator, type FirebaseStorage } from "firebase/storage";

type EmulatorProps = {
	auth?: Auth | undefined;
	db?: Firestore | undefined;
	storage?: FirebaseStorage | undefined;
};

/**
 * TODO: Fix emulator working in client, but not working inserver
 * Objectives:
 * - [x] Working in client
 * - [ ] Working in server
 */
export const emulator = ({ auth, db, storage }: EmulatorProps = {}) => {
	const isServer = typeof window === "undefined";
	const isProduction = process.env.NODE_ENV === "production";

	if (!isProduction) {
		fetch("http://127.0.0.1:4000", { mode: "no-cors" }).then(
			() => {
				console.log(
					"\x1b[42m%s\x1b[0m",
					`${isServer ? "SERVER" : "CLIENT"}: Emulator is available`,
				);

				// for auth
				process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
				auth && connectAuthEmulator(auth, "http://127.0.0.1:9099");

				// for firestore
				process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
				db && connectFirestoreEmulator(db, "127.0.0.1", 8080);

				// for storage
				process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";
				storage && connectStorageEmulator(storage, "127.0.0.1", 9199);
			},
			() => {
				// Emulator is not available
				console.log("\x1b[41m%s\x1b[0m", "Running firebase without emulator");
			},
		);
	}
};
