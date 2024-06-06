// This component shows restaurant metadata, and offers some actions to the user like uploading a new restaurant image, and adding a review.

import renderStars from "@/src/components/stars.jsx";
import type { ChangeEvent } from "react";

export type RestaurantDetail = {
	photo: string;
	name: string;
	avgRating: number;
	numRatings: number;
	category: string;
	city: string;
	price: number;
};

type Props = {
	restaurant: RestaurantDetail;
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
	return (
		<section className="img__section">
			<img src={restaurant.photo} alt={restaurant.name} />

			<div className="actions">
				{userId && (
					<img
						alt="Review"
						className="review"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
						onKeyDown={() => {
							setIsOpen(!isOpen);
						}}
						src="/review.svg"
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

					<img className="add-image" src="/add.svg" alt="Add file" />
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
};

export default RestaurantDetails;
