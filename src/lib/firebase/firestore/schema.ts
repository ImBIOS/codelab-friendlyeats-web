import { schema, type Typesaurus } from "typesaurus";

// Generate the db object from given schem that you can use to access
// Firestore, i.e.:
//   await db.get(userId)
export const db = schema(($) => ({
	restaurants: $.collection<Restaurant>().sub({
		ratings: $.collection<Rating>(),
	}),
}));

// Infer schema type helper with shortcuts to types in your database:
//   function getUser(id: Schema["users"]["Id"]): Schema["users"]["Result"]
export type Schema = Typesaurus.Schema<typeof db>;

// Your model types:

type Restaurant = {
	avgRating: number;
	category: string;
	city: string;
	name: string;
	numRatings: number;
	photo: string;
	price: number;
	sumRating: number;
	timestamp: Typesaurus.ServerDate;
};

type Rating = {
	rating: number;
	text: string;
	userId: string;
	timestamp: Typesaurus.ServerDate;
};
