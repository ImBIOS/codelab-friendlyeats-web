// The filters shown on the restaurant listings page

import Tag from "@/src/components/tag";
import Image from "next/image";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type FilterSelectProps = {
	label: string;
	options: string[];
	value: string;
	onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
	name: string;
	icon: string;
};

function FilterSelect({
	label,
	options,
	value,
	onChange,
	name,
	icon,
}: FilterSelectProps) {
	return (
		<div>
			<Image src={icon} alt={label} width={64} height={64} />
			<label>
				{label}
				<select value={value} onChange={onChange} name={name}>
					{options.map((option) => (
						<option value={option} key={option}>
							{option === "" ? "All" : option}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}

type FiltersProps = {
	filters: {
		city: string;
		category: string;
		price: string;
		sort: string;
	};
	setFilters: Dispatch<
		SetStateAction<{
			city: string;
			category: string;
			price: string;
			sort: string;
		}>
	>;
};

export default function Filters({ filters, setFilters }: FiltersProps) {
	const handleSelectionChange = (
		event: ChangeEvent<HTMLSelectElement>,
		name: string,
	) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: event.target.value,
		}));
	};

	const updateField = (type: string, value: string) => {
		setFilters({ ...filters, [type]: value });
	};

	return (
		<section className="filter">
			<details className="filter-menu">
				<summary>
					<Image src="/filter.svg" alt="filter" width={64} height={64} />
					<div>
						<p>Restaurants</p>
						<p>Sorted by {filters.sort || "Rating"}</p>
					</div>
				</summary>

				<form
					method="GET"
					onSubmit={(event) => {
						event.preventDefault();
						const target = event.target as Element;
						const parent = target.parentNode as Element;
						parent?.removeAttribute("open");
					}}
				>
					<FilterSelect
						label="Category"
						options={[
							"",
							"Italian",
							"Chinese",
							"Japanese",
							"Mexican",
							"Indian",
							"Mediterranean",
							"Caribbean",
							"Cajun",
							"German",
							"Russian",
							"Cuban",
							"Organic",
							"Tapas",
						]}
						value={filters.category}
						onChange={(event) => handleSelectionChange(event, "category")}
						name="category"
						icon="/food.svg"
					/>

					<FilterSelect
						label="City"
						options={[
							"",
							"New York",
							"Los Angeles",
							"London",
							"Paris",
							"Tokyo",
							"Mumbai",
							"Dubai",
							"Amsterdam",
							"Seoul",
							"Singapore",
							"Istanbul",
						]}
						value={filters.city}
						onChange={(event) => handleSelectionChange(event, "city")}
						name="city"
						icon="/location.svg"
					/>

					<FilterSelect
						label="Price"
						options={["", "$", "$$", "$$$", "$$$$"]}
						value={filters.price}
						onChange={(event) => handleSelectionChange(event, "price")}
						name="price"
						icon="/price.svg"
					/>

					<FilterSelect
						label="Sort"
						options={["Rating", "Review"]}
						value={filters.sort}
						onChange={(event) => handleSelectionChange(event, "sort")}
						name="sort"
						icon="/sortBy.svg"
					/>

					<footer>
						<menu>
							<button
								className="button--cancel"
								type="reset"
								onClick={() => {
									setFilters({
										city: "",
										category: "",
										price: "",
										sort: "",
									});
								}}
							>
								Reset
							</button>
							<button type="submit" className="button--confirm">
								Submit
							</button>
						</menu>
					</footer>
				</form>
			</details>

			<div className="tags">
				{Object.entries(filters).map(([type, value]) => {
					// The main filter bar already specifies what
					// sorting is being used. So skip showing the
					// sorting as a 'tag'
					if (type === "sort" || value === "") {
						return null;
					}
					return (
						<Tag
							key={value}
							type={type}
							value={value}
							updateField={updateField}
						/>
					);
				})}
			</div>
		</section>
	);
}
