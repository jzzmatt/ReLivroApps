import {expect, test} from "@playwright/test";

const confirmedEmail = process.env.SMOKE_TEST_EMAIL || "cursor.desktop.1790524895@gmail.com";
const confirmedPassword = process.env.SMOKE_TEST_PASSWORD || "TestPass123!";

async function waitForAuthHydration(page: import("@playwright/test").Page) {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", {name: "Entre na sua conta."})).toBeVisible();
}

test.describe("Desktop auth smoke", () => {
  test("sign up form and optional submit", async ({page}) => {
    await waitForAuthHydration(page);
    await page.getByRole("button", {name: "Ainda não tenho conta"}).click();
    await expect(page.getByRole("heading", {name: "Junte-se à comunidade."})).toBeVisible();
    await expect(page.getByPlaceholder("O seu nome")).toBeVisible();
    await expect(page.getByRole("button", {name: "Criar conta"})).toBeVisible();

    if (process.env.SMOKE_SUBMIT_SIGNUP !== "1") return;

    const unique = `cursor.ui.${Date.now()}@gmail.com`;
    await page.getByPlaceholder("O seu nome").fill("Desktop UI Test");
    await page.getByPlaceholder("nome@email.com").fill(unique);
    await page.locator('input[type="password"]').fill("TestPass123!");
    await page.locator("form .button").click();
    await expect(page.locator(".auth-message")).toBeVisible({timeout: 20_000});
    const message = (await page.locator(".auth-message").innerText()).toLowerCase();
    expect(
      message.includes("conta criada") ||
        message.includes("account") ||
        message.includes("compte") ||
        message.includes("rate limit"),
    ).toBeTruthy();
  });

  test("sign in, browse books, open profile", async ({page}) => {
    await waitForAuthHydration(page);
    await page.getByPlaceholder("nome@email.com").fill(confirmedEmail);
    await page.locator('input[type="password"]').fill(confirmedPassword);
    await page.locator("form .button").click();
    await page.waitForURL("**/books", {timeout: 30_000});
    await expect(page.locator("h1")).toBeVisible();
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.locator("h1")).toContainText(/Cursor Desktop|Membro|Member/i);
  });
});
