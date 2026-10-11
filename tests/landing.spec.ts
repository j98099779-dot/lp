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
  const desktopNavigation = page.locator(".desktop-navigation");
  if (page.viewportSize()!.width >= 1024) {
    await expect(menu).not.toBeVisible();
    await expect(desktopNavigation).toBeVisible();
    for (const name of ["Procedimentos", "O estúdio", "Inspirações", "Dúvidas"]) {
      await expect(desktopNavigation.getByRole("link", { name, exact: true })).toBeVisible();
    }
    const procedures = desktopNavigation.getByRole("link", { name: "Procedimentos", exact: true });
    await procedures.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#procedimentos$/);
    await expect(page.locator("#procedimentos")).toBeInViewport();
    return;
  }

  await expect(desktopNavigation).not.toBeVisible();
  await expect(menu).toBeVisible();
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

test("presents a usable carousel on small screens and three visible cards on desktop", async ({ page }) => {
  const carousel = page.getByRole("region", { name: "Inspirações de unhas" });
  await carousel.scrollIntoViewIfNeeded();
  const cards = carousel.getByRole("button");
  await expect(cards).toHaveCount(3);

  if (page.viewportSize()!.width >= 1024) {
    const positions = await cards.evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, width: rect.width, height: rect.height };
    }));
    for (let index = 0; index < positions.length; index++) {
      await expect(cards.nth(index)).toBeInViewport({ ratio: 0.95 });
      expect(Math.abs(positions[index].top - positions[0].top)).toBeLessThanOrEqual(1);
      expect(positions[index].width).toBeGreaterThan(200);
      expect(positions[index].width / positions[index].height).toBeCloseTo(350 / 310, 1);
      if (index > 0) expect(positions[index].left).toBeGreaterThan(positions[index - 1].right);
    }
    await expect(page.getByRole("button", { name: "Próxima inspiração", exact: true })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Ver Nude delicado", exact: true })).not.toBeVisible();
    return;
  }

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
    if (page.viewportSize()!.width < 1024) {
      await page.getByRole("button", { name: `Ver ${name}`, exact: true }).click();
    }
    const photograph = carousel.getByRole("button", { name: new RegExp(`^Ampliar ${name},`) }).locator("img");
    await expectLoadedImage(photograph);
    await expect(photograph).toHaveAttribute("alt", /inteligência artificial/);
  }
});

test("uses the available width while preserving readable content and photograph proportions", async ({ page }) => {
  const viewportWidth = page.viewportSize()!.width;
  const geometry = await page.evaluate(() => {
    const bounds = (selector: string) => {
      const element = document.querySelector(selector)!;
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const portrait = document.querySelector<HTMLImageElement>(".portrait-image")!;
    const studioImage = document.querySelector<HTMLImageElement>(".experience-image img")!;
    return {
      shell: bounds(".site-shell"),
      heroCopy: bounds(".hero-copy"),
      title: bounds(".hero-title"),
      portrait: bounds(".hero-portrait"),
      portraitFrame: bounds(".portrait-frame"),
      services: bounds(".procedure-list"),
      serviceCards: [...document.querySelectorAll(".procedure-item")].map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width };
      }),
      portraitFit: getComputedStyle(portrait).objectFit,
      studioFit: getComputedStyle(studioImage).objectFit,
    };
  });

  expect(geometry.portraitFit).toBe("cover");
  expect(geometry.studioFit).toBe("cover");

  if (viewportWidth >= 1024) {
    expect(geometry.portraitFrame.width).toBeGreaterThanOrEqual(300);
    expect(geometry.portraitFrame.width / geometry.portraitFrame.height).toBeCloseTo(4 / 5, 1);
    expect(geometry.shell.width).toBeGreaterThanOrEqual(viewportWidth - 1);
    expect(geometry.heroCopy.width).toBeGreaterThan(300);
    expect(geometry.heroCopy.right).toBeLessThanOrEqual(geometry.portrait.left + 1);
    expect(geometry.heroCopy.top).toBeLessThan(geometry.portrait.bottom);
    expect(geometry.portrait.top).toBeLessThan(geometry.heroCopy.bottom);
    expect(geometry.portrait.right - geometry.heroCopy.left).toBeLessThanOrEqual(1281);
    expect(geometry.services.width).toBeLessThanOrEqual(1281);
    expect(geometry.services.width).toBeGreaterThanOrEqual(Math.min(viewportWidth * 0.7, 1000));
    const cards = geometry.serviceCards;
    for (let index = 0; index < 3; index++) {
      expect(Math.abs(cards[index].top - cards[0].top)).toBeLessThanOrEqual(1);
      expect(cards[index].width).toBeGreaterThan(200);
      if (index > 0) expect(cards[index].left).toBeGreaterThan(cards[index - 1].right);
      expect(Math.abs(cards[index + 3].left - cards[index].left)).toBeLessThanOrEqual(1);
      expect(cards[index + 3].top).toBeGreaterThanOrEqual(cards[index].bottom);
    }
  } else {
    expect(geometry.portraitFrame.width / geometry.portraitFrame.height).toBeCloseTo(1, 1);
    expect(geometry.portrait.bottom).toBeLessThanOrEqual(geometry.title.top);
    if (viewportWidth >= 768) expect(geometry.shell.width).toBeGreaterThanOrEqual(viewportWidth * 0.9);
  }
});

test("keeps added desktop booking actions available without altering the mobile hero", async ({ page }) => {
  const headerBooking = page.locator(".header-cta");
  const heroBooking = page.locator(".hero-primary-cta");
  if (page.viewportSize()!.width < 1024) {
    await expect(headerBooking).not.toBeVisible();
    await expect(heroBooking).not.toBeVisible();
    return;
  }

  await expect(headerBooking).toBeVisible();
  await expect(headerBooking).toHaveAccessibleName("Agendar horário");
  await expect(heroBooking).toBeVisible();
  await expect(heroBooking).toHaveAccessibleName("Agendar pelo WhatsApp");
  for (const action of [headerBooking, heroBooking]) {
    await action.click();
    await expect(page.getByRole("dialog", { name: "Vamos conversar em breve" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(action).toBeFocused();
  }
});
