import { db } from "./schema";

export function applyQueryFilters({
	category,
	city,
	price,
	sort,
}: {
	category?: string;
	city?: string;
	price?: string;
	sort?: string;
}) {
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
	$.limit(10);
	return $;
}
