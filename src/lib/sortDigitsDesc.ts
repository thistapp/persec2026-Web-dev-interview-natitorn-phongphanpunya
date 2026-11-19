// Rearranges a string of digits from largest to smallest using a count of
// each digit (0-9), which is O(n) rather than a general O(n log n) sort.
function sortDigitString(digits: string): string {
	const counts = new Array<number>(10).fill(0);
	for (const ch of digits) counts[ch.charCodeAt(0) - 48]++;

	let result = "";
	for (let d = 9; d >= 0; d--) result += String(d).repeat(counts[d]);
	return result;
}

/**
 * Sorts the digits of a positive integer from largest to smallest.
 *
 * sortDigitsDesc(3008) -> 8300
 * sortDigitsDesc(1989) -> 9981
 *
 * Pass a bigint for numbers beyond Number.MAX_SAFE_INTEGER; you get a bigint back.
 * Throws a RangeError for 0, negatives, decimals, or a number whose sorted
 * result would be too large to store exactly in a JS number.
 */
export function sortDigitsDesc(n: number): number;
export function sortDigitsDesc(n: bigint): bigint;
export function sortDigitsDesc(n: number | bigint): number | bigint {
	if (typeof n === "bigint") {
		if (n <= BigInt(0)) {
			throw new RangeError(`Expected a positive integer, got ${n}`);
		}
		return BigInt(sortDigitString(n.toString()));
	}

	if (!Number.isSafeInteger(n) || n <= 0) {
		throw new RangeError(`Expected a positive integer, got ${n}`);
	}
	const result = Number(sortDigitString(String(n)));
	if (!Number.isSafeInteger(result)) {
		throw new RangeError(
			`Result for ${n} is too large for a JS number; pass a bigint instead`,
		);
	}
	return result;
}
