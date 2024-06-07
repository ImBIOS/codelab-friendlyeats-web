import Restaurant from "@/src/components/restaurant";
import {
	GeminiSummary,
	GeminiSummarySkeleton,
} from "@/src/components/reviews/review-summary";
import ReviewsList, {
	ReviewsListSkeleton,
} from "@/src/components/reviews/reviews-list";
import { getRestaurantById } from "@/src/lib/firebase/firestore";
import type { Schema } from "@/src/lib/firebase/firestore/schema";
import { getAuthenticatedAppForUser as getUser } from "@/src/lib/firebase/server-app";
import { Suspense } from "react";

type Props = {
	params: { id: Schema["restaurants"]["Id"] };
};

export default async function Home({ params }: Props) {
	// This is a server component, we can access URL
	// parameters via Next.js and download the data
	// we need for this page
	const { currentUser } = await getUser();
	const restaurant = await getRestaurantById(params.id);

	return (
		<main className="main__restaurant">
			<Restaurant
				id={params.id}
				initialRestaurant={restaurant}
				initialUserId={currentUser?.uid || ""}
			>
				<Suspense fallback={<GeminiSummarySkeleton />}>
					<GeminiSummary restaurantId={params.id} />
				</Suspense>
			</Restaurant>
			<Suspense
				fallback={<ReviewsListSkeleton numReviews={restaurant?.numRatings} />}
			>
				<ReviewsList restaurantId={params.id} userId={currentUser?.uid || ""} />
			</Suspense>
		</main>
	);
}
