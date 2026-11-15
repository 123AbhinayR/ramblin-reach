import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("welcome page fits viewports, has no overflow, and both buttons work", async ({ page }) => {
  await mkdir("docs/screenshots", { recursive: true });

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Get unstuck on your project with help from Georgia Tech alumni and students"
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `docs/screenshots/welcome-${width}.png`, fullPage: true });
  }

  // Test primary button "Sign in"
  await page.goto("/");
  await page.locator(".welcome-actions").getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login$/);

  // Test secondary button "Browse Circles"
  await page.goto("/");
  await page.locator(".welcome-actions").getByRole("link", { name: "Browse Circles" }).click();
  await expect(page).toHaveURL(/\/circles$/);

  // Accessibility check
  await page.goto("/");
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
});
