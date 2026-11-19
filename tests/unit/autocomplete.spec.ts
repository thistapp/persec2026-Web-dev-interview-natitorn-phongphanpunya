import {expect, test} from "@playwright/test";
import {autocomplete} from "@/lib/autocomplete";

const ITEMS = ["Mother", "Think", "Worthy", "Apple", "Android"];

test.describe("autocomplete", () => {
	test('example from the spec: ("th", [...], 2)', () => {
		expect(autocomplete("th", ITEMS, 2)).toEqual(["Think", "Mother"]);
	});

	test("returns every match when maxResult is large enough", () => {
		expect(autocomplete("th", ITEMS, 10)).toEqual([
			"Think",
			"Mother",
			"Worthy",
		]);
	});

	test("ranks starts-with, then middle, then ends-with", () => {
		const items = ["Smith", "Mother", "Think"];
		expect(autocomplete("th", items, 10)).toEqual(["Think", "Mother", "Smith"]);
	});

	test("ranks an earlier match first within the middle group", () => {
		// "th" is at index 3 in "Worthy" and index 2 in "Mother".
		expect(autocomplete("th", ["Worthy", "Mother"], 10)).toEqual([
			"Mother",
			"Worthy",
		]);
	});

	test("keeps the original order for equal matches", () => {
		// "th" is at index 2 in both.
		expect(autocomplete("th", ["Lather", "Bathtub"], 10)).toEqual([
			"Lather",
			"Bathtub",
		]);
		expect(autocomplete("th", ["Bathtub", "Lather"], 10)).toEqual([
			"Bathtub",
			"Lather",
		]);
	});

	test("ignores case in both search and items", () => {
		expect(autocomplete("TH", ["think", "THEME", "mOtHer"], 10)).toEqual([
			"think",
			"THEME",
			"mOtHer",
		]);
	});

	test("returns items with their original casing", () => {
		expect(autocomplete("an", ITEMS, 10)).toEqual(["Android"]);
	});

	test("ranks by the first occurrence", () => {
		// "th" first appears in the middle of "Mothth", even though it also ends with "th".
		expect(autocomplete("th", ["Smith", "Mothth"], 10)).toEqual([
			"Mothth",
			"Smith",
		]);
	});

	test("an item equal to the search counts as starts-with", () => {
		expect(autocomplete("th", ["Smith", "th"], 10)).toEqual(["th", "Smith"]);
	});

	test("returns [] when nothing matches", () => {
		expect(autocomplete("xyz", ITEMS, 5)).toEqual([]);
	});

	test("returns [] for an empty search", () => {
		expect(autocomplete("", ITEMS, 5)).toEqual([]);
	});

	test("returns [] when maxResult is 0, negative or NaN", () => {
		expect(autocomplete("th", ITEMS, 0)).toEqual([]);
		expect(autocomplete("th", ITEMS, -1)).toEqual([]);
		expect(autocomplete("th", ITEMS, NaN)).toEqual([]);
	});

	test("rounds a fractional maxResult down", () => {
		expect(autocomplete("th", ITEMS, 1.9)).toEqual(["Think"]);
	});

	test("does not change the input array", () => {
		const items = [...ITEMS];
		autocomplete("th", items, 10);
		expect(items).toEqual(ITEMS);
	});

	test("treats special characters literally", () => {
		expect(autocomplete(".*", ["a.*b", "abc"], 10)).toEqual(["a.*b"]);
	});
});
