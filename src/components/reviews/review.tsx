import renderStars from "@/src/components/stars";
import type { Schema } from "@/src/lib/firebase/firestore/schema";

export type ReviewProps = {
	data: Schema["restaurants"]["sub"]["ratings"]["Data"];
};

export function Review({ data }: ReviewProps) {
	const timestamp =
		typeof data.timestamp === "string"
			? new Date(data.timestamp)
			: data.timestamp;
	return (
		<li className="review__item">
			<ul className="restaurant__rating">{renderStars(data.rating)}</ul>
			<p>{data.text}</p>

			<time>
				{data.timestamp &&
					new Intl.DateTimeFormat("en-GB", {
						dateStyle: "medium",
					}).format(timestamp ?? new Date())}
			</time>
		</li>
	);
}

export function ReviewSkeleton() {
	return (
		<li className="review__item">
			<div className="restaurant__rating">
				<div
					style={{
						height: "2rem",
						backgroundColor: "rgb(156 163 175)",
						width: "10rem",
					}}
				/>
			</div>
			<div
				style={{
					height: "19px",
					backgroundColor: "rgb(156 163 175)",
					width: "12rem",
				}}
			/>
			<p>{"   "}</p>
		</li>
	);
}
