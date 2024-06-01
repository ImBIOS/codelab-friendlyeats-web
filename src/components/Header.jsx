"use client";
import {
	onAuthStateChanged,
	signInWithGoogle,
	signOut,
} from "@/src/lib/firebase/auth.js";
import { firebaseConfig } from "@/src/lib/firebase/config";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

function useUserSession(initialUser) {
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
				.then((registration) => console.log("scope is: ", registration.scope));
		}
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser) => {
			setUser(authUser);
		});

		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		onAuthStateChanged((authUser) => {
			if (user === undefined) return;

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
				router.refresh();
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return user;
}

export default function Header({ initialUser }) {
	const user = useUserSession(initialUser);

	const handleSignOut = (event) => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = (event) => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				<img src="/friendly-eats.svg" alt="FriendlyEats" />
				Friendly Eats
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img
								className="profileImage"
								src={user.photoURL || "/profile.svg"}
								alt={user.email}
							/>
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<button type="button" onClick={addFakeRestaurantsAndReviews}>
										Add sample restaurants
									</button>
								</li>

								<li>
									<button type="button" onClick={handleSignOut}>
										Sign Out
									</button>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<div className="profile">
					<button type="button" onClick={handleSignIn}>
						<img src="/profile.svg" alt="A placeholder user portrait" />
						Sign In with Google
					</button>
				</div>
			)}
		</header>
	);
}
