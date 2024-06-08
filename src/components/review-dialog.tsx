"use client";

// This components handles the review dialog and uses a next.js feature known as Server Actions to handle the form submission

import { handleReviewFormSubmission } from "@/src/app/actions";
import RatingPicker from "@/src/components/rating-picker";
import { useLayoutEffect, useRef, type MouseEventHandler } from "react";

type Props = {
	isOpen: boolean;
	handleClose: () => void;
	review: {
		rating: number;
		text: string;
	};
	onChange: (value: string | number, name: string) => void;
	userId: string;
	id: string;
};

const ReviewDialog = ({
	isOpen,
	handleClose,
	review,
	onChange,
	userId,
	id,
}: Props) => {
	const dialog = useRef<HTMLDialogElement>(null);

	// dialogs only render their backdrop when called with `showModal`
	useLayoutEffect(() => {
		if (isOpen) {
			dialog.current?.showModal();
		} else {
			dialog.current?.close();
		}
	}, [isOpen]);

	const handleClick: MouseEventHandler<HTMLDialogElement> = (e) => {
		// close if clicked outside the modal
		if (e.target === dialog.current) {
			handleClose();
		}
	};

	return (
		<dialog ref={dialog} onMouseDown={handleClick}>
			<form
				action={handleReviewFormSubmission}
				onSubmit={() => {
					handleClose();
				}}
			>
				<header>
					<h3>Add your review</h3>
				</header>
				<article>
					<RatingPicker />

					<p>
						<input
							type="text"
							name="text"
							id="review"
							placeholder="Write your thoughts here"
							required
							value={review.text}
							onChange={(e) => onChange(e.target.value, "text")}
						/>
					</p>

					<input type="hidden" name="restaurantId" value={id} />
					<input type="hidden" name="userId" value={userId} />
				</article>
				<footer>
					<menu>
						<button
							type="reset"
							onClick={handleClose}
							className="button--cancel"
						>
							Cancel
						</button>
						<button type="submit" value="confirm" className="button--confirm">
							Submit
						</button>
					</menu>
				</footer>
			</form>
		</dialog>
	);
};

export default ReviewDialog;
