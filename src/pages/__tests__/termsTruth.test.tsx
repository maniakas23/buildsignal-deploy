// m1(36) — Terms commercial-truth pins.
// Prevents recurrence of:
//  - "14-day money-back guarantee" / refundable subscription claims
//  - "All fees are exclusive of taxes"
//  - "BuildSignal, Inc." as legal operator
//  - "Kestovar LLC" as current legal operator
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TermsPage } from "../TermsPage";

const readSrc = (rel: string) =>
  readFileSync(resolve(__dirname, "..", rel), "utf8");

describe("m1(36) terms commercial truth", () => {
  it("Terms page renders without crashing", () => {
    const html = renderToString(
      createElement(MemoryRouter, null, createElement(TermsPage))
    );
    expect(html).toContain("Terms of Service");
  });

  it("Terms source states founder-confirmed refund and tax policy", () => {
    const src = readSrc("TermsPage.tsx");
    expect(src).toMatch(/non-refundable except where required by[\s\S]*?applicable law/i);
    expect(src).not.toMatch(/money-back/i);
    expect(src).not.toMatch(/exclusive of taxes/i);
    expect(src).toMatch(/taxes are included in displayed self-service plan[\s\S]*?prices/i);
    expect(src).toMatch(/cancellation prevents future renewal[\s\S]*?does not create a refund/i);
    expect(src).toMatch(/operated by Parcel Lead Pro LLC/);
  });

  it("no customer-facing source claims BuildSignal, Inc. or Kestovar LLC as legal operator", () => {
    const files = [
      "TermsPage.tsx",
      "ContactPage.tsx",
      "HelpPage.tsx",
      "PrivacyPage.tsx",
    ];
    for (const f of files) {
      const src = readSrc(f);
      expect(src, `${f} must not reference BuildSignal, Inc.`).not.toMatch(
        /buildsignal,?\s*inc\.?/i
      );
      expect(src, `${f} must not claim Kestovar LLC`).not.toMatch(
        /kestovar\s+llc/i
      );
    }
  });

  it("Help page refund answer matches the founder-confirmed policy", () => {
    const src = readSrc("HelpPage.tsx");
    expect(src).toMatch(/non-refundable except where required by applicable law/i);
    expect(src).not.toMatch(/money-back/i);
  });

  it("Contact page names Parcel Lead Pro LLC and no unverified SF location", () => {
    const src = readSrc("ContactPage.tsx");
    expect(src).toMatch(/Parcel Lead Pro LLC/);
    expect(src).not.toMatch(/San Francisco Bay Area/i);
  });
});
