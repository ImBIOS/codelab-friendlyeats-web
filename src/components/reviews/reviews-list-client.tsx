"use client";

import { Review, type ReviewProps } from "@/src/components/reviews/review";
import { getReviewsSnapshotByRestaurantId } from "@/src/lib/firebase/firestore";
import type { Schema } from "@/src/lib/firebase/firestore/schema";
import { useEffect, useState, type SetStateAction } from "react";

type Props = {
	initialReviews: ReviewProps["data"][];
	restaurantId: Schema["restaurants"]["Id"];
	userId: string;
};

export default function ReviewsListClient({
	initialReviews,
	restaurantId,
	userId,
}: Props) {
	const [reviews, setReviews] = useState(initialReviews);

	useEffect(() => {
		return getReviewsSnapshotByRestaurantId(
			restaurantId,
			(data: SetStateAction<ReviewProps["data"][]>) => {
				setReviews(data);
			},
		);
	}, [restaurantId]);
	return (
		<article>
			<ul className="reviews">
				{reviews.length > 0 ? (
					<ul>
						{reviews.map((review) => (
							<Review
								key={`${review.userId}-${review.text}-${review.rating}`}
								data={review}
							/>
						))}
					</ul>
				) : (
					<p>
						This restaurant has not been reviewed yet,{" "}
						{!userId ? "first login and then" : ""} add your own review!
					</p>
				)}
			</ul>
		</article>
	);
}
