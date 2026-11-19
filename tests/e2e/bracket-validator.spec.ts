import {expect, test} from "@playwright/test";

test.describe("Function 1: Valid Brackets section", () => {
	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	test("shows the section on the main page", async ({page}) => {
		await expect(
			page.getByRole("heading", {name: "Valid Brackets"}),
		).toBeVisible();
	});

	const examples: [string, string][] = [
		["()", "true"],
		["([{}])", "true"],
		["([)]", "false"],
		["{", "false"],
	];
	for (const [input, expected] of examples) {
		test(`example button ${input} shows ${expected}`, async ({page}) => {
			const section = page.locator("#function-1");
			await section.getByRole("button", {name: input, exact: true}).click();
			await expect(section.getByLabel("Brackets")).toHaveValue(input);
			await expect(section.getByTestId("bracket-result")).toHaveText(expected);
		});
	}

	test("updates the result while typing", async ({page}) => {
		const section = page.locator("#function-1");
		const input = section.getByLabel("Brackets");
		const result = section.getByTestId("bracket-result");

		await input.fill("{[()]}");
		await expect(result).toHaveText("true");
		await input.fill("{[()]}(");
		await expect(result).toHaveText("false");
	});

	test("warns about characters that are not brackets", async ({page}) => {
		const section = page.locator("#function-1");
		await section.getByLabel("Brackets").fill("(a)");
		await expect(section.getByTestId("bracket-result")).toHaveText("false");
		await expect(section.getByText(/Only .* are allowed/)).toBeVisible();
	});
});
