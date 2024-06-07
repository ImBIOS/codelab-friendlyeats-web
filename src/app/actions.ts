"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore";
import type { Schema } from "../lib/firebase/firestore/schema";

// This is a Server Action
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
export async function handleReviewFormSubmission(data: FormData) {
	// const { app } = await getAuthenticatedAppForUser();
	// const db = getFirestore(app);

	await addReviewToRestaurant(
		// db,
		data.get("restaurantId") as Schema["restaurants"]["Id"],
		{
			text: data.get("text") as string,
			rating: Number(data.get("rating")),

			// This came from a hidden form field.
			userId: data.get("userId") as string,
		},
	);
}
