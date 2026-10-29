import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
if (!process.env.DEMO_EMAIL || !process.env.DEMO_PASSWORD)
  throw new Error(
    "Provide account credentials through the process environment.",
  );
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("http://127.0.0.1:5173/login");
  await page.getByLabel("Email address").fill(process.env.DEMO_EMAIL);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.DEMO_PASSWORD);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/dashboard", { timeout: 20000 });
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Markets", exact: true })
    .click();
  await page
    .locator(".workspace-sidebar")
    .getByRole("button", { name: "Collapse sidebar", exact: true })
    .click();
  await mkdir("test-results", { recursive: true });
  for (const symbol of ["OANDA:EURUSD", "OANDA:XAUUSD", "BITSTAMP:BTCUSD"]) {
    await page.getByLabel("Chart symbol").selectOption(symbol);
    const frame = page.frameLocator(".market-chart-host iframe");
    await frame.locator("canvas").first().waitFor({ timeout: 45000 });
    await expect
      .poll(() => frame.locator("body").innerText(), { timeout: 45000 })
      .toMatch(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d{4,}/);
    await frame
      .locator("body")
      .evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
    const canvases = await frame.locator("canvas").count();
    assert.ok(canvases > 0);
    console.log(JSON.stringify({ symbol, providerCanvasCount: canvases }));
    await page.screenshot({
      path: "test-results/live-market-" + symbol.replace(":", "-") + ".png",
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({
    path: "test-results/live-market-mobile.png",
    fullPage: true,
  });
} finally {
  await browser.close();
}
