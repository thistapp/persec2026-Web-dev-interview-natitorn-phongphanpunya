import {expect, test} from "@playwright/test";

test.describe("Function 3: Autocomplete section", () => {
	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	test("shows the spec example by default", async ({page}) => {
		const section = page.locator("#function-3");
		await expect(
			page.getByRole("heading", {name: "Autocomplete"}),
		).toBeVisible();
		await expect(section.getByLabel("Search")).toHaveValue("th");
		await expect(section.getByLabel("Max results")).toHaveValue("2");
		await expect(
			section.getByTestId("autocomplete-result").getByRole("listitem"),
		).toHaveText(["Think", "Mother"]);
	});

	test("highlights the matched text", async ({page}) => {
		const marks = page
			.locator("#function-3")
			.getByTestId("autocomplete-result")
			.locator("mark");
		await expect(marks).toHaveText(["Th", "th"]);
	});

	test("raising max results shows more matches", async ({page}) => {
		const section = page.locator("#function-3");
		await section.getByLabel("Max results").fill("5");
		await expect(
			section.getByTestId("autocomplete-result").getByRole("listitem"),
		).toHaveText(["Think", "Mother", "Worthy"]);
	});

	test("updates while typing, ignoring case", async ({page}) => {
		const section = page.locator("#function-3");
		await section.getByLabel("Search").fill("AN");
		await expect(
			section.getByTestId("autocomplete-result").getByRole("listitem"),
		).toHaveText(["Android"]);
	});

	test("edits to the items list are searched", async ({page}) => {
		const section = page.locator("#function-3");
		await section
			.getByLabel("Items (comma-separated)")
			.fill("Smith, Mother, Think");
		await section.getByLabel("Max results").fill("3");
		await expect(
			section.getByTestId("autocomplete-result").getByRole("listitem"),
		).toHaveText(["Think", "Mother", "Smith"]);
	});

	test.describe("max results is limited to the number of items", () => {
		test("sets max to the item count", async ({page}) => {
			const max = page.locator("#function-3").getByLabel("Max results");
			await expect(max).toHaveAttribute("max", "5");
			await expect(page.locator("#function-3").getByText("of 5")).toBeVisible();
		});

		test("typing a bigger number is capped at the item count", async ({
			page,
		}) => {
			const max = page.locator("#function-3").getByLabel("Max results");
			await max.fill("99");
			await expect(max).toHaveValue("5");
		});

		test("the up arrow stops at the item count", async ({page}) => {
			const max = page.locator("#function-3").getByLabel("Max results");
			await max.fill("5");
			await max.press("ArrowUp");
			await expect(max).toHaveValue("5");
		});

		test("removing items lowers max results to match", async ({page}) => {
			const section = page.locator("#function-3");
			const max = section.getByLabel("Max results");
			await max.fill("5");
			await section.getByLabel("Items (comma-separated)").fill("Mother, Think");
			await expect(max).toHaveValue("2");
			await expect(max).toHaveAttribute("max", "2");
			await expect(section.getByText("of 2")).toBeVisible();
		});

		test("negative numbers become 0", async ({page}) => {
			const section = page.locator("#function-3");
			await section.getByLabel("Max results").fill("-3");
			await expect(section.getByLabel("Max results")).toHaveValue("0");
			await expect(section.getByTestId("autocomplete-empty")).toBeVisible();
		});
	});

	test("says when there are no matches", async ({page}) => {
		const section = page.locator("#function-3");
		await section.getByLabel("Search").fill("zzz");
		await expect(section.getByTestId("autocomplete-empty")).toHaveText(
			"No matches",
		);
	});
});
