import {expect, test} from "@playwright/test";
import {intToRoman, isValidRoman, romanToInt} from "@/lib/romanNumerals";

const EXAMPLES: [number, string][] = [
	[1989, "MCMLXXXIX"],
	[2000, "MM"],
	[68, "LXVIII"],
	[109, "CIX"],
];

test.describe("intToRoman", () => {
	for (const [num, roman] of EXAMPLES) {
		test(`${num} -> ${roman}`, () => {
			expect(intToRoman(num)).toBe(roman);
		});
	}

	test("converts each basic symbol", () => {
		expect([1, 5, 10, 50, 100, 500, 1000].map(intToRoman)).toEqual([
			"I",
			"V",
			"X",
			"L",
			"C",
			"D",
			"M",
		]);
	});

	test("uses subtractive notation", () => {
		expect([4, 9, 40, 90, 400, 900].map(intToRoman)).toEqual([
			"IV",
			"IX",
			"XL",
			"XC",
			"CD",
			"CM",
		]);
	});

	test("handles the range limits", () => {
		expect(intToRoman(1)).toBe("I");
		expect(intToRoman(3999)).toBe("MMMCMXCIX");
	});

	test("throws for numbers it cannot write", () => {
		for (const bad of [0, -1, 4000, 1.5, NaN, Infinity]) {
			expect(() => intToRoman(bad), String(bad)).toThrow(RangeError);
		}
	});
});

test.describe("romanToInt", () => {
	for (const [num, roman] of EXAMPLES) {
		test(`${roman} -> ${num}`, () => {
			expect(romanToInt(roman)).toBe(num);
		});
	}

	test("reads each basic symbol", () => {
		expect(["I", "V", "X", "L", "C", "D", "M"].map(romanToInt)).toEqual([
			1, 5, 10, 50, 100, 500, 1000,
		]);
	});

	test("reads subtractive pairs", () => {
		expect(["IV", "IX", "XL", "XC", "CD", "CM"].map(romanToInt)).toEqual([
			4, 9, 40, 90, 400, 900,
		]);
	});

	test("accepts lower case", () => {
		expect(romanToInt("mcmlxxxix")).toBe(1989);
	});

	test("throws for numerals not written in standard form", () => {
		for (const bad of [
			"",
			"IIII",
			"VV",
			"IC",
			"XM",
			"IL",
			"MMMM",
			"ABC",
			"X I",
			"IIV",
		]) {
			expect(() => romanToInt(bad), JSON.stringify(bad)).toThrow(SyntaxError);
			expect(isValidRoman(bad)).toBe(false);
		}
	});
});

test("every number from 1 to 3999 converts there and back", () => {
	for (let n = 1; n <= 3999; n++) {
		const roman = intToRoman(n);
		expect(isValidRoman(roman), roman).toBe(true);
		expect(romanToInt(roman), roman).toBe(n);
	}
});
