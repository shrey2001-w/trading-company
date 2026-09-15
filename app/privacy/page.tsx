// app/privacy/page.tsx
//
// Privacy Policy page for a paint shop — Next.js (App Router), TypeScript,
// Tailwind CSS. Server-rendered by default; only the table-of-contents
// (app/privacy/toc-nav.tsx) is a client component, so the page ships almost
// no client JS.
//
// WHY THIS VERSION IS DIFFERENT FROM A QUICK DRAFT
// The previous version referenced Tailwind classes like `bg-paper`,
// `text-ink`, `bg-teal`, `bg-mustard` etc. as if they were defined in
// tailwind.config — without that config they resolve to nothing, so the
// page renders with no color, no accent stripe, and default system fonts.
// This version defines its palette as CSS custom properties on the root
// element and reads them with Tailwind's arbitrary-value syntax
// (e.g. `bg-[var(--paper)]`), so it renders correctly the moment you drop
// it into a project — no tailwind.config edit required.
//
// HOW TO USE
// 1. Drop this file at:        app/privacy/page.tsx
// 2. Drop the companion file:  app/privacy/toc-nav.tsx
// 3. Swap the placeholder <PaintDropLogo /> for your real logo — either
//    replace the SVG markup, or use next/image:
//      import Image from "next/image";
//      <Image src="/logo.svg" alt="Hue & Co. Paints" width={36} height={36} />
// 4. Replace COMPANY_* and SITE_URL below with your real details.
// 5. Replace the placeholder copy in each section with your reviewed policy
//    text — this is a starting template, not legal advice.

import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { TocNav,TocItem } from "./toc-nav";

