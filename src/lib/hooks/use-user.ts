"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/src/lib/firebase/client-app";

export function useUser() {
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			setUser(authUser);
		});

		return () => unsubscribe();
	}, []);

	return user;
}
