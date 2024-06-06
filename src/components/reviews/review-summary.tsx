import { env } from "@/src/env";
import type { Schema } from "@/src/lib/firebase/db";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Props = {
	restaurantId: Schema["restaurants"]["Id"];
};

export async function GeminiSummary({ restaurantId }: Props) {
	// const { firebaseServerApp } = await getAuthenticatedAppForUser();
	const reviews = await getReviewsByRestaurantId(
		// getFirestore(firebaseServerApp),
		restaurantId,
	);

	const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const reviewSeparator = "@";
	const prompt = `
      Based on the following restaurant reviews,
      where each review is separated by a '${reviewSeparator}' character,
      create a one-sentence summary of what people think of the restaurant.

      Here are the reviews: ${reviews
				?.map((review) => review.data.text)
				.join(reviewSeparator)}
  `;

	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();

		return (
			<div className="restaurant__review_summary">
				<p>{text}</p>
				<p>✨ Summarized with Gemini</p>
			</div>
		);
	} catch (e) {
		console.error(e);
		return <p>Error contacting Gemini</p>;
	}
}

export function GeminiSummarySkeleton() {
	return (
		<div className="restaurant__review_summary">
			<p>✨ Summarizing reviews with Gemini...</p>
		</div>
	);
}