// Optimized web fonts: subset, self-hosted at build time by next/font
// (no render-blocking <link>, no layout shift, no third-party request).
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// ---- Fill these in with your real details -------------------------------
const COMPANY_NAME = "Hue & Co. Paints";
const COMPANY_EMAIL = "privacy@hueandco.example";
const COMPANY_ADDRESS = "14 Ochre Lane, Springfield, IL 62701";
const SITE_URL = "https://www.hueandco.example";
const LAST_UPDATED = "September 14, 2026";
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Privacy Policy | ${COMPANY_NAME}`,
  description: `How ${COMPANY_NAME} collects, uses, and protects your information when you shop online or in store.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Privacy Policy | ${COMPANY_NAME}`,
    description: `How ${COMPANY_NAME} collects, uses, and protects your information.`,
    url: `${SITE_URL}/privacy`,
    siteName: COMPANY_NAME,
    type: "website",
  },
};

// Paint-chip accent palette. Used sparingly (the header stripe and the
// current-section marker) rather than smeared across every element.
const PALETTE: CSSProperties = {
  ["--paper" as string]: "#efeae0", // primer-toned canvas, not pure white
  ["--paper-raised" as string]: "#f7f4ec",
  ["--ink" as string]: "#221e1a",
  ["--stone" as string]: "#6b6155",
  ["--line" as string]: "#dad2c2",
  ["--teal" as string]: "#29616b",
  ["--mustard" as string]: "#c79a2e",
  ["--brick" as string]: "#b24a32",
  ["--olive" as string]: "#66763f",
};

type SectionData = { id: string; title: string; content: ReactNode };

const sections: SectionData[] = [
  {
    id: "information-we-collect",
    title: "1. Information we collect",
    content: (
      <>
        <p>
          When you browse our shop, request a color match, or place an
          order, we collect information you give us directly and some
          information collected automatically.
        </p>
        <p className="mt-4 font-medium text-[var(--ink)]">
          You provide to us
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Name, email address, phone number, and shipping address</li>
          <li>Billing details, handled securely by our payment processor</li>
          <li>
            Project details you share for color consultations — room
            photos, surface type, finish preferences
          </li>
          <li>Messages sent through our contact form or in-store kiosk</li>
        </ul>
        <p className="mt-4 font-medium text-[var(--ink)]">
          Collected automatically
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Device type, browser, and approximate location</li>
          <li>Pages viewed, colors browsed, and time spent on the site</li>
          <li>Cookies and similar technologies (see Section 3)</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "2. How we use your information",
    content: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Process orders, arrange delivery, and handle returns</li>
        <li>Recommend colors and finishes based on your past projects</li>
        <li>Respond to questions from our support and design team</li>
        <li>Send order updates and, if you opt in, product news</li>
        <li>Improve our website, catalog, and in-store experience</li>
        <li>Detect fraud and keep our systems secure</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "3. Cookies & similar technologies",
    content: (
      <p>
        We use cookies to keep your cart saved between visits, remember
        your preferred color palette, and understand which pages are most
        useful. You can control cookies through your browser settings; if
        you turn them off, some features — like saved swatches — may not
        work as expected.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "4. When we share information",
    content: (
      <>
        <p>We don't sell your personal information. We share it only with:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Delivery partners, to get your paint order to your door</li>
          <li>Payment processors, to complete your purchase securely</li>
          <li>
            Service providers who host our site or send order emails on our
            behalf, under confidentiality agreements
          </li>
          <li>Authorities, only when required by law</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "5. How we protect your data",
    content: (
      <p>
        We use encryption in transit, restricted access to customer
        records, and regular security reviews. No online system is
        perfectly secure, but we work to keep your information safe and
        will notify you if a breach affects your data.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your rights and choices",
    content: (
      <>
        <p>Depending on where you live, you can ask us to:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Send you a copy of the data we hold about you</li>
          <li>Correct information that's out of date or inaccurate</li>
          <li>Delete your account and associated data</li>
          <li>Opt out of marketing emails at any time</li>
        </ul>
        <p className="mt-4">
          To make a request, email{" "}
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="underline decoration-[var(--brick)] decoration-2 underline-offset-2 hover:text-[var(--brick)]"
          >
            {COMPANY_EMAIL}
          </a>
          . We'll respond within the time required by law in your region.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "7. Children's privacy",
    content: (
      <p>
        Our shop is intended for adults. We don't knowingly collect
        information from children under 13, and we'll delete any such data
        if we become aware of it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "8. Changes to this policy",
    content: (
      <p>
        We may update this policy as our shop grows. If we make a
        significant change, we'll post a notice on this page and update
        the date below.
      </p>
    ),
  },
  {
    id: "contact",
    title: "9. Contact us",
    content: (
      <>
        <p>Questions about this policy or your data? Reach us at:</p>
        <p className="mt-3 not-italic text-[var(--ink)]">
          {COMPANY_NAME}
          <br />
          {COMPANY_ADDRESS}
          <br />
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="underline decoration-[var(--brick)] decoration-2 underline-offset-2 hover:text-[var(--brick)]"
          >
            {COMPANY_EMAIL}
          </a>
        </p>
      </>
    ),
  },
];

const tocItems: TocItem[] = sections.map(({ id, title }) => ({ id, title }));

function PaintDropLogo() {
  return (
    <svg
      viewBox="0 0 40 40"
      width={34}
      height={34}
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M20 3c6 8 11 14.5 11 20.5C31 30.4 26.1 35 20 35S9 30.4 9 23.5C9 17.5 14 11 20 3z"
        fill="var(--teal)"
      />
      <path
        d="M20 3c3.4 4.5 6.3 8.6 8.2 12.4-2.6 1.7-5.9 2.7-9.4 2.4-3.1-.3-5.9-1.5-8-3.3C13.1 10.9 16.4 6.9 20 3z"
        fill="var(--mustard)"
      />
    </svg>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div
      style={PALETTE}
      className={`${sans.className} min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--paper)]"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur print:static print:bg-transparent">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4 sm:px-8">
          <PaintDropLogo />
          <a
            href="/"
            className={`${serif.className} text-lg tracking-tight text-[var(--ink)] sm:text-xl`}
          >
            {COMPANY_NAME}
          </a>
        </div>
        {/* Paint-chip accent stripe — the one deliberately bold element */}
        <div className="flex h-1.5 w-full" aria-hidden="true">
          <span className="flex-1 bg-[var(--teal)]" />
          <span className="flex-1 bg-[var(--mustard)]" />
          <span className="flex-1 bg-[var(--brick)]" />
          <span className="flex-1 bg-[var(--olive)]" />
        </div>
      </header>

      {/* Intro */}
      <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8 sm:pt-14">
        <h1
          className={`${serif.className} text-3xl leading-tight text-[var(--ink)] sm:text-4xl`}
        >
          Privacy policy
        </h1>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--stone)]">
          This page explains what information {COMPANY_NAME} collects when
          you shop with us — online or in store — and how we use, share,
          and protect it.
        </p>
        <p className="mt-3 text-sm text-[var(--stone)]">
          Last updated {LAST_UPDATED}
        </p>
      </div>

      {/* Content grid */}
      <main
        id="main-content"
        className="mx-auto max-w-5xl gap-x-14 px-5 py-10 sm:px-8 lg:grid lg:grid-cols-[200px_1fr]"
      >
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TocNav items={tocItems} variant="rail" />
          </div>
        </aside>

        <div className="mb-10 lg:hidden">
          <TocNav items={tocItems} variant="menu" />
        </div>

        <div className="max-w-[62ch] space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2
                className={`${serif.className} text-xl text-[var(--ink)] sm:text-2xl`}
              >
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-[var(--stone)]">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-[var(--line)] print:hidden">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-6 text-sm text-[var(--stone)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights
            reserved.
          </p>
          <a
            href="#main-content"
            className="w-fit underline decoration-[var(--line)] decoration-2 underline-offset-2 hover:text-[var(--ink)]"
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}