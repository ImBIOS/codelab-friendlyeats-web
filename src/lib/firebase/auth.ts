import {
	GoogleAuthProvider,
	onAuthStateChanged as _onAuthStateChanged,
	signInWithPopup,
	type NextOrObserver,
	type User,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/client-app";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
	return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();

	try {
		await signInWithPopup(auth, provider);
	} catch (error) {
		console.error("Error signing in with Google", error);
	}
}

export async function signOut() {
	try {
		await auth.signOut();
	} catch (error) {
		console.error("Error signing out", error);
	}
}
