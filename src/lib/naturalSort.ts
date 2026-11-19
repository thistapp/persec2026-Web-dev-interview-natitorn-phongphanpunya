// Splits a string into alternating runs of digits and non-digits,
// e.g. "TH3Netflix" -> ["TH", "3", "Netflix"].
function tokenize(s: string): string[] {
	return s.match(/\d+|\D+/g) ?? [];
}

const isDigits = (s: string) => s.charCodeAt(0) >= 48 && s.charCodeAt(0) <= 57;

// Compares two digit runs by numeric value without converting to Number,
// so very long numbers never lose precision: "2" < "19", "007" == "7".
function compareNumbers(a: string, b: string): number {
	const x = a.replace(/^0+(?=\d)/, "");
	const y = b.replace(/^0+(?=\d)/, "");
	if (x.length !== y.length) return x.length - y.length;
	return x < y ? -1 : x > y ? 1 : 0;
}

// Compares text runs alphabetically, ignoring case first ("a" next to "A").
function compareText(a: string, b: string): number {
	const x = a.toLowerCase();
	const y = b.toLowerCase();
	return x < y ? -1 : x > y ? 1 : 0;
}

/**
 * Compares two strings in natural order: text parts alphabetically,
 * number parts by numeric value. Usable directly as an Array.sort comparator.
 */
export function naturalCompare(a: string, b: string): number {
	const ta = tokenize(a);
	const tb = tokenize(b);
	const len = Math.min(ta.length, tb.length);

	for (let i = 0; i < len; i++) {
		const pa = ta[i];
		const pb = tb[i];
		const aNum = isDigits(pa);
		const bNum = isDigits(pb);

		let diff: number;
		if (aNum && bNum) diff = compareNumbers(pa, pb);
		else if (aNum !== bNum)
			diff = aNum ? -1 : 1; // numbers come before text
		else diff = compareText(pa, pb);

		if (diff !== 0) return diff;
	}

	// A shorter string that is a prefix of the other comes first ("TH1" < "TH1a").
	if (ta.length !== tb.length) return ta.length - tb.length;

	// Equal in natural order (e.g. "a7"/"A07"): fall back to a plain comparison
	// so the result is always the same regardless of input order.
	return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Returns a new array sorted in natural order. The input array is not changed.
 *
 * naturalSort(["TH19", "SG20", "TH2"]) -> ["SG20", "TH2", "TH19"]
 */
export function naturalSort(items: readonly string[]): string[] {
	return [...items].sort(naturalCompare);
}
