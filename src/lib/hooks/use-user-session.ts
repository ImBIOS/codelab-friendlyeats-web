import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "../firebase/auth";
import { firebaseConfig } from "../firebase/config";

export function useUserSession(initialUser: User | null) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	// Register the service worker that sends auth state back to server
	// The service worker is built with npm run build-service-worker
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(
				JSON.stringify(firebaseConfig),
			);
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

			navigator.serviceWorker
				.register(serviceWorkerUrl)
				.then((registration) => console.log("scope is: ", registration.scope))
				.catch((error) =>
					console.error("Service worker registration failed", error),
				);
		}
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser: User | null) => {
			authUser && setUser(authUser);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		onAuthStateChanged((authUser: User | null) => {
			if (user === undefined) return;

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
				router.refresh();
			}
		});
		// eslint-disable-next-line @typescript-eslint/unbound-method
	}, [user, router.refresh]);

	return user;
}
