import { env } from "@/src/env";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore";
import type { Schema } from "@/src/lib/firebase/firestore/schema";
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";

type Props = {
	restaurantId: Schema["restaurants"]["Id"];
};

export async function GeminiSummary({ restaurantId }: Props) {
	const reviews = await getReviewsByRestaurantId(restaurantId);

	const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({
		model: "gemini-pro",
		safetySettings: [
			{
				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
			{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
			{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
			{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
		],
	});

	const reviewSeparator = "@";
	const prompt = `
      Based on the following restaurant reviews,
      where each review is separated by a '${reviewSeparator}' character,
      create a one-sentence summary of what people think of the restaurant.

      Here are the reviews: ${reviews
				?.map((review) => review.text)
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
