import assert from "node:assert/strict";
import { test } from "node:test";
import { SITE_CONFIG, getSafeExternalUrl, getWhatsAppUrl } from "../src/lib/site-config.ts";

test("contato sem número ou número inválido não gera destino fictício", () => {
  const saved = SITE_CONFIG.whatsappNumber;
  try {
    for (const number of ["", "   ", "abc", "5511", "0000000000000"]) {
      SITE_CONFIG.whatsappNumber = number;
      assert.equal(getWhatsAppUrl(), null);
    }
  } finally {
    SITE_CONFIG.whatsappNumber = saved;
  }
});

test("WhatsApp mantém número internacional e codifica a mensagem do procedimento", () => {
  const saved = SITE_CONFIG.whatsappNumber;
  const savedName = SITE_CONFIG.name;
  try {
    // Synthetic test destination; no network request is made.
    SITE_CONFIG.whatsappNumber = "+55 (11) 90000-0000";
    SITE_CONFIG.name = "Ateliê de Teste";
    const url = new URL(getWhatsAppUrl("Banho de gel & nail art"));
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/5511900000000");
    assert.ok(url.searchParams.get("text").includes("Banho de gel & nail art"));
    assert.ok(url.searchParams.get("text").includes("Ateliê de Teste"));
    assert.equal(new URL(getWhatsAppUrl()).searchParams.get("text"), SITE_CONFIG.whatsappMessage);
  } finally {
    SITE_CONFIG.whatsappNumber = saved;
    SITE_CONFIG.name = savedName;
  }
});

test("contatos externos só aceitam URLs HTTPS válidas", () => {
  for (const value of ["", "javascript:alert(1)", "data:text/html,test", "http://example.com", "not a url"]) {
    assert.equal(getSafeExternalUrl(value), null);
  }
  assert.equal(getSafeExternalUrl("https://www.instagram.com/example/"), "https://www.instagram.com/example/");
});
