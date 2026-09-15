import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

/**
 * Terms & Conditions page — paint shop.
 *
 * Drop this file into: app/terms-and-conditions/page.tsx
 *
 * Before shipping, replace:
 *  - SHOP_NAME, SHOP_TAGLINE, contact details in the footer
 *  - The <Logo /> component below with your real logo (swap the <svg> for
 *    a Next.js <Image src="/logo.svg" .../> if you have an image file)
 *  - Every [bracketed] placeholder in the policy copy (company address,
 *    governing jurisdiction, response windows, etc.) with your actual terms
 *
 * This is starter copy, not legal advice — have a lawyer review the final
 * text before publishing.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const SHOP_NAME = "Ferra Paints";
const SHOP_TAGLINE = "Colour, mixed right.";
const LAST_UPDATED = "September 14, 2026";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${SHOP_NAME}`,
  description: `The terms and conditions governing purchases and use of the ${SHOP_NAME} website and stores.`,
};

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: (
      <>
        <p>
          These terms and conditions ("Terms") govern your use of the{" "}
          {SHOP_NAME} website, our online store, and any purchase you make
          from us in person or online (together, the "Services"). By placing
          an order, creating an account, or otherwise using the Services, you
          agree to be bound by these Terms.
        </p>
        <p>
          If you do not agree with any part of these Terms, please do not use
          the Services. We may update these Terms from time to time; see{" "}
          <a href="#changes" className="underline decoration-[#C77D2E]/60 underline-offset-4 hover:decoration-[#C77D2E]">
            Section 12
          </a>{" "}
          for how we handle changes.
        </p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "2. Definitions",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-medium text-[#24211D]">"We", "us", "our"</span>{" "}
          means {SHOP_NAME}, [Legal Entity Name], registered at [Company
          Address].
        </li>
        <li>
          <span className="font-medium text-[#24211D]">"You", "customer"</span>{" "}
          means the person or business purchasing or browsing our products.
        </li>
        <li>
          <span className="font-medium text-[#24211D]">"Products"</span> means
          paints, primers, stains, tools, and any other goods sold through the
          Services, including custom-tinted paint.
        </li>
        <li>
          <span className="font-medium text-[#24211D]">"Order"</span> means a
          request to purchase Products placed through our website, by phone,
          or in-store.
        </li>
      </ul>
    ),
  },
  {
    id: "orders-payment",
    title: "3. Orders & Payment",
    body: (
      <>
        <p>
          Placing an order is an offer to buy. We confirm acceptance by email
          or receipt; we reserve the right to decline or cancel any order,
          including where a Product is out of stock, mispriced, or we suspect
          fraud.
        </p>
        <p>
          Prices are shown in [Currency] and include/exclude tax as noted at
          checkout. Payment is due in full at the time of ordering unless a
          trade or credit account has been separately agreed in writing.
        </p>
      </>
    ),
  },
  {
    id: "color-accuracy",
    title: "4. Colour Accuracy & Swatches",
    body: (
      <>
        <p>
          We take care to represent colours as accurately as possible, but
          screens render colour differently, and printed swatches, fan decks,
          and paper chips can vary from the final dried, cured finish. Sheen
          level, substrate, lighting, and the number of coats also affect how
          a colour reads on your wall.
        </p>
        <p>
          We strongly recommend ordering a sample pot and testing it on your
          actual surface, under your actual lighting, before purchasing
          full-size cans. We are not responsible for colour dissatisfaction
          where a sample was not tested first.
        </p>
      </>
    ),
  },
  {
    id: "custom-tinting",
    title: "5. Custom & Tinted Paint",
    body: (
      <p>
        Paint that has been custom-mixed or tinted to your specification is
        made to order. Because it cannot be resold, custom-tinted paint is
        <span className="font-medium text-[#24211D]"> non-refundable and
        non-returnable</span> once mixed, except where the Product is faulty
        or the wrong colour was mixed due to our error. Please double-check
        your colour code and finish before confirming a tint order.
      </p>
    ),
  },
  {
    id: "shipping",
    title: "6. Shipping & Delivery",
    body: (
      <>
        <p>
          Estimated delivery times shown at checkout are not guaranteed.
          Some Products (solvent-based paints, aerosols, certain primers) are
          classified as hazardous materials and may be restricted from
          certain shipping methods, carriers, or destinations by law.
        </p>
        <p>
          Risk in the Products passes to you on delivery. Please inspect
          cans on arrival — damaged or leaking containers should be reported
          within [X] days so we can arrange a replacement.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    title: "7. Returns & Refunds",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Unopened, unmixed, resaleable Products may be returned within [30] days of delivery for a refund or exchange.</li>
        <li>Opened cans, used tools, and custom-tinted paint cannot be returned unless faulty.</li>
        <li>Proof of purchase is required for all returns.</li>
        <li>Refunds are issued to the original payment method within [5–10] business days of us receiving the returned item.</li>
      </ul>
    ),
  },
  {
    id: "warranty",
    title: "8. Product Warranty & Application Disclaimer",
    body: (
      <>
        <p>
          Manufacturer warranties, where offered, apply to the Product itself
          when stored, prepared, and applied according to the instructions on
          the can and any technical data sheet. We do not warrant the
          outcome of your painting project, as results depend heavily on
          surface preparation, primer choice, application method, and
          environmental conditions outside our control.
        </p>
        <p>
          If you believe a Product is defective, contact us with your order
          number, photos, and a description of the issue, and we'll work with
          you and, where relevant, the manufacturer to resolve it.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "9. Accounts",
    body: (
      <p>
        If you create an account, you're responsible for keeping your login
        details confidential and for all activity under your account. Let us
        know immediately if you suspect unauthorised access.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "10. Intellectual Property",
    body: (
      <p>
        All content on the Services — including our logo, colour names,
        photography, and site design — belongs to {SHOP_NAME} or our
        licensors and may not be copied or reused without written permission.
      </p>
    ),
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    body: (
      <p>
        To the extent permitted by law, {SHOP_NAME} is not liable for
        indirect or consequential losses, including labour costs, lost time,
        or costs of redecorating arising from colour mismatch, application
        error, or delays outside our reasonable control. Nothing in these
        Terms limits liability where it cannot be limited by law, including
        for death, personal injury caused by negligence, or fraud.
      </p>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to These Terms",
    body: (
      <p>
        We may revise these Terms from time to time to reflect changes in our
        products, processes, or the law. The "Last updated" date at the top
        of this page shows when the Terms last changed. Continuing to use the
        Services after an update means you accept the revised Terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "13. Governing Law",
    body: (
      <p>
        These Terms are governed by the laws of [Jurisdiction], and any
        disputes will be subject to the exclusive jurisdiction of the courts
        of [Jurisdiction], without regard to conflict-of-law principles.
      </p>
    ),
  },
  {
    id: "contact",
    title: "14. Contact Us",
    body: (
      <p>
        Questions about these Terms? Reach us at{" "}
        <a href="mailto:hello@ferrapaints.example" className="underline decoration-[#C77D2E]/60 underline-offset-4 hover:decoration-[#C77D2E]">
          hello@ferrapaints.example
        </a>{" "}
        or [Phone Number], or write to us at [Company Address].
      </p>
    ),
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M14 6h20l3 9-12 27L13 15l1-9Z"
          fill="#F3EDE3"
          stroke="#24211D"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M14 6h20l1.6 4.8H12.4L14 6Z" fill="#3F6B63" />
        <circle cx="24" cy="24" r="5.5" fill="#C77D2E" />
        <path
          d="M24 18.5c1.6 2 3 3.6 3 5.5a3 3 0 1 1-6 0c0-1.9 1.4-3.5 3-5.5Z"
          fill="#C77D2E"
        />
      </svg>
      <div className="leading-tight">
        <p className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[#24211D]">
          {SHOP_NAME}
        </p>
        <p className="text-xs text-[#6B6459]">{SHOP_TAGLINE}</p>
      </div>
    </div>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-[#FBF8F3] font-[family-name:var(--font-body)] text-[#24211D]`}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E4DDD0] bg-[#FBF8F3]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" aria-label={`${SHOP_NAME} home`}>
            <Logo />
          </a>
          <a
            href="/"
            className="hidden text-sm font-medium text-[#3F6B63] hover:text-[#2f5049] sm:block"
          >
            Back to store
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#E4DDD0] bg-[#F3EDE3]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[#24211D] sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5B5548] sm:text-base">
            The rules and promises behind every can we sell — from how we
            price paint to what happens if a colour doesn't turn out the way
            you expected.
          </p>
          <p className="mt-4 text-sm text-[#8A8272]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Mobile table of contents */}
      <div className="border-b border-[#E4DDD0] px-4 py-3 sm:px-6 lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-[#24211D]">
            On this page
            <span className="ml-2 text-[#8A8272] transition-transform group-open:rotate-180">
              ⌄
            </span>
          </summary>
          <nav className="mt-3 flex flex-col gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded px-1 py-1 text-sm text-[#5B5548] hover:text-[#3F6B63]"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </details>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          {/* Desktop sidebar nav */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-1 border-l border-[#E4DDD0] pl-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded py-1 text-sm text-[#5B5548] transition-colors hover:text-[#3F6B63]"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Sections */}
          <div className="flex flex-col gap-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[#24211D] sm:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-[#3F3A31] sm:text-base">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4DDD0] bg-[#F3EDE3]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#6B6459]">
              © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.
            </p>
            <p className="text-sm text-[#6B6459]">
              [Company Address] · [Phone Number]
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}