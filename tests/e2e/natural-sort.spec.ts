import {expect, test} from "@playwright/test";

test.describe("Function 2: Natural Sort section", () => {
	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	test("shows the section on the main page", async ({page}) => {
		await expect(
			page.getByRole("heading", {name: "Natural Sort"}),
		).toBeVisible();
	});

	const examples: [string, string[]][] = [
		["TH19, SG20, TH2", ["SG20", "TH2", "TH19"]],
		["TH10, TH3Netflix, TH1, TH7", ["TH1", "TH3Netflix", "TH7", "TH10"]],
	];
	for (const [input, expected] of examples) {
		test(`example button [${input}] shows the sorted list`, async ({page}) => {
			const section = page.locator("#function-2");
			await section.getByRole("button", {name: `[${input}]`}).click();
			await expect(section.getByLabel("Strings (comma-separated)")).toHaveValue(
				input,
			);
			await expect(
				section.getByTestId("natural-result").getByRole("listitem"),
			).toHaveText(expected);
		});
	}

	test("shows how plain .sort() differs", async ({page}) => {
		const section = page.locator("#function-2");
		await section
			.getByLabel("Strings (comma-separated)")
			.fill("TH19, SG20, TH2");
		await expect(
			section.getByTestId("plain-result").getByRole("listitem"),
		).toHaveText(["SG20", "TH19", "TH2"]);
	});

	test("re-sorts while typing and ignores empty entries", async ({page}) => {
		const section = page.locator("#function-2");
		await section
			.getByLabel("Strings (comma-separated)")
			.fill("a10, , a2 ,a1,");
		await expect(
			section.getByTestId("natural-result").getByRole("listitem"),
		).toHaveText(["a1", "a2", "a10"]);
	});
});
