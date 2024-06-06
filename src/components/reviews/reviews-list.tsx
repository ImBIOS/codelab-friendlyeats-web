// This component handles the list of reviews for a given restaurant

import type { Schema } from "@/src/lib/firebase/db";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore";
import { ReviewSkeleton } from "./review";
import ReviewsListClient from "./reviews-list-client";

type Props = {
	restaurantId: Schema["restaurants"]["Id"];
	userId: string;
};

export default async function ReviewsList({ restaurantId, userId }: Props) {
	// const { firebaseServerApp } = await getAuthenticatedAppForUser();
	const reviews = await getReviewsByRestaurantId(
		// getFirestore(firebaseServerApp),
		restaurantId,
	);

	return (
		<ReviewsListClient
			initialReviews={reviews}
			restaurantId={restaurantId}
			userId={userId}
		/>
	);
}

type ReviewsListSkeletonProps = {
	numReviews: number;
};

export function ReviewsListSkeleton({ numReviews }: ReviewsListSkeletonProps) {
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
