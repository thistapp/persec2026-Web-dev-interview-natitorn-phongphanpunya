import {expect, test} from "@playwright/test";
import {naturalCompare, naturalSort} from "@/lib/naturalSort";

test.describe("naturalSort", () => {
	test.describe("examples from the spec", () => {
		test('["TH19", "SG20", "TH2"]', () => {
			expect(naturalSort(["TH19", "SG20", "TH2"])).toEqual([
				"SG20",
				"TH2",
				"TH19",
			]);
		});

		test('["TH10", "TH3Netflix", "TH1", "TH7"]', () => {
			expect(naturalSort(["TH10", "TH3Netflix", "TH1", "TH7"])).toEqual([
				"TH1",
				"TH3Netflix",
				"TH7",
				"TH10",
			]);
		});
	});

	test("does not change the input array", () => {
		const input = ["b2", "a10", "a2"];
		const copy = [...input];
		naturalSort(input);
		expect(input).toEqual(copy);
	});

	test("handles empty and single-item arrays", () => {
		expect(naturalSort([])).toEqual([]);
		expect(naturalSort(["x1"])).toEqual(["x1"]);
	});

	test("sorts plain numbers by value", () => {
		expect(naturalSort(["100", "9", "20", "1"])).toEqual([
			"1",
			"9",
			"20",
			"100",
		]);
	});

	test("compares several number parts in turn", () => {
		expect(naturalSort(["v1.10.0", "v1.2.10", "v1.2.9", "v1.10.1"])).toEqual([
			"v1.2.9",
			"v1.2.10",
			"v1.10.0",
			"v1.10.1",
		]);
	});

	test("puts a shorter prefix first", () => {
		expect(naturalSort(["TH1a", "TH1", "TH"])).toEqual(["TH", "TH1", "TH1a"]);
	});

	test("ignores case when comparing text", () => {
		expect(naturalSort(["b1", "A2", "a1"])).toEqual(["a1", "A2", "b1"]);
	});

	test("treats leading zeros as the same value", () => {
		expect(naturalSort(["file010", "file9", "file0002"])).toEqual([
			"file0002",
			"file9",
			"file010",
		]);
	});

	test("handles numbers too big for a JS number", () => {
		const big = "id99999999999999999999";
		const bigger = "id100000000000000000000";
		expect(naturalSort([bigger, big])).toEqual([big, bigger]);
	});

	test("keeps duplicates", () => {
		expect(naturalSort(["a2", "a1", "a2"])).toEqual(["a1", "a2", "a2"]);
	});

	test("gives the same order whatever the input order", () => {
		const items = ["x07", "x7", "X7", "x10", "x2"];
		const expected = naturalSort(items);
		expect(naturalSort([...items].reverse())).toEqual(expected);
	});

	test("naturalCompare is symmetric", () => {
		expect(naturalCompare("TH2", "TH19")).toBeLessThan(0);
		expect(naturalCompare("TH19", "TH2")).toBeGreaterThan(0);
		expect(naturalCompare("TH2", "TH2")).toBe(0);
	});
});
