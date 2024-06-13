"use client";

// This components handles the restaurant listings page
// It receives data from src/app/page.jsx, such as the initial restaurants and search params from the URL

import Filters from "@/src/components/filters";
import renderStars from "@/src/components/stars";
import {
	getRestaurantsSnapshot,
	type RestaurantDataWithId,
} from "@/src/lib/firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchParams } from "../global.type";
import type { Schema } from "../lib/firebase/firestore/schema";
import Pagination from "./pagination";

const RestaurantItem = ({
	restaurant,
}: { restaurant: RestaurantDataWithId }) => (
	<li key={restaurant.id}>
		<Link href={`/restaurant/${restaurant.id}`}>
			<ActiveResturant restaurant={restaurant} />
		</Link>
	</li>
);

const ActiveResturant = ({
	restaurant,
}: { restaurant: Schema["restaurants"]["Data"] }) => (
	<div>
		<ImageCover photo={restaurant.photo} name={restaurant.name} />
		<ResturantDetails restaurant={restaurant} />
	</div>
);

const ImageCover = ({ photo, name }: { photo: string; name: string }) => (
	<div className="image-cover">
		<Image src={photo} alt={name} width={300} height={300} />
	</div>
);

const ResturantDetails = ({
	restaurant,
}: { restaurant: Schema["restaurants"]["Data"] }) => (
	<div className="restaurant__details">
		<h2>{restaurant.name}</h2>
		<RestaurantRating restaurant={restaurant} />
		<RestaurantMetadata restaurant={restaurant} />
	</div>
);

const RestaurantRating = ({
	restaurant,
}: { restaurant: Schema["restaurants"]["Data"] }) => (
	<div className="restaurant__rating">
		<ul>{renderStars(restaurant.avgRating)}</ul>
		<span>({restaurant.numRatings})</span>
	</div>
);

const RestaurantMetadata = ({
	restaurant,
}: { restaurant: Schema["restaurants"]["Data"] }) => (
	<div className="restaurant__meta">
		<p>
			{restaurant.category} | {restaurant.city}
		</p>
		<p>{"$".repeat(restaurant.price)}</p>
	</div>
);

export default function RestaurantListings({
	initialRestaurants,
	searchParams,
}: {
	initialRestaurants: RestaurantDataWithId[];
	searchParams: SearchParams;
}) {
	const router = useRouter();

	// The initial filters are the search params from the URL, useful for when the user refreshes the page
	const initialFilters = {
		city: (searchParams.city as string) || "",
		category: (searchParams.category as string) || "",
		price: (searchParams.price as string) || "",
		sort: (searchParams.sort as string) || "",
	};

	const [restaurants, setRestaurants] = useState(initialRestaurants);
	const [filters, setFilters] = useState(initialFilters);

	useEffect(() => {
		routerWithFilters(router, filters);
	}, [filters, router]);

	useEffect(() => {
		const unsubscribe = getRestaurantsSnapshot((data) => {
			setRestaurants(data);
		}, filters);

		return () => {
			unsubscribe?.();
		};
	}, [filters]);

	return (
		<article>
			<Filters filters={filters} setFilters={setFilters} />
			<ul className="restaurants">
				{restaurants.map((restaurant) => (
					<RestaurantItem key={restaurant.id} restaurant={restaurant} />
				))}
			</ul>
			<Pagination />
		</article>
	);
}

function routerWithFilters(
	router: string[] | ReturnType<typeof useRouter>,
	filters: Record<string, unknown> | ArrayLike<unknown>,
) {
	const queryParams = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		if (typeof value === "string" && value !== "") {
			queryParams.append(key, value);
		}
	}

	const queryString = queryParams.toString();
	router.push(`?${queryString}`);
}
