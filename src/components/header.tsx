"use client";
import { signInWithGoogle, signOut } from "@/src/lib/firebase/auth";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore";
import type { User } from "firebase/auth";
import Image from "next/image";
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
		void signOut();
	};

	const handleSignIn: MouseEventHandler<HTMLButtonElement> = (event) => {
		event.preventDefault();
		void signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				<Image
					src="/friendly-eats.svg"
					alt="FriendlyEats"
					width={35}
					height={32}
				/>
				Friendly Eats
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<Image
								className="profileImage"
								src={user.photoURL ?? "/profile.svg"}
								alt={user.email ?? "A placeholder user portrait"}
								width={32}
								height={32}
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
						<Image
							src="/profile.svg"
							alt="A placeholder user portrait"
							width={32}
							height={32}
						/>
						Sign In with Google
					</button>
				</div>
			)}
		</header>
	);
}
