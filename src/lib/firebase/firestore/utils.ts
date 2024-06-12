import { db } from "./schema";

export type QueryRestaurantsOptions = {
	category?: string;
	city?: string;
	price?: string;
	sort?: string;
	limit?: number;
};

export function queryRestaurants({
	category,
	city,
	price,
	sort,
	limit = 10,
}: QueryRestaurantsOptions) {
	const $ = db.restaurants.query.build();

	if (category) {
		$.field("category").eq(category);
	}
	if (city) {
		$.field("city").eq(city);
	}
	if (price) {
	}
	if (sort === "Rating" || !sort) {
		$.field("avgRating").order("desc");
	} else if (sort === "Review") {
		$.field("numRatings").order("desc");
	}
	$.limit(limit);

	return $;
}
