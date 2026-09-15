import Link from "next/link";

const SWATCHES = [
  { name: "Ochre", hex: "#C98A2C" },
  { name: "Clay", hex: "#B4533C" },
  { name: "Sage", hex: "#6B8F71" },
  { name: "Denim", hex: "#3B5A78" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1F1B16] text-[#F5F1EA]">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#F5F1EA]">
                Brush&nbsp;&amp;&nbsp;Barrel
              </span>
            </Link>

            {/* Swatch strip — a small nod to paint colors instead of a generic icon */}
            <div className="mt-4 flex items-center gap-2">
              {SWATCHES.map((swatch) => (
                <span
                  key={swatch.name}
                  className="h-3 w-3 rounded-full ring-1 ring-black/20"
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#F5F1EA]/70">
              Quality paints, finishes, and tools for every wall, room, and
              project.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-[#F5F1EA]">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-[#F5F1EA]/70 transition-colors hover:text-[#F5F1EA]"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#F5F1EA]/70 transition-colors hover:text-[#F5F1EA]"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[#F5F1EA]">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+15551234567"
                  className="text-[#F5F1EA]/70 transition-colors hover:text-[#F5F1EA]"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@brushandbarrel.com"
                  className="break-all text-[#F5F1EA]/70 transition-colors hover:text-[#F5F1EA]"
                >
                  hello@brushandbarrel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t border-[#F5F1EA]/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#F5F1EA]/50">
            © {new Date().getFullYear()} Brush &amp; Barrel. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}