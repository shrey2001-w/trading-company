import type { FC } from "react";
import { Droplets, Layers, ShieldCheck, Flame, Wrench, ArrowUpRight } from "lucide-react";

interface Category {
  name: string;
  description: string;
  href: string;
  swatch: string; // tailwind bg class for the color chip
  chipText: string; // tailwind text class that reads on the chip
  icon: FC<{ className?: string }>;
}

const categories: Category[] = [
  {
    name: "Water Based Products",
    description: "Low-odor emulsions for interior walls and ceilings",
    href: "/categories/water-based",
    swatch: "bg-[#2C6E9E]",
    chipText: "text-white",
    icon: Droplets,
  },
  {
    name: "Cement Based Products",
    description: "Renders, primers and bonding compounds",
    href: "/categories/cement-based",
    swatch: "bg-[#6B6660]",
    chipText: "text-white",
    icon: Layers,
  },
  {
    name: "Waterproofing Products",
    description: "Roof, terrace and wet-area sealing systems",
    href: "/categories/waterproofing",
    swatch: "bg-[#1E7A6D]",
    chipText: "text-white",
    icon: ShieldCheck,
  },
  {
    name: "Oil Based Products",
    description: "Enamels and finishes for wood and metal",
    href: "/categories/oil-based",
    swatch: "bg-[#C4791F]",
    chipText: "text-white",
    icon: Flame,
  },
  {
    name: "Accessories",
    description: "Brushes, rollers, tape and prep tools",
    href: "/categories/accessories",
    swatch: "bg-[#9C5A3C]",
    chipText: "text-white",
    icon: Wrench,
  },
];

const HeroSection: FC = () => {
  return (
    <section className="w-full bg-[#1C1B19] text-[#F5F1E8]">
      <div className="w-full px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        {/* Headline block */}
        <div className="max-w-2xl">
          <h1 className="font-[Archivo,sans-serif] text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Every coat starts with the right can.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#F5F1E8]/70 sm:text-lg">
            Browse our range by what the job needs — walls, foundations, wet
            areas, wood and metal, or the tools to apply it all.
          </p>
        </div>

        {/* Category swatch cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <a
                key={category.name}
                href={category.href}
                className="group flex flex-col overflow-hidden rounded-xl bg-[#F5F1E8]/[0.04] ring-1 ring-[#F5F1E8]/10 transition-colors duration-200 hover:ring-[#F5F1E8]/25"
              >
                {/* color chip */}
                <div
                  className={`relative flex h-28 items-center justify-between px-5 sm:h-32 ${category.swatch}`}
                >
                  <Icon className={`h-7 w-7 ${category.chipText}/90`} />
                  <ArrowUpRight
                    className={`h-5 w-5 ${category.chipText}/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                  />
                </div>

                {/* label */}
                <div className="flex flex-1 flex-col justify-between px-5 py-5">
                  <h3 className="text-base font-semibold leading-snug sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#F5F1E8]/60">
                    {category.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;