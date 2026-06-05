import { describe, expect, it } from "vitest";
import { canonicalizeUrl, extractDomain, isSimilarTitle, normalizeTitle } from "./dedupe";

describe("dedupe utilities", () => {
  it("canonicalizes tracking URLs", () => {
    expect(
      canonicalizeUrl("http://www.example.com/noticia/?utm_source=x&b=2&a=1#top")
    ).toBe("https://example.com/noticia?a=1&b=2");
  });

  it("extracts normalized domains", () => {
    expect(extractDomain("https://www.nsctotal.com.br/noticia")).toBe(
      "nsctotal.com.br"
    );
  });

  it("normalizes accented titles", () => {
    expect(normalizeTitle("Fanfarra da Ponte abre o pré-Carnaval!")).toBe(
      "fanfarra da ponte abre o pre carnaval"
    );
  });

  it("detects very similar titles", () => {
    expect(
      isSimilarTitle(
        "Fanfarra da Ponte abre oficialmente o pré-Carnaval",
        "Fanfarra da Ponte abre oficialmente o pre Carnaval"
      )
    ).toBe(true);
  });
});
