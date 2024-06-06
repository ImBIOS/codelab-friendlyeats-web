import { generateFakeRestaurantsAndReviews } from "@/src/lib/fake-restaurants";

import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	where,
	type Firestore,
} from "firebase/firestore";

import type { ReviewProps } from "@/src/components/reviews/review";
import { db } from "@/src/lib/firebase/client-app";
import type { SetStateAction } from "react";
import { db as newDb, type Schema } from "./db";

export async function updateRestaurantImageReference(
	restaurantId: Schema["restaurants"]["Id"],
	publicImageUrl: string,
) {
	// const restaurantRef = doc(collection(db, "restaurants"), restaurantId);
	// if (restaurantRef) {
	// 	await updateDoc(restaurantRef, { photo: publicImageUrl });
	// }
	const restaurantRef = newDb.restaurants.ref(restaurantId);
	if (restaurantRef) {
		await newDb.restaurants.update(restaurantId, { photo: publicImageUrl });
	}
}

const updateWithRating = async (
	transaction,
	docRef,
	newRatingDocument,
	review,
) => {
	const restaurant = await transaction.get(docRef);
	const data = restaurant.data();
	const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
	const newSumRating = (data?.sumRating || 0) + Number(review.rating);
	const newAverage = newSumRating / newNumRatings;

	transaction.update(docRef, {
		numRatings: newNumRatings,
		sumRating: newSumRating,
		avgRating: newAverage,
	});

	transaction.set(newRatingDocument, {
		...review,
		timestamp: Timestamp.fromDate(new Date()),
	});
};

export async function addReviewToRestaurant(
	db: Firestore,
	restaurantId: string,
	review,
) {
	if (!restaurantId) {
		throw new Error("No restaurant ID has been provided.");
	}

	if (!review) {
		throw new Error("A valid review has not been provided.");
	}

	try {
		const docRef = doc(collection(db, "restaurants"), restaurantId);
		const newRatingDocument = doc(
			collection(db, `restaurants/${restaurantId}/ratings`),
		);

		// corrected line
		await runTransaction(db, (transaction) =>
			updateWithRating(transaction, docRef, newRatingDocument, review),
		);
	} catch (error) {
		console.error(
			"There was an error adding the rating to the restaurant",
			error,
		);
		throw error;
	}
}

function applyQueryFilters(originalQuery, { category, city, price, sort }) {
	let updatedQuery = originalQuery;
	if (category) {
		updatedQuery = query(updatedQuery, where("category", "==", category));
	}
	if (city) {
		updatedQuery = query(updatedQuery, where("city", "==", city));
	}
	if (price) {
		updatedQuery = query(updatedQuery, where("price", "==", price.length));
	}
	if (sort === "Rating" || !sort) {
		updatedQuery = query(updatedQuery, orderBy("avgRating", "desc"));
	} else if (sort === "Review") {
		updatedQuery = query(updatedQuery, orderBy("numRatings", "desc"));
	}
	return updatedQuery;
}

export async function getRestaurants(db = db, filters = {}) {
	let q = query(collection(db, "restaurants"));

	q = applyQueryFilters(q, filters);
	const results = await getDocs(q);
	return results.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data(),
			// Only plain objects can be passed to Client Components from Server Components
			timestamp: doc.data().timestamp.toDate(),
		};
	});
}

export function getRestaurantsSnapshot(cb, filters = {}) {
	if (typeof cb !== "function") {
		console.log("Error: The callback parameter is not a function");
		return;
	}

	let q = query(collection(db, "restaurants"));
	q = applyQueryFilters(q, filters);

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const results = querySnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
				// Only plain objects can be passed to Client Components from Server Components
				timestamp: doc.data().timestamp.toDate(),
			};
		});

		cb(results);
	});

	return unsubscribe;
}

export async function getRestaurantById(db: Firestore, restaurantId: string) {
	if (!restaurantId) {
		console.log("Error: Invalid ID received: ", restaurantId);
		return;
	}
	const docRef = doc(db, "restaurants", restaurantId);
	const docSnap = await getDoc(docRef);
	return {
		...docSnap.data(),
		timestamp: docSnap.data()?.timestamp.toDate(),
	};
}

export function getRestaurantSnapshotById(restaurantId: string, cb) {
	if (!restaurantId) {
		console.log("Error: Invalid ID received: ", restaurantId);
		return;
	}
	const docRef = doc(db, "restaurants", restaurantId);
	const unsubscribe = onSnapshot(docRef, (docSnap) => {
		cb({
			...docSnap.data(),
			timestamp: docSnap.data().timestamp.toDate(),
		});
	});
	return unsubscribe;
}

export async function getReviewsByRestaurantId(
	// db: Firestore,
	restaurantId: Schema["restaurants"]["Id"],
) {
	// if (!restaurantId) {
	// 	console.log("Error: Invalid restaurantId received: ", restaurantId);
	// 	return;
	// }

	// const q = query(
	// 	collection(db, "restaurants", restaurantId, "ratings"),
	// 	orderBy("timestamp", "desc"),
	// );

	// const results = await getDocs(q);
	// return results.docs.map((doc) => {
	// 	return {
	// 		id: doc.id,
	// 		...doc.data(),
	// 		// Only plain objects can be passed to Client Components from Server Components
	// 		timestamp: doc.data().timestamp.toDate(),
	// 	};
	// });

	if (!restaurantId) {
		console.error("Error: Invalid restaurantId received: ", restaurantId);
		return;
	}

	const results = await newDb
		.restaurants(restaurantId)
		.ratings.query(($) => [$.field("timestamp").order("desc"), $.limit(10)]);
	return results;
}

export function getReviewsSnapshotByRestaurantId(
	restaurantId: Schema["restaurants"]["Id"],
	cb: (data: SetStateAction<ReviewProps["data"][]>) => void,
) {
	// if (!restaurantId) {
	// 	console.log("Error: Invalid restaurantId received: ", restaurantId);
	// 	return;
	// }
	// const q = query(
	// 	collection(db, "restaurants", restaurantId, "ratings"),
	// 	orderBy("timestamp", "desc"),
	// );
	// const unsubscribe = onSnapshot(q, (querySnapshot) => {
	// 	const results = querySnapshot.docs.map((doc) => {
	// 		return {
	// 			id: doc.id,
	// 			...doc.data(),
	// 			// Only plain objects can be passed to Client Components from Server Components
	// 			timestamp: doc.data().timestamp.toDate(),
	// 		};
	// 	});
	// 	cb(results);
	// });
	// return unsubscribe;

	if (!restaurantId) {
		console.error("Error: Invalid restaurantId received: ", restaurantId);
		return;
	}

	const unsubscribe = newDb
		.restaurants(restaurantId)
		.ratings.query(($) => [$.field("timestamp").order("desc"), $.limit(10)])
		.on((ratings) => {
			const results = ratings.map((rating) => {
				return {
					id: rating.ref.id,
					...rating.data,
					timestamp: rating.data.timestamp,
				};
			});
			cb(results);
		});

	return unsubscribe;
}

export async function addFakeRestaurantsAndReviews() {
	const data = await generateFakeRestaurantsAndReviews();
	for (const { restaurantData, ratingsData } of data) {
		try {
			const docRef = await addDoc(
				collection(db, "restaurants"),
				restaurantData,
			);

			for (const ratingData of ratingsData) {
				await addDoc(
					collection(db, "restaurants", docRef.id, "ratings"),
					ratingData,
				);
			}
		} catch (e) {
			console.log("There was an error adding the document");
			console.error("Error adding document: ", e);
		}
	}
}
