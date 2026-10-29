import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("price alerts persist, pause, trigger across routes, and fire once", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page);
  await page.clock.install();
  let price = 3900;
  await page.route("https://api.gold-api.com/price/XAU", (route) =>
    route.fulfill({
      json: {
        symbol: "XAU",
        currency: "USD",
        price,
        updatedAt: new Date().toISOString(),
      },
    }),
  );
  await page.goto("/dashboard/markets");
  await page.getByRole("button", { name: "Open price alerts" }).click();
  await page.getByLabel("Target price (USD)").fill("4000");
  await page.getByRole("button", { name: "Create alert", exact: true }).click();
  const card = page.locator(".price-alert-card");
  await expect(card).toContainText("3,900 USD");
  await card.getByRole("button", { name: "Pause", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Open price alerts" }).click();
  await expect(card).toContainText("paused");
  await card.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(card).toContainText("3,900 USD");
  price = 4100;
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Journal", exact: true })
    .click();
  await page.clock.runFor(31000);
  await expect(page.locator(".price-alert-toast")).toContainText(
    "XAUUSD: 4,100 USD",
  );
  await page.getByRole("button", { name: "Dismiss alert" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Markets", exact: true })
    .click();
  await page.getByRole("button", { name: "Open price alerts" }).click();
  await expect(card).toContainText("triggered");
  await expect(card).toContainText("Triggered at 4,100 USD");
  await page.clock.runFor(31000);
  await expect(page.locator(".price-alert-toast")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "Open price alerts" }).click();
  await expect(card).toContainText("triggered");
  await card.getByRole("button", { name: "Rearm", exact: true }).click();
  await expect(page.locator(".price-alert-toast")).toBeVisible();
  await card.getByRole("button", { name: "Delete XAUUSD alert" }).click();
  await expect(card).toHaveCount(0);
});

test("mobile alerts reject stale prices and retry without false alarms", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page);
  await page.clock.install();
  await page.setViewportSize({ width: 390, height: 844 });
  let fail = false;
  await page.route("https://api.gold-api.com/price/XAU", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "Unavailable" })
      : route.fulfill({
          json: {
            symbol: "XAU",
            price: 5000,
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
          },
        }),
  );
  await page.goto("/dashboard/markets");
  await page.getByRole("button", { name: "Open price alerts" }).click();
  await page.getByLabel("Target price (USD)").fill("4000");
  await page.getByRole("button", { name: "Create alert", exact: true }).click();
  await expect(page.locator(".price-alert-card")).toContainText(
    "No fresh price",
  );
  await expect(page.locator(".price-alert-toast")).toHaveCount(0);
  await expect(
    page.getByText("Forex alerts need a separate live feed", { exact: false }),
  ).toBeVisible();
  expect(
    await page
      .getByLabel("Alert instrument")
      .locator("option")
      .allTextContents(),
  ).not.toContain("EURUSD");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/alerts-mobile.png",
    fullPage: true,
  });
  fail = true;
  await page.clock.runFor(31000);
  await expect(page.locator(".price-alert-card")).toContainText(
    "Price feed unavailable",
  );
  await expect(page.locator(".price-alert-toast")).toHaveCount(0);
});
const owner = "11111111-1111-4111-8111-111111111111";
const account = {
  id: "33333333-3333-4333-8333-333333333333",
  user_id: owner,
  name: "Trading account",
  currency: "USD",
  kind: "Demo",
  starting_balance: 10000,
  created_at: "2026-01-01",
};
const user = {
  id: owner,
  email: "trader@example.com",
  role: "authenticated",
  aud: "authenticated",
  user_metadata: { name: "Test Trader" },
  created_at: "2026-01-01",
};
async function fixtures(page, { signedIn = true } = {}) {
  const rows = {
    accounts: [account],
    profiles: [
      {
        id: owner,
        name: "Test Trader",
        currency: "USD",
        timezone: "Asia/Kolkata",
      },
    ],
    trades: [
      {
        id: "44444444-4444-4444-8444-444444444444",
        user_id: owner,
        account_id: account.id,
        instrument: "EURUSD",
        direction: "Long",
        status: "Closed",
        traded_at: "2026-10-20T08:00:00Z",
        closed_at: "2026-10-20T10:00:00Z",
        net_pnl: 125,
        initial_risk: 50,
        reviewed: false,
        details: { session: "London", images: [] },
        deleted_at: null,
      },
    ],
    strategies: [],
    mistakes: [],
    notes: [],
    daily_reviews: [],
  };
  if (signedIn)
    await page.addInitScript(
      ({ user }) => {
        const encode = (v) =>
          btoa(JSON.stringify(v))
            .replaceAll("=", "")
            .replaceAll("+", "-")
            .replaceAll("/", "_");
        const token =
          encode({ alg: "HS256", typ: "JWT" }) +
          "." +
          encode({
            sub: user.id,
            exp: Math.floor(Date.now() / 1000) + 3600,
            role: "authenticated",
          }) +
          ".test";
        localStorage.setItem(
          "sb-journal-test-auth-token",
          JSON.stringify({
            access_token: token,
            refresh_token: "test-refresh",
            token_type: "bearer",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            expires_in: 3600,
            user,
          }),
        );
      },
      { user },
    );
  await page.route("https://journal-test.supabase.co/**", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (url.pathname.includes("/auth/v1/token"))
      return route.fulfill({
        status: 400,
        json: {
          error: "invalid_grant",
          error_description: "Invalid login credentials",
        },
      });
    if (url.pathname.includes("/auth/v1/user"))
      return route.fulfill({ json: user });
    if (url.pathname.includes("/auth/v1/logout"))
      return route.fulfill({ status: 204 });
    const table = url.pathname.split("/").pop();
    let data = rows[table] || [];
    const object = req.headers().accept?.includes("vnd.pgrst.object");
    if (req.method() === "GET") {
      for (const [key, value] of url.searchParams) {
        if (value.startsWith("eq."))
          data = data.filter((r) => String(r[key]) === value.slice(3));
        if (value === "is.null") data = data.filter((r) => r[key] == null);
        if (value === "not.is.null") data = data.filter((r) => r[key] != null);
      }
      return route.fulfill({ json: object ? data[0] || null : data });
    }
    const input = req.postDataJSON();
    if (req.method() === "POST") {
      const item = {
        ...input,
        id: input.id || crypto.randomUUID(),
        user_id: owner,
        deleted_at: null,
      };
      rows[table].push(item);
      return route.fulfill({ status: 201, json: object ? item : [item] });
    }
    if (req.method() === "PATCH") {
      const id = url.searchParams.get("id")?.slice(3),
        item = rows[table].find((r) => r.id === id);
      if (item) Object.assign(item, input);
      return route.fulfill({ json: object ? item : [item] });
    }
    return route.fulfill({ json: [] });
  });
  return rows;
}
test("failed passwords never create an authenticated session", async ({
  page,
}) => {
  await fixtures(page, { signedIn: false });
  await page.goto("/login");
  await page.getByLabel("Email address").fill("trader@example.com");
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Invalid login credentials",
  );
  await expect(page).toHaveURL(/login/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/login/);
});
test("account-separated overview renders without overflow on desktop, tablet and mobile", async ({
  page,
}) => {
  await fixtures(page);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 820, 1180],
    ["mobile", 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "A clearer view of your trading." }),
    ).toBeVisible();
    await expect(
      page.getByText("$125.00", { exact: true }).first(),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "test-results/overview-" + name + ".png",
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByText("Accounts", { exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "A place for every account." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("creates, edits, deletes and restores a zero-result trade", async ({
  page,
}) => {
  const rows = await fixtures(page);
  await page.goto("/dashboard/add-trade");
  await page.getByLabel("Trading account").selectOption(account.id);
  await page.getByLabel("Instrument", { exact: true }).fill("BTCUSD");
  await page.getByLabel("Broker-reported net P&L").fill("0");
  await page.getByLabel("Initial risk amount").fill("25");
  await page.getByLabel("Mark as reviewed").check();
  await page.getByRole("button", { name: "Save trade", exact: true }).click();
  await expect(page).toHaveURL(/journal/);
  expect(rows.trades).toHaveLength(2);
  expect(rows.trades[1].net_pnl).toBe("0.00");
  expect(rows.trades[1].reviewed).toBe(true);
  const id = rows.trades[1].id;
  await page.goto("/dashboard/trade/" + id + "/edit");
  await page.getByLabel("Broker-reported net P&L").fill("-50");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/journal/);
  expect(rows.trades[1].net_pnl).toBe("-50.00");
  await page.goto("/dashboard/trade/" + id);
  await page.getByRole("button", { name: "Delete trade", exact: true }).click();
  await page.getByRole("button", { name: "Confirm deletion" }).click();
  await expect(page).toHaveURL(/journal/);
  await expect(page.getByText("BTCUSD", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Recently deleted" }).click();
  await page.getByRole("button", { name: "Restore", exact: true }).click();
  expect(rows.trades[1].deleted_at).toBe(null);
  await page.getByRole("button", { name: "Back to journal" }).click();
  await expect(page.getByText("BTCUSD", { exact: true })).toBeVisible();
});
test("drafts survive reload and daily reviews save", async ({ page }) => {
  const rows = await fixtures(page);
  await page.goto("/dashboard/add-trade");
  await page.getByLabel("Instrument", { exact: true }).fill("XAUUSD");
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page.reload();
  await expect(page.getByLabel("Instrument", { exact: true })).toHaveValue(
    "XAUUSD",
  );
  await page.goto("/dashboard/review?day=2026-10-20");
  await page
    .getByLabel("Before the session")
    .fill("Only take the planned setup.");
  await page
    .getByLabel("One adjustment for tomorrow")
    .fill("Wait for confirmation.");
  await page.getByRole("button", { name: "Save daily review" }).click();
  await expect(page.getByRole("status")).toContainText("Review saved");
  expect(rows.daily_reviews[0].plan).toBe("Only take the planned setup.");
});

test("all workspace pages fit a phone and libraries support keyboard dismissal", async ({
  page,
}) => {
  await fixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of [
    "journal",
    "statistics",
    "calendar",
    "accounts",
    "review",
    "settings",
    "strategies",
    "mistakes",
    "notes",
    "add-trade",
  ]) {
    await page.goto("/dashboard/" + path);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/dashboard/strategies");
  await page.getByRole("button", { name: "Add strategy" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Strategy name").fill("Opening range");
  await page.getByRole("button", { name: "Save strategy" }).click();
  await page.getByRole("button", { name: /Opening range/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("different account currencies are never combined", async ({ page }) => {
  const rows = await fixtures(page);
  const second = {
    ...account,
    id: "55555555-5555-4555-8555-555555555555",
    currency: "INR",
    name: "Indian account",
  };
  rows.accounts.push(second);
  rows.trades.push({
    ...rows.trades[0],
    id: "66666666-6666-4666-8666-666666666666",
    account_id: second.id,
    net_pnl: 5000,
  });
  await page.goto("/dashboard");
  await expect(
    page.getByText("$125.00", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("$5,125.00", { exact: true })).toHaveCount(0);
  await page.getByLabel("Trading account").selectOption(second.id);
  await expect(
    page.getByText("₹5,000.00", { exact: true }).first(),
  ).toBeVisible();
});

test("appearance settings persist and System follows the device", async ({
  page,
}) => {
  await fixtures(page);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/dashboard/settings");
  await expect(
    page.getByRole("radio", { name: "System", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.getByRole("radio", { name: "Light", exact: true }).check();
  await expect(page.locator("html")).not.toHaveClass("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await page.getByRole("radio", { name: "Dark", exact: true }).check();
  await page.reload();
  await expect(
    page.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.getByRole("radio", { name: "System", exact: true }).check();
  await expect(page.locator("html")).not.toHaveClass("dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass("dark");
  expect(
    await page.locator(".workspace-sidebar nav a").allTextContents(),
  ).toEqual([
    "Overview",
    "Markets",
    "Journal",
    "Calendar",
    "Analytics",
    "Playbook",
    "Daily review",
    "Mistakes",
    "Notes",
    "Accounts",
    "Settings",
  ]);
  await expect(
    page
      .locator(".workspace-sidebar")
      .getByRole("button", { name: /appearance|sign out/i }),
  ).toHaveCount(0);
  await expect(page.locator(".sidebar-bottom")).toHaveCount(0);
  await page.screenshot({
    path: "test-results/settings-appearance-desktop.png",
    fullPage: true,
  });
});
test("mobile avatar menu supports profile, Escape, outside dismissal and sign out", async ({
  page,
}) => {
  await fixtures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  const trigger = page.getByRole("button", {
    name: "Account options",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("navigation", { name: "Account options" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.locator(".metric-grid").click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.getByRole("link", { name: "Profile & settings" }).click();
  await expect(page).toHaveURL(/settings/);
  await expect(
    page.getByRole("heading", { name: "Appearance", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/settings-appearance-mobile.png",
    fullPage: true,
  });
  await trigger.click();
  await page.screenshot({ path: "test-results/account-menu-mobile.png" });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/login/);
});

test("private screenshot uploads and authenticated downloads use Supabase Storage", async ({
  page,
}) => {
  const rows = await fixtures(page);
  const png = await readFile("tests/fixtures/chart.png");
  let uploaded = false,
    downloaded = false;
  await page.route(
    "https://journal-test.supabase.co/storage/v1/**",
    async (route) => {
      const req = route.request();
      expect(req.headers().authorization).toMatch(/^Bearer /);
      if (req.method() === "POST") {
        expect(new URL(req.url()).pathname).toContain(
          "/object/journal-images/" + owner + "/",
        );
        uploaded = true;
        return route.fulfill({
          status: 200,
          json: { Key: "journal-images/sample", Id: "sample-id" },
        });
      }
      if (req.method() === "GET") {
        downloaded = true;
        return route.fulfill({
          status: 200,
          contentType: "image/png",
          body: png,
        });
      }
      return route.fulfill({ json: [] });
    },
  );
  await page.goto("/dashboard/add-trade");
  await page.getByLabel("Trading account").selectOption(account.id);
  await page.getByLabel("Instrument", { exact: true }).fill("XAUUSD");
  await page.getByLabel("Broker-reported net P&L").fill("25");
  await page
    .getByLabel("Choose screenshots")
    .setInputFiles("tests/fixtures/chart.png");
  await page.getByRole("button", { name: "Save trade", exact: true }).click();
  await expect(page).toHaveURL(/journal/);
  expect(uploaded).toBe(true);
  expect(rows.trades[1].details.images[0]).toMatch(
    new RegExp("^supabase:" + owner + "/"),
  );
  await page.goto("/dashboard/trade/" + rows.trades[1].id);
  await page.waitForFunction(() => {
    const image = document.querySelector(".trade-screenshot");
    return image?.complete && image.naturalWidth > 0;
  });
  expect(downloaded).toBe(true);
});
test("missing screenshot bucket explains setup without saving a partial trade", async ({
  page,
}) => {
  const rows = await fixtures(page);
  await page.route("https://journal-test.supabase.co/storage/v1/**", (route) =>
    route.fulfill({
      status: 400,
      json: {
        statusCode: "404",
        error: "Bucket not found",
        message: "Bucket not found",
      },
    }),
  );
  await page.goto("/dashboard/add-trade");
  await page.getByLabel("Trading account").selectOption(account.id);
  await page.getByLabel("Instrument", { exact: true }).fill("XAUUSD");
  await page.getByLabel("Broker-reported net P&L").fill("25");
  await page
    .getByLabel("Choose screenshots")
    .setInputFiles("tests/fixtures/chart.png");
  await page.getByRole("button", { name: "Save trade", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "002_private_storage.sql",
  );
  expect(rows.trades).toHaveLength(1);
});

test("an empty workspace shows empty states instead of sample trades", async ({
  page,
}) => {
  const rows = await fixtures(page);
  for (const records of Object.values(rows)) records.length = 0;
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "First, create a trading account" }),
  ).toBeVisible();
  await expect(page.locator(".metric-grid")).toHaveCount(0);
  await page.goto("/dashboard/journal");
  await expect(
    page.getByRole("heading", { name: "No trades found", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".trade-table tbody tr")).toHaveCount(0);
  await page.goto("/dashboard/statistics");
  await expect(
    page.getByRole("heading", { name: "No closed trades in this period" }),
  ).toBeVisible();
  await expect(page.getByText("EURUSD", { exact: true })).toHaveCount(0);
});
test("failed trade requests show a retryable error instead of fabricated results", async ({
  page,
}) => {
  await fixtures(page);
  await page.route(
    "https://journal-test.supabase.co/rest/v1/trades?**",
    (route) =>
      route.fulfill({
        status: 500,
        json: { message: "Test database unavailable" },
      }),
  );
  await page.goto("/dashboard");
  await expect(page.getByRole("alert")).toContainText(
    "Test database unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Retry", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".metric-grid")).toHaveCount(0);
});

async function marketEmbedFixture(page, { blocked = false } = {}) {
  await page.route(
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
    (route) => {
      if (blocked) return route.abort();
      return route.fulfill({
        contentType: "application/javascript",
        body: `
          (() => {
          const script=document.currentScript;
   const config=JSON.parse(script.textContent);
   window.__marketConfigs ||= [];
   window.__marketConfigs.push(config);
   const frame=document.createElement('iframe');
   frame.srcdoc='<html><body><p>External chart test fixture</p></body></html>';
          script.parentElement.querySelector('.tradingview-widget-container__widget').append(frame);
          })();
  `,
      });
    },
  );
}
test("Markets saves a watchlist, changes provider/timeframe, and follows the app theme", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/dashboard/markets");
  await expect(
    page.getByRole("heading", { name: "Markets", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".market-chart-host iframe")).toHaveCount(1);
  await page.getByLabel("Chart symbol").selectOption("BITSTAMP:BTCUSD");
  await page.getByLabel("Chart timeframe").selectOption("15");
  await page
    .getByRole("button", {
      name: "Save selected symbol to watchlist",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(page.locator(".market-symbol-choice")).toHaveCount(1);
  await page.reload();
  await expect(page.getByLabel("Chart symbol")).toHaveValue("BITSTAMP:BTCUSD");
  await expect(page.getByLabel("Chart timeframe")).toHaveValue("15");
  await expect(
    page.getByRole("button", {
      name: "Remove selected symbol from watchlist",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect
    .poll(() => page.evaluate(() => window.__marketConfigs?.at(-1)?.theme))
    .toBe("dark");
  await expect(page.locator(".market-chart-host iframe")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.__marketConfigs?.at(-1)?.symbol))
    .toBe("BITSTAMP:BTCUSD");
  await page.getByLabel("Search market symbols").fill("Gold");
  await expect(page.locator(".market-symbol-choice")).toHaveCount(1);
  await page.locator(".market-symbol-choice").click();
  await expect(page.getByLabel("Chart symbol")).toHaveValue("OANDA:XAUUSD");
  await page.screenshot({
    path: "test-results/markets-desktop.png",
    fullPage: true,
  });
});
test("Markets fits a phone, expands the chart and prefills trade entry without overwriting another draft", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page);
  await page.goto("/dashboard/add-trade");
  await page.getByLabel("Instrument", { exact: true }).fill("GBPJPY");
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Markets", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Chart symbol").selectOption("OANDA:XAUUSD");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Expand chart", exact: true }).click();
  await expect(page.locator(".market-terminal")).toHaveClass(/expanded/);
  await page.keyboard.press("Escape");
  await expect(page.locator(".market-terminal")).not.toHaveClass(/expanded/);
  await page.screenshot({
    path: "test-results/markets-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Log XAUUSD trade", exact: true })
    .click();
  await expect(page.getByLabel("Instrument", { exact: true })).toHaveValue(
    "XAUUSD",
  );
  await page.goto("/dashboard/add-trade");
  await expect(page.getByLabel("Instrument", { exact: true })).toHaveValue(
    "GBPJPY",
  );
});
test("a blocked market embed shows a retryable error without simulated candles", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page, { blocked: true });
  await page.goto("/dashboard/markets");
  await expect(page.getByRole("alert")).toContainText(
    "The chart couldn’t connect.",
  );
  await expect(page.locator(".market-chart-host iframe")).toHaveCount(0);
  await page.unroute(
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
  );
  await marketEmbedFixture(page);
  await page.getByRole("button", { name: "Retry chart", exact: true }).click();
  await expect(page.locator(".market-chart-host iframe")).toHaveCount(1);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("desktop sidebar collapses to working icon links and remembers its width", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dashboard");
  const sidebar = page.locator(".workspace-sidebar");
  await expect
    .poll(async () => Math.round((await sidebar.boundingBox()).width))
    .toBe(232);
  await page
    .getByRole("button", { name: "Collapse sidebar", exact: true })
    .press("Enter");
  await expect
    .poll(async () => Math.round((await sidebar.boundingBox()).width))
    .toBe(76);
  await expect(
    page.getByRole("button", { name: "Expand sidebar", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(sidebar.locator(".brand-text")).toBeHidden();
  const markets = page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Markets", exact: true });
  await expect(markets).toBeVisible();
  await markets.press("Enter");
  await expect(page).toHaveURL(/markets/);
  await expect
    .poll(async () =>
      Math.round((await page.locator(".workspace-body").boundingBox()).x),
    )
    .toBe(76);
  await page.reload();
  await expect
    .poll(async () => Math.round((await sidebar.boundingBox()).width))
    .toBe(76);
  await page.screenshot({
    path: "test-results/sidebar-collapsed-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Expand sidebar", exact: true })
    .press("Space");
  await expect
    .poll(async () => Math.round((await sidebar.boundingBox()).width))
    .toBe(232);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Collapse sidebar", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
});
test("a saved desktop collapse keeps the mobile navigation fully labelled", async ({
  page,
}) => {
  await fixtures(page);
  await page.addInitScript(() =>
    localStorage.setItem("sidebar-collapsed", "true"),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await expect(
    page.getByRole("button", { name: "Expand sidebar", exact: true }),
  ).toBeHidden();
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByText("Overview", { exact: true })).toBeVisible();
  await expect(nav.getByText("Markets", { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      Math.round(
        (await page.locator(".workspace-sidebar").boundingBox()).width,
      ),
    )
    .toBe(250);
  await page.screenshot({
    path: "test-results/sidebar-collapsed-mobile-menu.png",
  });
  await nav.getByRole("link", { name: "Journal", exact: true }).click();
  await expect(page).toHaveURL(/journal/);
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("top navigation stays pinned while scrolling and sidebar controls stay inside the sidebar", async ({
  page,
}) => {
  await fixtures(page);
  for (const viewport of [
    { width: 1440, height: 700 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard/settings");
    await expect(
      page.getByRole("heading", { name: "Make it yours." }),
    ).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 700));
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
    await expect
      .poll(async () =>
        Math.round((await page.locator(".workspace-topbar").boundingBox()).y),
      )
      .toBe(0);
    await expect(
      page.getByRole("button", { name: "Account options", exact: true }),
    ).toBeInViewport();
    await expect(
      page.locator(".workspace-topbar .desktop-sidebar-toggle"),
    ).toHaveCount(0);
    if (viewport.width > 767) {
      await page
        .locator(".workspace-sidebar")
        .getByRole("button", { name: "Collapse sidebar", exact: true })
        .click();
      await expect
        .poll(async () =>
          Math.round((await page.locator(".workspace-topbar").boundingBox()).x),
        )
        .toBe(76);
      await page
        .locator(".workspace-sidebar")
        .getByRole("button", { name: "Expand sidebar", exact: true })
        .click();
    }
  }
});
test("market terminal places the watchlist to the right and lets the chart reclaim that space", async ({
  page,
}) => {
  await fixtures(page);
  await marketEmbedFixture(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dashboard/markets");
  await expect(page.locator(".market-chart-host iframe")).toHaveCount(1);
  const chart = page.locator(".market-chart-panel"),
    watchlist = page.getByRole("complementary", { name: "Market symbols" });
  const initial = await chart.boundingBox(),
    right = await watchlist.boundingBox();
  expect(right.x).toBeGreaterThan(initial.x);
  expect(Math.abs(right.y - initial.y)).toBeLessThan(2);
  expect(
    (await page.locator(".market-chart-host").boundingBox()).height,
  ).toBeGreaterThan(650);
  await page
    .getByRole("button", { name: "Hide watchlist", exact: true })
    .click();
  await expect(watchlist).toHaveCount(0);
  expect((await chart.boundingBox()).width).toBeGreaterThan(
    initial.width + 200,
  );
  await page
    .getByRole("button", { name: "Show watchlist", exact: true })
    .click();
  await expect(watchlist).toBeVisible();
  await page
    .locator(".workspace-sidebar")
    .getByRole("button", { name: "Collapse sidebar", exact: true })
    .click();
  await expect
    .poll(async () =>
      Math.round(
        (await page.locator(".workspace-sidebar").boundingBox()).width,
      ),
    )
    .toBe(76);
  await page.screenshot({ path: "test-results/market-terminal-desktop.png" });
});
