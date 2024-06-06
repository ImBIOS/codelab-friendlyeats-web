"use client";
import { signInWithGoogle, signOut } from "@/src/lib/firebase/auth";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore";
import type { User } from "firebase/auth";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { useUserSession } from "../lib/hooks/use-user-session";

type Props = {
	initialUser: User | null;
};

export default function Header({ initialUser }: Props) {
	const user = useUserSession(initialUser);

	const handleSignOut: MouseEventHandler<HTMLButtonElement> = (event) => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn: MouseEventHandler<HTMLButtonElement> = (event) => {
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
								alt={user.email || "A placeholder user portrait"}
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
