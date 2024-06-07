import { db } from "./schema";

export function applyQueryFilters(
	// originalQuery,
	{
		category,
		city,
		price,
		sort,
	}: {
		category?: string;
		city?: string;
		price?: string;
		sort?: string;
	},
) {
	// let updatedQuery = originalQuery;
	const $ = db.restaurants.query.build();
	// if (category) {
	// 	updatedQuery = query(updatedQuery, where("category", "==", category));
	// }
	// if (city) {
	// 	updatedQuery = query(updatedQuery, where("city", "==", city));
	// }
	// if (price) {
	// 	updatedQuery = query(updatedQuery, where("price", "==", price.length));
	// }
	// if (sort === "Rating" || !sort) {
	// 	updatedQuery = query(updatedQuery, orderBy("avgRating", "desc"));
	// } else if (sort === "Review") {
	// 	updatedQuery = query(updatedQuery, orderBy("numRatings", "desc"));
	// }
	if (category) {
		// updatedQuery = query(updatedQuery, where("category", "==", category));
		$.field("category").eq(category);
	}
	if (city) {
		// updatedQuery = query(updatedQuery, where("city", "==", city));
		$.field("city").eq(city);
	}
	if (price) {
		// updatedQuery = query(updatedQuery, where("price", "==", price.length));
	}
	if (sort === "Rating" || !sort) {
		// updatedQuery = query(updatedQuery, orderBy("avgRating", "desc"));
		$.field("avgRating").order("desc");
	} else if (sort === "Review") {
		// updatedQuery = query(updatedQuery, orderBy("numRatings", "desc"));
		$.field("numRatings").order("desc");
	}
	return $;
}
