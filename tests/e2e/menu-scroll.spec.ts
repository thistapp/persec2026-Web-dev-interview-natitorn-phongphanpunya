import {expect, test, type Page} from "@playwright/test";

const SECTIONS = [
	["Valid Brackets", "function-1"],
	["Natural Sort", "function-2"],
	["Autocomplete", "function-3"],
	["Roman Numerals", "function-4"],
	["Descending Digits", "function-5"],
	["Tribonacci", "function-6"],
] as const;

// Clicks a menu link and records window.scrollY on every frame for `ms`.
async function clickAndTrackScroll(page: Page, id: string, ms = 400) {
	return page.evaluate(
		([id, ms]) =>
			new Promise<number[]>((resolve) => {
				const ys: number[] = [];
				const start = performance.now();
				const tick = () => {
					ys.push(Math.round(window.scrollY));
					if (performance.now() - start < ms) requestAnimationFrame(tick);
					else resolve(ys);
				};
				document
					.querySelector<HTMLAnchorElement>(`nav a[href="#${id}"]`)!
					.click();
				requestAnimationFrame(tick);
			}),
		[id, ms] as const,
	);
}

test.describe("menu scrolls to each section", () => {
	test.use({viewport: {width: 1280, height: 600}});

	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	for (const [name, id] of SECTIONS) {
		test(`clicking "${name}" scrolls to its section`, async ({page}) => {
			await page.getByRole("navigation").getByRole("link", {name}).click();
			await expect(page).toHaveURL(new RegExp(`#${id}$`));

			const section = page.locator(`#${id}`);
			await expect(section).toBeInViewport();
			// The section's heading is not hidden behind the sticky menu.
			const header = (await page.locator("header").boundingBox())!;
			await expect
				.poll(
					async () =>
						(await section.getByRole("heading", {level: 2}).boundingBox())!.y,
				)
				.toBeGreaterThanOrEqual(header.y + header.height);
		});
	}

	test("scrolling is animated, not a jump", async ({page}) => {
		const ys = await clickAndTrackScroll(page, "function-6");
		const distinct = new Set(ys);
		// A jump goes straight from 0 to the end; a smooth scroll passes through many positions.
		expect(distinct.size).toBeGreaterThan(3);
		// And it only moves one way.
		for (let i = 1; i < ys.length; i++)
			expect(ys[i]).toBeGreaterThanOrEqual(ys[i - 1]);
	});

	test("the section you land on is briefly highlighted", async ({page}) => {
		await page
			.getByRole("navigation")
			.getByRole("link", {name: "Tribonacci"})
			.click();
		const animation = await page
			.locator("#function-6")
			.evaluate((el) => getComputedStyle(el).animationName);
		expect(animation).toBe("section-arrive");
	});

	test.describe("with reduced motion turned on", () => {
		test.use({colorScheme: "dark", reducedMotion: "reduce"});

		test("jumps straight to the section with no animation", async ({page}) => {
			const ys = await clickAndTrackScroll(page, "function-6");
			// Already at the final position on the first frame.
			expect(new Set(ys).size).toBe(1);
			expect(ys[0]).toBeGreaterThan(0);
			const animation = await page
				.locator("#function-6")
				.evaluate((el) => getComputedStyle(el).animationName);
			expect(animation).toBe("none");
		});
	});
});
