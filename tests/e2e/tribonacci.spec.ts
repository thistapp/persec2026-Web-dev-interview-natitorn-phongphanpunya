import {expect, test} from "@playwright/test";

test.describe("Function 6: Tribonacci section", () => {
	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	const items = (page: import("@playwright/test").Page) =>
		page
			.locator("#function-6")
			.getByTestId("tribonacci-result")
			.getByRole("listitem");

	test("shows the first example by default", async ({page}) => {
		await expect(page.getByRole("heading", {name: "Tribonacci"})).toBeVisible();
		await expect(items(page)).toHaveText(["1", "3", "5", "9", "17"]);
	});

	const examples: [string, string, string[]][] = [
		["f([1, 3, 5], 5)", "1, 3, 5", ["1", "3", "5", "9", "17"]],
		["f([2, 2, 2], 3)", "2, 2, 2", ["2", "2", "2"]],
		["f([10, 10, 10], 4)", "10, 10, 10", ["10", "10", "10", "30"]],
	];
	for (const [label, sig, expected] of examples) {
		test(`example button ${label}`, async ({page}) => {
			const section = page.locator("#function-6");
			await section.getByRole("button", {name: label}).click();
			await expect(
				section.getByLabel("Signature (0 to 3 numbers)"),
			).toHaveValue(sig);
			await expect(items(page)).toHaveText(expected);
		});
	}

	test("updates while typing", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("0, 0, 1");
		await section.getByLabel("n", {exact: true}).fill("8");
		await expect(items(page)).toHaveText([
			"0",
			"0",
			"1",
			"1",
			"2",
			"4",
			"7",
			"13",
		]);
	});

	test("works with a short signature", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("1");
		await section.getByLabel("n", {exact: true}).fill("6");
		await expect(items(page)).toHaveText(["1", "1", "2", "4", "7", "13"]);
	});

	test("an empty signature gives zeros", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("");
		await section.getByLabel("n", {exact: true}).fill("3");
		await expect(items(page)).toHaveText(["0", "0", "0"]);
	});

	test("n = 0 shows an empty list", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("n", {exact: true}).fill("0");
		await expect(section.getByTestId("tribonacci-empty")).toBeVisible();
	});

	test("n is capped at 100 on the page", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("0");
		await section.getByLabel("n", {exact: true}).fill("500");
		await expect(section.getByLabel("n", {exact: true})).toHaveValue("100");
		await expect(items(page)).toHaveCount(100);
	});

	test("shows an error for more than 3 numbers", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("1, 2, 3, 4");
		await expect(section.getByTestId("tribonacci-error")).toContainText(
			"0 to 3 numbers",
		);
	});

	test("shows an error for non-numbers", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("1, a, 3");
		await expect(section.getByTestId("tribonacci-error")).toContainText(
			"whole numbers",
		);
	});

	test("shows an error when values get too large", async ({page}) => {
		const section = page.locator("#function-6");
		await section.getByLabel("Signature (0 to 3 numbers)").fill("1, 1, 1");
		await section.getByLabel("n", {exact: true}).fill("100");
		await expect(section.getByTestId("tribonacci-error")).toContainText(
			"too large",
		);
	});
});
