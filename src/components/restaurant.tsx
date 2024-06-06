"use client";

// This components shows one individual restaurant
// It receives data from src/app/restaurant/[id]/page.jsx

import RestaurantDetails, {
	type RestaurantDetail,
} from "@/src/components/restaurant-details.jsx";
import { getRestaurantSnapshotById } from "@/src/lib/firebase/firestore";
import { updateRestaurantImage } from "@/src/lib/firebase/storage";
import { useUser } from "@/src/lib/hooks/use-user";
import dynamic from "next/dynamic";
import {
	Suspense,
	useEffect,
	useState,
	type ChangeEvent,
	type SetStateAction,
} from "react";

const ReviewDialog = dynamic(
	() => import("@/src/components/review-dialog.jsx"),
);

type Props = {
	id: string;
	initialRestaurant: RestaurantDetail;
	initialUserId: string;
	children: React.ReactNode;
};

export default function Restaurant({
	id,
	initialRestaurant,
	initialUserId,
	children,
}: Props) {
	const [restaurantDetail, setRestaurantDetail] =
		useState<RestaurantDetail>(initialRestaurant);
	const [isOpen, setIsOpen] = useState(false);

	// The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
	const userId = useUser()?.uid || initialUserId;
	const [review, setReview] = useState({
		rating: 0,
		text: "",
	});

	const onChange = (value: string | number, name: string) => {
		setReview({ ...review, [name]: value });
	};

	async function handleRestaurantImage(event: ChangeEvent<HTMLInputElement>) {
		const image = event.target.files ? event.target.files[0] : null;
		if (!image) {
			return;
		}

		const imageURL = (await updateRestaurantImage(id, image)) ?? "";
		setRestaurantDetail({ ...restaurantDetail, photo: imageURL });
	}

	const handleClose = () => {
		setIsOpen(false);
		setReview({ rating: 0, text: "" });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const unsubscribeFromRestaurant = getRestaurantSnapshotById(
			id,
			(data: SetStateAction<RestaurantDetail>) => {
				setRestaurantDetail(data);
			},
		);

		return () => {
			if (unsubscribeFromRestaurant) unsubscribeFromRestaurant();
		};
	}, []);

	return (
		<>
			<RestaurantDetails
				restaurant={restaurantDetail}
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
