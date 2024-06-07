import RestaurantListings from "@/src/components/restaurant-listings";
import type { SearchParams } from "../global.type";
import { getRestaurants } from "../lib/firebase/firestore";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

type Props = {
	searchParams: SearchParams;
};

// This line also forces this route to be server-side rendered
// export const revalidate = 0;

export default async function Home({ searchParams }: Props) {
	// Using seachParams which Next.js provides, allows the filtering to happen on the server-side, for example:
	// ?city=London&category=Indian&sort=Review
	// const { firebaseServerApp } = await getAuthenticatedAppForUser();
	const restaurants = await getRestaurants(
		// getFirestore(firebaseServerApp),
		searchParams,
	);
	return (
		<main className="main__home">
			<RestaurantListings
				initialRestaurants={restaurants}
				searchParams={searchParams}
			/>
		</main>
	);
}
