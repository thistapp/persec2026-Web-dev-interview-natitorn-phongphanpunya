export type SectionInfo = {
	id: string;
	number: number;
	title: string;
	description: string;
};

// The 6 function sections shown on the main page.
// Rename or describe each one here; the nav and page update automatically.
export const sections: SectionInfo[] = [
	{
		id: "function-1",
		number: 1,
		title: "Valid Brackets",
		description: "Checks that ( ) { } [ ] are properly matched and nested.",
	},
	{
		id: "function-2",
		number: 2,
		title: "Natural Sort",
		description: "Sorts text alphabetically and embedded numbers by value.",
	},
	{
		id: "function-3",
		number: 3,
		title: "Autocomplete",
		description:
			"Finds matches, ranked: starts with, then contains, then ends with.",
	},
	{
		id: "function-4",
		number: 4,
		title: "Roman Numerals",
		description:
			"Converts between whole numbers (1 to 3999) and Roman numerals.",
	},
	{
		id: "function-5",
		number: 5,
		title: "Descending Digits",
		description:
			"Rearranges a positive integer's digits from largest to smallest.",
	},
	{
		id: "function-6",
		number: 6,
		title: "Tribonacci",
		description:
			"Each number is the sum of the previous three, starting from a signature.",
	},
];
