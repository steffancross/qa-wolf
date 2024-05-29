import { test, expect } from "@playwright/test";

test("check articles are present", async ({ page }) => {
  await page.goto("https://news.ycombinator.com");
  const articleLoaders = await page.locator("span.titleline").count();
  expect(articleLoaders).toBeGreaterThan(0);
});
