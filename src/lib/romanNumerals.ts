// The seven basic symbols, used for the table on the page.
export const ROMAN_SYMBOLS: readonly {symbol: string; value: number}[] = [
	{symbol: "I", value: 1},
	{symbol: "V", value: 5},
	{symbol: "X", value: 10},
	{symbol: "L", value: 50},
	{symbol: "C", value: 100},
	{symbol: "D", value: 500},
	{symbol: "M", value: 1000},
];

// Symbols plus the six subtractive pairs, largest first. Converting to Roman
// is then just "take the biggest value that still fits, repeat".
const STEPS: readonly [string, number][] = [
	["M", 1000],
	["CM", 900],
	["D", 500],
	["CD", 400],
	["C", 100],
	["XC", 90],
	["L", 50],
	["XL", 40],
	["X", 10],
	["IX", 9],
	["V", 5],
	["IV", 4],
	["I", 1],
];

const VALUE: Record<string, number> = Object.fromEntries(
	ROMAN_SYMBOLS.map(({symbol, value}) => [symbol, value]),
);

// Standard notation can write 1 to 3999 (no symbol above M, and at most MMM).
export const MIN_ROMAN = 1;
export const MAX_ROMAN = 3999;

// Matches only correctly written numerals: thousands, hundreds, tens, ones.
// Rejects forms like "IIII", "VV", "IC", "XM" or "MMMM".
const VALID_ROMAN = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

/**
 * Converts an integer from 1 to 3999 to a Roman numeral.
 * intToRoman(1989) -> "MCMLXXXIX"
 * Throws a RangeError for anything else (0, negatives, decimals, > 3999).
 */
export function intToRoman(num: number): string {
	if (!Number.isInteger(num) || num < MIN_ROMAN || num > MAX_ROMAN) {
		throw new RangeError(
			`Expected a whole number from ${MIN_ROMAN} to ${MAX_ROMAN}, got ${num}`,
		);
	}

	let rest = num;
	let result = "";
	for (const [symbol, value] of STEPS) {
		while (rest >= value) {
			result += symbol;
			rest -= value;
		}
	}
	return result;
}

/** True if `roman` is a correctly written numeral (case-insensitive). */
export function isValidRoman(roman: string): boolean {
	return roman !== "" && VALID_ROMAN.test(roman.toUpperCase());
}

/**
 * Converts a Roman numeral to an integer. Upper or lower case is accepted.
 * romanToInt("MCMLXXXIX") -> 1989
 * Throws a SyntaxError if the numeral is not written in standard form.
 */
export function romanToInt(roman: string): number {
	if (!isValidRoman(roman)) {
		throw new SyntaxError(`"${roman}" is not a valid Roman numeral`);
	}

	const s = roman.toUpperCase();
	let total = 0;
	for (let i = 0; i < s.length; i++) {
		const value = VALUE[s[i]];
		// A smaller symbol before a bigger one is subtracted (IV = 5 - 1).
		const next = i + 1 < s.length ? VALUE[s[i + 1]] : 0;
		total += value < next ? -value : value;
	}
	return total;
}
