import {expect, test} from "@playwright/test";
import {isValidBrackets} from "@/lib/isValidBrackets";

test.describe("isValidBrackets", () => {
	test.describe("examples from the spec", () => {
		const cases: [string, boolean][] = [
			["()", true],
			["([{}])", true],
			["([)]", false],
			["{", false],
		];
		for (const [input, expected] of cases) {
			test(`${input} -> ${expected}`, () => {
				expect(isValidBrackets(input)).toBe(expected);
			});
		}
	});

	test("treats an empty string as valid (nothing is unmatched)", () => {
		expect(isValidBrackets("")).toBe(true);
	});

	test("accepts brackets side by side", () => {
		expect(isValidBrackets("()[]{}")).toBe(true);
	});

	test("accepts deep nesting", () => {
		expect(isValidBrackets("{[()()]}([]{})")).toBe(true);
		expect(isValidBrackets("(".repeat(1000) + ")".repeat(1000))).toBe(true);
	});

	test("rejects a closer with nothing open", () => {
		expect(isValidBrackets(")")).toBe(false);
		expect(isValidBrackets("]()[")).toBe(false);
	});

	test("rejects mismatched types", () => {
		expect(isValidBrackets("(]")).toBe(false);
		expect(isValidBrackets("{)")).toBe(false);
	});

	test("rejects openers left unclosed (even length)", () => {
		expect(isValidBrackets("((")).toBe(false);
		expect(isValidBrackets("(()(")).toBe(false);
	});

	test("rejects characters outside ( ) { } [ ]", () => {
		expect(isValidBrackets("(a)")).toBe(false);
		expect(isValidBrackets("( )")).toBe(false);
	});
});
