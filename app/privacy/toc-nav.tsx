"use client";

import { useEffect, useRef, useState } from "react";

export type TocItem = { id: string; title: string };

/**
 * Table of contents that tracks which section is currently in view using
 * IntersectionObserver (cheaper than a scroll listener) and exposes the
 * same list as:
 *  - a sticky rail on large screens (`variant="rail"`)
 *  - a <details> disclosure on small screens (`variant="menu"`)
 */
export function TocNav({
  items,
  variant,
}: {
  items: TocItem[];
  variant: "rail" | "menu";
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  const handleJump = () => {
    if (variant === "menu" && detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  const list = (
    <ol className="space-y-2.5 border-l border-[var(--line)] pl-4">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={handleJump}
              aria-current={isActive ? "location" : undefined}
              className={`relative block text-[0.925rem] leading-snug transition-colors ${
                isActive
                  ? "font-medium text-[var(--ink)]"
                  : "text-[var(--stone)] hover:text-[var(--ink)]"
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.0625rem] top-[0.35em] h-1.5 w-1.5 rounded-full bg-[var(--brick)]"
                />
              )}
              {item.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "rail") {
    return (
      <nav aria-label="Privacy policy sections" className="text-sm">
        <p className="mb-3 font-medium text-[var(--ink)]">On this page</p>
        {list}
      </nav>
    );
  }

  return (
    <details ref={detailsRef} className="group text-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3 font-medium text-[var(--ink)] marker:content-none">
        Jump to a section
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-[var(--stone)] transition-transform group-open:rotate-180"
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="mt-4 pl-1">{list}</div>
    </details>
  );
}