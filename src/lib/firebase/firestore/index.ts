import { generateFakeRestaurantsAndReviews } from "@/src/lib/fake-restaurants";

import type { ReviewProps } from "@/src/components/reviews/review";
import { revalidateTag, unstable_cache } from "next/cache";
import type { SetStateAction } from "react";
import { transaction } from "typesaurus";
import { db as newDb, type Schema } from "./schema";
import { applyQueryFilters } from "./utils";

export async function updateRestaurantImageReference(
	restaurantId: Schema["restaurants"]["Id"],
	publicImageUrl: string,
) {
	const restaurantRef = newDb.restaurants.ref(restaurantId);
	if (restaurantRef) {
		await newDb.restaurants.update(restaurantId, { photo: publicImageUrl });
	}
}

export async function addReviewToRestaurant(
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

		revalidateTag("getRestaurants");
		revalidateTag("getReviewsByRestaurantId");
		revalidateTag("getRestaurantById");
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

const getRestaurantByIdImpl = async (
	restaurantId: Schema["restaurants"]["Id"],
) => {
	if (!restaurantId) {
		console.error("Error: Invalid ID received: ", restaurantId);
		return;
	}
	const result = await newDb.restaurants.get(restaurantId);
	const data = result?.data;
	return data;
};

export const getRestaurantById = unstable_cache(
	getRestaurantByIdImpl,
	["getRestaurantById"],
	{
		tags: ["getRestaurantById"],
		revalidate: 86_400,
	},
);

export function getRestaurantSnapshotById(
	restaurantId: Schema["restaurants"]["Id"],
	cb: (data: Schema["restaurants"]["Data"] | undefined) => void,
) {
	if (!restaurantId) {
		console.log("Error: Invalid ID received: ", restaurantId);
		return;
	}
	const unsubscribe = newDb.restaurants.get(restaurantId).on((restaurant) => {
		cb(restaurant?.data);
	});
	return unsubscribe;
}

const getRestaurantsImpl = async (filters = {}) => {
	const results = await applyQueryFilters(filters).run();
	return results.map((restaurant) => ({
		id: restaurant.ref.id,
		...restaurant.data,
	}));
};

export const getRestaurants = unstable_cache(
	getRestaurantsImpl,
	["getRestaurants"],
	{
		tags: ["getRestaurants"],
		revalidate: 86_400,
	},
);

const getReviewsByRestaurantIdImpl = async (
	restaurantId: Schema["restaurants"]["Id"],
) => {
	if (!restaurantId) {
		console.error("Error: Invalid restaurantId received: ", restaurantId);
		return;
	}

	const results = await newDb
		.restaurants(restaurantId)
		.ratings.query(($) => [$.field("timestamp").order("desc"), $.limit(10)]);
	const data = results.map((rating) => ({ ...rating.data }));
	return data;
};

export const getReviewsByRestaurantId = unstable_cache(
	getReviewsByRestaurantIdImpl,
	["getReviewsByRestaurantId"],
	{
		tags: ["getReviewsByRestaurantId"],
		revalidate: 86_400,
	},
);

export function getReviewsSnapshotByRestaurantId(
	restaurantId: Schema["restaurants"]["Id"],
	cb: (data: SetStateAction<ReviewProps["data"][]>) => void,
) {
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
			revalidateTag("getRestaurants");
		} catch (e) {
			console.log("There was an error adding the document");
			console.error("Error adding document: ", e);
		}
	}
}
