import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { z } from "zod";
import { randomUUID } from "node:crypto";

const accountSchema = z.array(z.object({ name: z.string(), email: z.email(), password: z.string() }));
async function account(name: string) {
  const accounts = accountSchema.parse(JSON.parse(await readFile(".tmp/demo-accounts.json", "utf8")));
  const result = accounts.find(a => a.name === name);
  if (!result) throw new Error("Run npm run db:seed before authenticated browser tests.");
  return result;
}
test("E01 real Auth login, persisted profile and sign-out", async ({ page }) => {
  const user = await account("student");
  await page.goto("/login");
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Demo account · fictional profile, real authenticated session")).toBeVisible();
  await page.getByRole("link", { name: "Set up your profile" }).click();
  await page.getByLabel("A little about you").fill("Fictional learner exploring campus resources.");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toContainText("Profile saved");
  await page.reload();
  await expect(page.getByLabel("A little about you")).toHaveValue("Fictional learner exploring campus resources.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login$/);
});
test("S03 pending account cannot enter member workspace", async ({ page }) => {
  const user = await account("A12");
  await page.goto("/login");
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("Your connection to Georgia Tech").selectOption("alumni");
  await page.getByRole("button", { name: "Request membership review" }).click();
  await expect(page.getByRole("status")).toContainText("manual review");
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/onboarding$/);
});
test("S25 unauthenticated writes and foreign-origin login fail", async ({ request }) => {
  const unauthenticated = await request.put("/api/profile", { data: {}, headers: { Origin: "http://127.0.0.1:3000" } });
  expect(unauthenticated.status()).toBe(401);
  expect(unauthenticated.headers()["cache-control"]).toContain("no-store");
  const crossOrigin = await request.post("/api/auth/login", { data: { email: "nobody@example.test", password: "test-password-long" }, headers: { Origin: "https://untrusted.example" } });
  expect(crossOrigin.status()).toBe(403);
});

test("E01 signup confirmation and password recovery use actual email links", async ({ page, request }) => {
  const email = `test.${randomUUID()}@example.test`;
  const password = `First-${randomUUID()}`;
  async function emailLink(subject: string) {
    const messagesSchema = z.object({ messages: z.array(z.object({ ID: z.string(), Subject: z.string(), To: z.array(z.object({ Address: z.string() })) })) });
    let id: string | undefined;
    await expect.poll(async () => {
      const response = await request.get("http://127.0.0.1:54324/api/v1/messages");
      const messages = messagesSchema.parse(await response.json()).messages;
      id = messages.find(m => m.To.some(to => to.Address === email) && m.Subject.toLowerCase().includes(subject))?.ID;
      return Boolean(id);
    }).toBe(true);
    const response = await request.get(`http://127.0.0.1:54324/api/v1/message/${id}`);
    const body = z.object({ HTML: z.string() }).parse(await response.json());
    const href = body.HTML.match(/href="([^"]+\/auth\/v1\/verify[^"]*)"/)?.[1]?.replaceAll("&amp;", "&");
    if (!href || new URL(href).origin !== "http://127.0.0.1:54321") throw new Error("Expected a local authentication link.");
    return href;
  }
  await page.goto("/login?mode=signup");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toContainText("Check your email");
  await page.goto(await emailLink("confirm"));
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("status")).toContainText("If this email has an account");
  await page.goto(await emailLink("reset"));
  await expect(page).toHaveURL(/mode=reset$/);
  const updated = `Updated-${randomUUID()}`;
  await page.getByLabel("New password").fill(updated);
  await page.getByRole("button", { name: "Save new password" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(updated);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
});
