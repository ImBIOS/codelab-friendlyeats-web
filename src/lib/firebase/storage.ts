import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { storage } from "@/src/lib/firebase/client-app";

import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore";
import type { Schema } from "./firestore/schema";

export async function updateRestaurantImage(
	restaurantId: Schema["restaurants"]["Id"],
	image: File,
) {
	try {
		if (!restaurantId) throw new Error("No restaurant ID has been provided.");

		if (!image || !image.name)
			throw new Error("A valid image has not been provided.");

		const publicImageUrl = await uploadImage(restaurantId, image);
		await updateRestaurantImageReference(restaurantId, publicImageUrl);

		return publicImageUrl;
	} catch (error) {
		console.error("Error processing request:", error);
	}
}

async function uploadImage(
	restaurantId: Schema["restaurants"]["Id"],
	image: File,
) {
	const filePath = `images/${restaurantId}/${image.name}`;
	const newImageRef = ref(storage, filePath);
	await uploadBytesResumable(newImageRef, image);

	return await getDownloadURL(newImageRef);
}
