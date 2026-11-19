import {expect, test} from "@playwright/test";

test.describe("Function 5: Descending Digits section", () => {
	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	test("shows the section with a default result", async ({page}) => {
		const section = page.locator("#function-5");
		await expect(
			page.getByRole("heading", {name: "Descending Digits"}),
		).toBeVisible();
		await expect(section.getByTestId("digits-result")).toHaveText("8300");
	});

	const examples: [string, string][] = [
		["3008", "8300"],
		["1989", "9981"],
		["2679", "9762"],
		["9163", "9631"],
	];
	for (const [input, expected] of examples) {
		test(`example button ${input} shows ${expected}`, async ({page}) => {
			const section = page.locator("#function-5");
			await section.getByRole("button", {name: input, exact: true}).click();
			await expect(section.getByLabel("Positive integer")).toHaveValue(input);
			await expect(section.getByTestId("digits-result")).toHaveText(expected);
		});
	}

	test("updates while typing", async ({page}) => {
		const section = page.locator("#function-5");
		await section.getByLabel("Positive integer").fill("1020304");
		await expect(section.getByTestId("digits-result")).toHaveText("4321000");
	});

	test("handles very long numbers exactly", async ({page}) => {
		const section = page.locator("#function-5");
		await section.getByLabel("Positive integer").fill("12345678901234567890");
		await expect(section.getByTestId("digits-result")).toHaveText(
			"99887766554433221100",
		);
	});

	test("shows an error for non-digits", async ({page}) => {
		const section = page.locator("#function-5");
		await section.getByLabel("Positive integer").fill("12a");
		await expect(section.getByTestId("digits-error")).toContainText(
			"digits only",
		);
		await section.getByLabel("Positive integer").fill("-12");
		await expect(section.getByTestId("digits-error")).toContainText(
			"digits only",
		);
	});

	test("shows an error for 0", async ({page}) => {
		const section = page.locator("#function-5");
		await section.getByLabel("Positive integer").fill("000");
		await expect(section.getByTestId("digits-error")).toContainText(
			"greater than 0",
		);
	});

	test("shows nothing when empty", async ({page}) => {
		const section = page.locator("#function-5");
		await section.getByLabel("Positive integer").fill("");
		await expect(section.getByTestId("digits-result")).toHaveCount(0);
		await expect(section.getByTestId("digits-error")).toHaveCount(0);
	});
});
