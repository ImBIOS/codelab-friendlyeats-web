// This component shows restaurant metadata, and offers some actions to the user like uploading a new restaurant image, and adding a review.

import renderStars from "@/src/components/stars";
import Image from "next/image";
import type { ChangeEvent } from "react";
import type { Schema } from "../lib/firebase/firestore/schema";

type Props = {
	restaurant: Schema["restaurants"]["Data"] | undefined;
	userId: string;
	handleRestaurantImage: (event: ChangeEvent<HTMLInputElement>) => void;
	setIsOpen: (isOpen: boolean) => void;
	isOpen: boolean;
	children: React.ReactNode;
};

const RestaurantDetails = ({
	restaurant,
	userId,
	handleRestaurantImage,
	setIsOpen,
	isOpen,
	children,
}: Props) => {
	if (restaurant)
		return (
			<section className="img__section">
				<Image src={restaurant.photo} alt={restaurant.name} fill />

				<div className="actions">
					{userId && (
						<Image
							alt="Review"
							className="review"
							onClick={() => {
								setIsOpen(!isOpen);
							}}
							onKeyDown={() => {
								setIsOpen(!isOpen);
							}}
							src="/review.svg"
							width={64}
							height={64}
						/>
					)}
					<label htmlFor="upload-image" className="add">
						<input
							name=""
							type="file"
							id="upload-image"
							className="file-input hidden w-full h-full"
							onChange={(event) => handleRestaurantImage(event)}
						/>

						<Image
							className="add-image"
							src="/add.svg"
							alt="Add file"
							width={64}
							height={64}
						/>
					</label>
				</div>

				<div className="details__container">
					<div className="details">
						<h2>{restaurant.name}</h2>

						<div className="restaurant__rating">
							<ul>{renderStars(restaurant.avgRating)}</ul>

							<span>({restaurant.numRatings})</span>
						</div>

						<p>
							{restaurant.category} | {restaurant.city}
						</p>
						<p>{"$".repeat(restaurant.price)}</p>
						{children}
					</div>
				</div>
			</section>
		);

	return null;
};

export default RestaurantDetails;
