import {expect, test} from "@playwright/test";
import {sortDigitsDesc} from "@/lib/sortDigitsDesc";

test.describe("sortDigitsDesc", () => {
	const examples: [number, number][] = [
		[3008, 8300],
		[1989, 9981],
		[2679, 9762],
		[9163, 9631],
	];
	for (const [input, expected] of examples) {
		test(`${input} -> ${expected}`, () => {
			expect(sortDigitsDesc(input)).toBe(expected);
		});
	}

	test("single digits stay the same", () => {
		for (let d = 1; d <= 9; d++) expect(sortDigitsDesc(d)).toBe(d);
	});

	test("already-descending numbers stay the same", () => {
		expect(sortDigitsDesc(9876543210)).toBe(9876543210);
		expect(sortDigitsDesc(5555)).toBe(5555);
	});

	test("zeros move to the end", () => {
		expect(sortDigitsDesc(10)).toBe(10);
		expect(sortDigitsDesc(100)).toBe(100);
		expect(sortDigitsDesc(1020304)).toBe(4321000);
	});

	test("ascending input is fully reversed", () => {
		expect(sortDigitsDesc(123456789)).toBe(987654321);
	});

	test("works for 16-digit numbers when the result still fits", () => {
		expect(sortDigitsDesc(1000000000000008)).toBe(8100000000000000);
	});

	test("returns a number", () => {
		expect(typeof sortDigitsDesc(42)).toBe("number");
	});

	test("matches a simple split-sort-join for many values", () => {
		for (let n = 1; n <= 20000; n += 7) {
			const expected = Number([...String(n)].sort().reverse().join(""));
			expect(sortDigitsDesc(n), String(n)).toBe(expected);
		}
	});

	test("throws for 0, negatives, decimals and non-numbers", () => {
		for (const bad of [0, -5, 1.5, NaN, Infinity]) {
			expect(() => sortDigitsDesc(bad), String(bad)).toThrow(RangeError);
		}
	});

	test("throws when the result would not fit in a JS number", () => {
		// 9007199254740991 is the largest safe number; its digits sorted are bigger.
		expect(() => sortDigitsDesc(Number.MAX_SAFE_INTEGER)).toThrow(
			/pass a bigint/,
		);
		// 9100000000000000 is just over the limit too.
		expect(() => sortDigitsDesc(1000000000000009)).toThrow(/pass a bigint/);
	});

	test.describe("with bigint", () => {
		test("handles numbers longer than a JS number can hold", () => {
			expect(sortDigitsDesc(BigInt("12345678901234567890"))).toBe(
				BigInt("99887766554433221100"),
			);
		});

		test("handles the case a number cannot", () => {
			expect(sortDigitsDesc(BigInt(Number.MAX_SAFE_INTEGER))).toBe(
				BigInt("9999977544211000"),
			);
		});

		test("throws for 0 and negatives", () => {
			expect(() => sortDigitsDesc(BigInt(0))).toThrow(RangeError);
			expect(() => sortDigitsDesc(BigInt(-12))).toThrow(RangeError);
		});
	});
});
