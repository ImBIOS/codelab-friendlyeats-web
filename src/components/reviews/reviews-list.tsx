// This component handles the list of reviews for a given restaurant

import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore";
import type { Schema } from "@/src/lib/firebase/firestore/schema";
import { ReviewSkeleton } from "./review";
import ReviewsListClient from "./reviews-list-client";

type Props = {
	restaurantId: Schema["restaurants"]["Id"];
	userId: string;
};

export default async function ReviewsList({ restaurantId, userId }: Props) {
	const reviews = await getReviewsByRestaurantId(restaurantId);

	if (reviews)
		return (
			<ReviewsListClient
				initialReviews={reviews}
				restaurantId={restaurantId}
				userId={userId}
			/>
		);
	return null;
}

type ReviewsListSkeletonProps = {
	numReviews: number | undefined;
};

export function ReviewsListSkeleton({ numReviews }: ReviewsListSkeletonProps) {
	if (numReviews) {
		const incrementedNumberArr = Array.from(
			{ length: numReviews },
			(_, i) => i + 1,
		);
		return (
			<article>
				<ul className="reviews">
					<ul>
						{incrementedNumberArr.map((value) => (
							<ReviewSkeleton key={`loading-review-${value}`} />
						))}
					</ul>
				</ul>
			</article>
		);
	}

	return null;
}
