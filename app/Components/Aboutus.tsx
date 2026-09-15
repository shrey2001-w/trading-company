import Image from "next/image";
import { Fraunces, Work_Sans } from "next/font/google";

/**
 * Fonts
 * Fraunces: a warm, ink-heavy serif for headlines — reads like traditional
 * sign-painting lettering, which fits a paint shop's craft feel.
 * Work Sans: a plain, legible grotesk for body copy so long descriptions
 * stay easy to read.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

type AboutCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  swatch: string; // hex of the actual paint colour this section is tied to
};

/**
 * Replace the `image` paths below with your own photos.
 * Drop files into /public/images/about/ (e.g. public/images/about/workshop.jpg)
 * and reference them as "/images/about/workshop.jpg" — no extra Next.js
 * config needed since these are local, not remote, images.
 */
const cards: AboutCard[] = [
  {
    id: "workshop",
    title: "The Workshop",
    description:
      "Every tin we sell is mixed a few feet from where you'll pick it up. Our workbench downtown has stayed in the same spot for eleven years, stained a hundred different colours by now.",
    image: "/images/about/workshop.jpg",
    alt: "Interior of the paint shop mixing workshop with tins on shelves",
    swatch: "#2E4A9E",
  },
  {
    id: "mixing",
    title: "Small-Batch Mixing",
    description:
      "We match colour by eye and by machine, then check both against the sample you bring in. If it's a repaint, we keep your formula on file so the next can is identical to the last.",
    image: "/images/about/mixing.jpg",
    alt: "Paint mixing machine tinting a can of paint",
    swatch: "#C98A2C",
  },
  {
    id: "pigments",
    title: "Sourced Pigments",
    description:
      "We buy pigment from three suppliers we've used for over a decade, chosen for how their colours hold up in direct sun and after years on a wall, not for how cheaply they ship.",
    image: "/images/about/pigments.jpg",
    alt: "Jars of raw pigment in a row of different colours",
    swatch: "#9C3F2E",
  },
  {
    id: "delivery",
    title: "Delivered With Care",
    description:
      "Local orders go out same-day in a van we drive ourselves. Every can is sealed, labelled with your formula number, and wrapped so it survives the trip up your stairs.",
    image: "/images/about/delivery.jpg",
    alt: "Paint cans packed and ready for delivery",
    swatch: "#4A6B4F",
  },
];

// The three swatches shown beside the intro — an honest sample of shades
// mixed in-house this season, not decoration.
const featuredSwatches = ["#2E4A9E", "#C98A2C", "#9C3F2E"];

export default function AboutUs() {
  return (
    <section
      className={`${fraunces.variable} ${workSans.variable} bg-[#EEE9DF] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24`}
    >
      <div className="mx-auto max-w-5xl">
        {/* Intro */}
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-[#211D1A] sm:text-5xl">
            About Pigment House
          </h2>

          <div
            className="mt-5 flex items-center gap-2"
            aria-label="A few of this season's mixed colours"
          >
            {featuredSwatches.map((hex) => (
              <span
                key={hex}
                className="h-3 w-3 rounded-[2px]"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>

          <p className="mt-6 font-[family-name:var(--font-body)] text-base leading-relaxed text-[#211D1A]/75 sm:text-lg">
            We've been mixing paint on the same corner since 2013 — first for
            a handful of neighbours repainting front doors, now for
            contractors and homeowners across the city. The process hasn't
            changed much: we still mix in small batches, keep every formula
            on file, and test each colour against daylight before it goes out
            the door.
          </p>
        </div>

        {/* Card grid: 1 column on mobile, 2 per row from small screens up */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="relative border border-[#211D1A]/15 bg-white"
            >
              <span
                className="absolute right-4 top-4 z-10 h-4 w-4 rounded-[2px] border border-white/80"
                style={{ backgroundColor: card.swatch }}
                aria-hidden="true"
              />

              {/* Rectangular image area, wider than tall, fixed aspect ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#211D1A]/5">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-7">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[#211D1A] sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-3 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#211D1A]/70 sm:text-base">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}