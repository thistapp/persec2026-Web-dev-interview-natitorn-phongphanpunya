import {expect, test} from "@playwright/test";
import {tribonacci} from "@/lib/tribonacci";

test.describe("tribonacci", () => {
	test.describe("examples from the spec", () => {
		test("f([1, 3, 5], 5)", () => {
			expect(tribonacci([1, 3, 5], 5)).toEqual([1, 3, 5, 9, 17]);
		});
		test("f([2, 2, 2], 3)", () => {
			expect(tribonacci([2, 2, 2], 3)).toEqual([2, 2, 2]);
		});
		test("f([10, 10, 10], 4)", () => {
			expect(tribonacci([10, 10, 10], 4)).toEqual([10, 10, 10, 30]);
		});
	});

	test("classic sequence from [0, 0, 1]", () => {
		expect(tribonacci([0, 0, 1], 10)).toEqual([
			0, 0, 1, 1, 2, 4, 7, 13, 24, 44,
		]);
	});

	test("every element after the signature is the sum of the previous three", () => {
		const seq = tribonacci([3, 1, 4], 30);
		for (let i = 3; i < seq.length; i++) {
			expect(seq[i]).toBe(seq[i - 1] + seq[i - 2] + seq[i - 3]);
		}
	});

	test("n = 0 returns []", () => {
		expect(tribonacci([1, 3, 5], 0)).toEqual([]);
	});

	test("n smaller than the signature cuts the signature", () => {
		expect(tribonacci([1, 3, 5], 2)).toEqual([1, 3]);
		expect(tribonacci([1, 3, 5], 1)).toEqual([1]);
	});

	test.describe("signatures shorter than 3", () => {
		test("empty signature gives zeros", () => {
			expect(tribonacci([], 4)).toEqual([0, 0, 0, 0]);
			expect(tribonacci([], 0)).toEqual([]);
		});

		test("one number: missing elements count as 0", () => {
			expect(tribonacci([1], 6)).toEqual([1, 1, 2, 4, 7, 13]);
		});

		test("two numbers: missing elements count as 0", () => {
			expect(tribonacci([1, 1], 5)).toEqual([1, 1, 2, 4, 7]);
		});
	});

	test("handles negative numbers", () => {
		expect(tribonacci([-1, 0, 1], 6)).toEqual([-1, 0, 1, 0, 1, 2]);
	});

	test("does not change the signature array", () => {
		const sig = [1, 3, 5];
		tribonacci(sig, 10);
		expect(sig).toEqual([1, 3, 5]);
	});

	test("returns a new array even when n equals the signature length", () => {
		const sig = [2, 2, 2];
		const result = tribonacci(sig, 3);
		expect(result).not.toBe(sig);
	});

	test("long sequences stay exact while values are safe", () => {
		expect(() => tribonacci([1, 1, 1], 50)).not.toThrow();
	});

	test("throws once a value is too large to store exactly", () => {
		expect(() => tribonacci([1, 1, 1], 200)).toThrow(/too large/);
	});

	test("throws for a signature longer than 3", () => {
		expect(() => tribonacci([1, 2, 3, 4], 5)).toThrow(RangeError);
	});

	test("throws for non-integers in the signature", () => {
		for (const bad of [1.5, NaN, Infinity]) {
			expect(() => tribonacci([1, bad], 5), String(bad)).toThrow(RangeError);
		}
	});

	test("throws for a bad n", () => {
		for (const bad of [-1, 2.5, NaN, Infinity]) {
			expect(() => tribonacci([1, 1, 1], bad), String(bad)).toThrow(RangeError);
		}
	});
});
