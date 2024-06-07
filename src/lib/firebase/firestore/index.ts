import { generateFakeRestaurantsAndReviews } from "@/src/lib/fake-restaurants";

import type { ReviewProps } from "@/src/components/reviews/review";
// import { db } from "@/src/lib/firebase/client-app";
import type { SetStateAction } from "react";
import { transaction } from "typesaurus";
import { db as newDb, type Schema } from "./schema";
import { applyQueryFilters } from "./utils";

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

// const updateWithRating = async (
// 	// transaction,
// 	docRef: string,
// 	newRatingDocument: string,
// 	review: Omit<Schema["restaurants"]["sub"]["ratings"]["Data"], "timestamp">,
// ) => {
// 	const restaurant = await transaction.get(docRef);
// 	const data = restaurant.data();
// 	const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
// 	const newSumRating = (data?.sumRating || 0) + Number(review.rating);
// 	const newAverage = newSumRating / newNumRatings;

// 	// transaction.update(docRef, {
// 	// 	numRatings: newNumRatings,
// 	// 	sumRating: newSumRating,
// 	// 	avgRating: newAverage,
// 	// });

// 	// transaction.set(newRatingDocument, {
// 	// 	...review,
// 	// 	timestamp: Timestamp.fromDate(new Date()),
// 	// });
// 	transaction(newDb)
// 		.read(($) => $.db.restaurants.get(docRef))
// 		.write(($) => {
// 			const restaurant = $.result;
// 			if (!restaurant) return;
// 			restaurant.update({
// 				numRatings: newNumRatings,
// 				sumRating: newSumRating,
// 				avgRating: newAverage,
// 			});
// 		});

// 	transaction(newDb, { as: "server" })
// 		.read(($) => $.db.restaurants(docRef).ratings.get(newRatingDocument))
// 		.write(($) => {
// 			const rating = $.result;
// 			if (!rating) return;
// 			rating.set({
// 				...review,
// 				timestamp: Timestamp.fromDate(new Date()),
// 			});
// 		});
// };

export async function addReviewToRestaurant(
	// db: Firestore,
	restaurantId: Schema["restaurants"]["Id"],
	review: Omit<Schema["restaurants"]["sub"]["ratings"]["Data"], "timestamp">,
) {
	if (!restaurantId) {
		throw new Error("No restaurant ID has been provided.");
	}

	if (!review) {
		throw new Error("A valid review has not been provided.");
	}

	try {
		// const docRef = doc(collection(db, "restaurants"), restaurantId);
		// const newRatingDocument = doc(
		// 	collection(db, `restaurants/${restaurantId}/ratings`),
		// );

		// // corrected line
		// await runTransaction(db, (transaction) =>
		// 	updateWithRating(transaction, docRef, newRatingDocument, review),
		// );

		// Update the restaurant's rating
		transaction(newDb)
			.read(($) => $.db.restaurants.get(restaurantId))
			.write(($) => {
				const restaurant = $.result;
				if (!restaurant) return;
				const data = restaurant.data;
				const newNumRatings = data.numRatings ? data.numRatings + 1 : 1;
				const newSumRating = (data.sumRating || 0) + Number(review.rating);
				const newAverage = newSumRating / newNumRatings;
				restaurant.update({
					numRatings: newNumRatings,
					sumRating: newSumRating,
					avgRating: newAverage,
				});
			});

		// Add the review to the restaurant
		await newDb.restaurants(restaurantId).ratings.add(($) => ({
			...review,
			timestamp: $.serverDate(),
		}));
	} catch (error) {
		console.error(
			"There was an error adding the rating to the restaurant",
			error,
		);
		throw error;
	}
}

export type RestaurantDataWithId = Schema["restaurants"]["Data"] & {
	id: Schema["restaurants"]["Id"];
};

export function getRestaurantsSnapshot(
	cb: (data: RestaurantDataWithId[]) => void,
	filters = {},
) {
	if (typeof cb !== "function") {
		console.log("Error: The callback parameter is not a function");
		return;
	}

	// let q = query(collection(db, "restaurants"));
	// q = applyQueryFilters(q, filters);

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

	const unsubscribe = applyQueryFilters(filters)
		.run()
		.on((restaurants) => {
			const results = restaurants.map((restaurant) => ({
				id: restaurant.ref.id,
				...restaurant.data,
			}));
			cb(results);
		});

	return unsubscribe;
}

export async function getRestaurantById(
	// db: Firestore,
	restaurantId: Schema["restaurants"]["Id"],
) {
	// if (!restaurantId) {
	// 	console.log("Error: Invalid ID received: ", restaurantId);
	// 	return;
	// }
	// const docRef = doc(db, "restaurants", restaurantId);
	// const docSnap = await getDoc(docRef);
	// return {
	// 	...docSnap.data(),
	// 	timestamp: docSnap.data()?.timestamp.toDate(),
	// };

	if (!restaurantId) {
		console.error("Error: Invalid ID received: ", restaurantId);
		return;
	}
	const result = await newDb.restaurants.get(restaurantId);
	const data = result?.data;
	return data;
}

export function getRestaurantSnapshotById(
	restaurantId: Schema["restaurants"]["Id"],
	cb: (data: Schema["restaurants"]["Data"] | undefined) => void,
) {
	if (!restaurantId) {
		console.log("Error: Invalid ID received: ", restaurantId);
		return;
	}
	// const docRef = doc(db, "restaurants", restaurantId);
	// const unsubscribe = onSnapshot(docRef, (docSnap) => {
	// 	cb({
	// 		...docSnap.data(),
	// 		timestamp: docSnap.data().timestamp.toDate(),
	// 	});
	// });
	// return unsubscribe;
	const unsubscribe = newDb.restaurants.get(restaurantId).on((restaurant) => {
		cb(restaurant?.data);
	});
	return unsubscribe;
}

export async function getRestaurants(
	// db = db,
	filters = {},
) {
	// let q = query(collection(db, "restaurants"));

	// q = applyQueryFilters(q, filters);
	// const results = await getDocs(q);
	// return results.docs.map((doc) => {
	// 	return {
	// 		id: doc.id,
	// 		...doc.data(),
	// 		// Only plain objects can be passed to Client Components from Server Components
	// 		timestamp: doc.data().timestamp.toDate(),
	// 	};
	// });

	const results = await applyQueryFilters(filters).run();
	return results.map((restaurant) => ({
		id: restaurant.ref.id,
		...restaurant.data,
	}));
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
	const data = results.map((rating) => ({ ...rating.data }));
	return data;
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
			// const docRef = await addDoc(
			// 	collection(db, "restaurants"),
			// 	restaurantData,
			// );

			// for (const ratingData of ratingsData) {
			// 	await addDoc(
			// 		collection(db, "restaurants", docRef.id, "ratings"),
			// 		ratingData,
			// 	);
			// }
			const restaurantRef = await newDb.restaurants.add(($) => ({
				...restaurantData,
				timestamp: $.serverDate(),
			}));
			for (const ratingData of ratingsData) {
				await newDb.restaurants(restaurantRef.id).ratings.add(($) => ({
					...ratingData,
					timestamp: $.serverDate(),
				}));
			}
		} catch (e) {
			console.log("There was an error adding the document");
			console.error("Error adding document: ", e);
		}
	}
}