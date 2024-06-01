"use client";

// This components shows one individual restaurant
// It receives data from src/app/restaurant/[id]/page.jsx

import RestaurantDetails from "@/src/components/RestaurantDetails.jsx";
import { getRestaurantSnapshotById } from "@/src/lib/firebase/firestore.js";
import { updateRestaurantImage } from "@/src/lib/firebase/storage.js";
import { useUser } from "@/src/lib/getUser";
import dynamic from "next/dynamic";
import { React, Suspense, useEffect, useState } from "react";

const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

export default function Restaurant({
	id,
	initialRestaurant,
	initialUserId,
	children,
}) {
	const [restaurantDetails, setRestaurantDetails] = useState(initialRestaurant);
	const [isOpen, setIsOpen] = useState(false);

	// The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
	const userId = useUser()?.uid || initialUserId;
	const [review, setReview] = useState({
		rating: 0,
		text: "",
	});

	const onChange = (value, name) => {
		setReview({ ...review, [name]: value });
	};

	async function handleRestaurantImage(target) {
		const image = target.files ? target.files[0] : null;
		if (!image) {
			return;
		}

		const imageURL = await updateRestaurantImage(id, image);
		setRestaurantDetails({ ...restaurant, photo: imageURL });
	}

	const handleClose = () => {
		setIsOpen(false);
		setReview({ rating: 0, text: "" });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const unsubscribeFromRestaurant = getRestaurantSnapshotById(id, (data) => {
			setRestaurantDetails(data);
		});

		return () => {
			unsubscribeFromRestaurant();
		};
	}, []);

	return (
		<>
			<RestaurantDetails
				restaurant={restaurantDetails}
				userId={userId}
				handleRestaurantImage={handleRestaurantImage}
				setIsOpen={setIsOpen}
				isOpen={isOpen}
			>
				{children}
			</RestaurantDetails>
			{userId && (
				<Suspense fallback={<p>Loading...</p>}>
					<ReviewDialog
						isOpen={isOpen}
						handleClose={handleClose}
						review={review}
						onChange={onChange}
						userId={userId}
						id={id}
					/>
				</Suspense>
			)}
		</>
	);
}
