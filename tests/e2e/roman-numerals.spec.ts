import {expect, test} from "@playwright/test";

test.describe("Function 4: Roman Numerals section", () => {
	test.beforeEach(async ({page}) => {
		await page.goto("/");
	});

	const EXPECTED_ROWS = [
		["I", "1"],
		["V", "5"],
		["X", "10"],
		["L", "50"],
		["C", "100"],
		["D", "500"],
		["M", "1,000"],
	];

	test.describe("info icon on desktop (hover)", () => {
		test("is in the section's top-right corner", async ({page}) => {
			const section = page.locator("#function-4");
			const icon = section.getByRole("button", {name: "Roman symbols"});
			const s = (await section.boundingBox())!;
			const i = (await icon.boundingBox())!;
			// Right edge within the card padding, and above the content area.
			expect(s.x + s.width - (i.x + i.width)).toBeLessThan(40);
			expect(i.y - s.y).toBeLessThan(40);
		});

		test("table is hidden until the icon is hovered", async ({page}) => {
			const section = page.locator("#function-4");
			const icon = section.getByRole("button", {name: "Roman symbols"});
			await expect(section.getByRole("table")).toHaveCount(0);

			await icon.hover();
			await expect(icon).toHaveAttribute("aria-expanded", "true");
			await expect(
				section.getByRole("dialog", {name: "Roman symbols"}),
			).toBeVisible();
		});

		test("lists every symbol and value", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).hover();
			const table = section.getByRole("table");
			await expect(table.getByRole("columnheader")).toHaveText([
				"Symbol",
				"Value",
			]);
			const rows = table.getByRole("row");
			await expect(rows).toHaveCount(8); // header + 7 symbols
			for (const [i, cells] of EXPECTED_ROWS.entries()) {
				await expect(rows.nth(i + 1).getByRole("cell")).toHaveText(cells);
			}
		});

		test("moving the mouse away hides it", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).hover();
			await expect(section.getByRole("table")).toBeVisible();
			await page.getByRole("heading", {name: "Function Hub", level: 1}).hover();
			await expect(section.getByRole("table")).toHaveCount(0);
		});

		test("stays open while the mouse moves onto the table", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).hover();
			await section.getByRole("cell", {name: "1,000"}).hover();
			await page.waitForTimeout(300); // longer than the close delay
			await expect(section.getByRole("table")).toBeVisible();
		});

		test("clicking while hovered keeps it open", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).click();
			await expect(section.getByRole("table")).toBeVisible();
		});

		test("keyboard: Enter toggles, Escape closes", async ({page}) => {
			const section = page.locator("#function-4");
			const icon = section.getByRole("button", {name: "Roman symbols"});
			await icon.focus();
			await page.keyboard.press("Enter");
			await expect(section.getByRole("table")).toBeVisible();
			await page.keyboard.press("Escape");
			await expect(section.getByRole("table")).toHaveCount(0);
			await expect(icon).toBeFocused();
		});
	});

	test.describe("info icon on mobile (tap)", () => {
		test.use({
			viewport: {width: 390, height: 844},
			hasTouch: true,
			isMobile: true,
		});

		test("tapping the icon shows the table", async ({page}) => {
			const section = page.locator("#function-4");
			const icon = section.getByRole("button", {name: "Roman symbols"});
			await expect(section.getByRole("table")).toHaveCount(0);
			await icon.tap();
			await expect(section.getByRole("table")).toBeVisible();
			await expect(section.getByRole("table").getByRole("row")).toHaveCount(8);
		});

		test("tapping the icon again hides it", async ({page}) => {
			const section = page.locator("#function-4");
			const icon = section.getByRole("button", {name: "Roman symbols"});
			await icon.tap();
			await expect(section.getByRole("table")).toBeVisible();
			await icon.tap();
			await expect(section.getByRole("table")).toHaveCount(0);
		});

		test("tapping outside hides it", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).tap();
			await expect(section.getByRole("table")).toBeVisible();
			await page.getByRole("heading", {name: "Roman Numerals"}).tap();
			await expect(section.getByRole("table")).toHaveCount(0);
		});

		test("tapping inside the table keeps it open", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).tap();
			await section.getByRole("cell", {name: "500"}).tap();
			await expect(section.getByRole("table")).toBeVisible();
		});

		test("the table fits on screen", async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: "Roman symbols"}).tap();
			const box = (await section.getByRole("dialog").boundingBox())!;
			expect(box.x).toBeGreaterThanOrEqual(0);
			expect(box.x + box.width).toBeLessThanOrEqual(390);
		});
	});

	const examples: [number, string][] = [
		[1989, "MCMLXXXIX"],
		[2000, "MM"],
		[68, "LXVIII"],
		[109, "CIX"],
	];
	for (const [num, roman] of examples) {
		test(`example ${num} <-> ${roman}`, async ({page}) => {
			const section = page.locator("#function-4");
			await section.getByRole("button", {name: `${num} ↔ ${roman}`}).click();
			await expect(section.getByTestId("to-roman")).toHaveText(roman);
			await expect(section.getByTestId("to-int")).toHaveText(String(num));
		});
	}

	test("converts a typed number", async ({page}) => {
		const section = page.locator("#function-4");
		await section.getByLabel("Number → Roman").fill("3999");
		await expect(section.getByTestId("to-roman")).toHaveText("MMMCMXCIX");
	});

	test("converts a typed numeral, in lower case too", async ({page}) => {
		const section = page.locator("#function-4");
		await section.getByLabel("Roman → Number").fill("xliv");
		await expect(section.getByTestId("to-int")).toHaveText("44");
	});

	test("shows an error for a number out of range", async ({page}) => {
		const section = page.locator("#function-4");
		await section.getByLabel("Number → Roman").fill("4000");
		await expect(section.getByTestId("to-roman-error")).toContainText(
			"1 to 3999",
		);
	});

	test("shows an error for an invalid numeral", async ({page}) => {
		const section = page.locator("#function-4");
		await section.getByLabel("Roman → Number").fill("IIII");
		await expect(section.getByTestId("to-int-error")).toContainText(
			"not a valid Roman numeral",
		);
	});
});
