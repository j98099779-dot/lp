import { test as base, expect, type Locator } from "@playwright/test";

// Every flow also checks for uncaught client errors after hydration.
const test = base.extend({
  page: async ({ page }, runFixture) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await runFixture(page);
    expect(errors, "The landing page should not throw client errors").toEqual([]);
  },
});

async function expectLoadedImage(image: Locator) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => {
    const photo = element as HTMLImageElement;
    return photo.complete && photo.naturalWidth > 0;
  })).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
});

test("presents the six services without invented testimonials or contact information", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Ateliê Nails Studio" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();

  const services = page.locator(".procedure-list details");
  await expect(services).toHaveCount(6);
  for (const name of ["Alongamento", "Banho de gel", "Blindagem", "Esmaltação em gel", "Manicure", "Nail art"]) {
    await expect(page.locator(".procedure-list summary").filter({ hasText: name })).toBeVisible();
  }
  await expect(page.locator(".stories-placeholder")).toContainText("relatos reais");
  await expect(page.locator("blockquote")).toHaveCount(0);
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.locator(".footer-information")).toHaveCount(0);
});

test("keeps the page within the viewport at every supported size", async ({ page }) => {
  const bounds = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    sections: [...document.querySelectorAll("main > section, header, footer")].map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }),
  }));
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.viewport + 1);
  for (const section of bounds.sections) {
    expect(section.left).toBeGreaterThanOrEqual(-1);
    expect(section.right).toBeLessThanOrEqual(bounds.viewport + 1);
  }
});

test("navigation supports keyboard focus, Escape and anchor selection", async ({ page }) => {
  const menu = page.locator("details[data-mobile-menu]");
  const toggle = menu.locator("summary");
  await toggle.click();
  await expect(menu).toHaveAttribute("open", "");

  await toggle.focus();
  await page.keyboard.press("Tab");
  await expect(menu.locator("nav a").first()).toBeFocused();
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Shift+Tab");
  await expect(toggle).toBeFocused();
  await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open");
  await expect(toggle).toBeFocused();

  await toggle.click();
  await menu.getByRole("link", { name: "Procedimentos", exact: true }).click();
  await expect(page).toHaveURL(/#procedimentos$/);
  await expect(menu).not.toHaveAttribute("open");
  await expect(page.locator("#procedimentos")).toBeInViewport();
});

test("opens useful service information and FAQ answers by keyboard", async ({ page }) => {
  const service = page.locator(".procedure-list details").first();
  const serviceToggle = service.locator("summary");
  await serviceToggle.focus();
  await page.keyboard.press("Enter");
  await expect(service).toHaveAttribute("open", "");
  await expect(service.locator(".procedure-content > p")).toBeVisible();
  await expect(service.getByRole("button", { name: "Consultar este procedimento" })).toBeVisible();

  const question = page.locator(".faq-item").first();
  const questionToggle = question.locator("summary");
  await questionToggle.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("p")).toBeVisible();
  await expect(question.locator("p")).toContainText("confirmação");
  await page.keyboard.press("Enter");
  await expect(question).not.toHaveAttribute("open");
  await expect(question.locator("p")).not.toBeVisible();
});

test("shows an honest booking notice until WhatsApp is configured", async ({ page }) => {
  const booking = page.getByRole("button", { name: "Solicitar horário", exact: true });
  await booking.click();
  const dialog = page.getByRole("dialog", { name: "Vamos conversar em breve" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("será disponibilizado em breve");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(booking).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  await booking.click();
  await dialog.getByRole("link", { name: "CONHECER OS SERVIÇOS" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#procedimentos$/);
  await expect(page.locator("#procedimentos")).toBeInViewport();
});

test("carousel controls select and wrap through all three inspirations", async ({ page }) => {
  const carousel = page.getByRole("region", { name: "Inspirações de unhas" });
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.getByRole("button")).toHaveCount(3);

  await page.getByRole("button", { name: "Próxima inspiração", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ver Francesinha contemporânea", exact: true })).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "Ver Nail art sutil", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ver Nail art sutil", exact: true })).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "Próxima inspiração", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ver Nude delicado", exact: true })).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "Inspiração anterior", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ver Nail art sutil", exact: true })).toHaveAttribute("aria-current", "true");
});

test("enlarged gallery supports arrows, focus trapping and return focus", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Ampliar Nude delicado, imagem 1 de 3", exact: true });
  await trigger.click();
  let dialog = page.getByRole("dialog", { name: "Nude delicado", exact: true });
  await expect(dialog).toBeVisible();
  const close = page.getByRole("button", { name: "Fechar imagem ampliada", exact: true });
  const next = page.getByRole("button", { name: "Ampliar próxima inspiração", exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(next).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();

  await page.keyboard.press("ArrowRight");
  dialog = page.getByRole("dialog", { name: "Francesinha contemporânea", exact: true });
  await expect(dialog).toBeVisible();
  await expectLoadedImage(dialog.locator("img"));
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog", { name: "Nude delicado", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("loads every original photograph and identifies conceptual imagery", async ({ page }) => {
  await expectLoadedImage(page.locator(".portrait-image"));
  const studioImage = page.locator(".experience-image img");
  await studioImage.scrollIntoViewIfNeeded();
  await expectLoadedImage(studioImage);
  await expect(page.locator(".concept-note")).toContainText("IA");

  const carousel = page.getByRole("region", { name: "Inspirações de unhas" });
  await carousel.scrollIntoViewIfNeeded();
  for (const name of ["Nude delicado", "Francesinha contemporânea", "Nail art sutil"]) {
    await page.getByRole("button", { name: `Ver ${name}`, exact: true }).click();
    const photograph = carousel.getByRole("button", { name: new RegExp(`^Ampliar ${name},`) }).locator("img");
    await expectLoadedImage(photograph);
    await expect(photograph).toHaveAttribute("alt", /inteligência artificial/);
  }
});
