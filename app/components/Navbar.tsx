"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Schedule", href: "#schedule" },
  { label: "Affiliates", href: "/affiliates" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 min-h-[80px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <Image
            src="/Team Curran Circle Logo.png"
            alt="Team Curran Jiu-Jitsu"
            width={75}
            height={75}
            className="h-[46px] lg:h-[64px] w-auto shrink-0"
          />
          <span className="text-gray-300 text-base lg:text-xl tracking-widest uppercase whitespace-nowrap hidden sm:block" style={{ fontFamily: 'var(--font-anton)' }}>
            ACADEMY HEADQUARTERS
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
          {links.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <a
                  href={link.href}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                  className="text-gray-300 hover:text-brand text-sm font-semibold tracking-wide uppercase transition-colors"
                >
                  {link.label}
                </a>
                {dropdown && (
                  <div
                    onMouseEnter={() => setDropdown(true)}
                    onMouseLeave={() => setDropdown(false)}
                    className="absolute top-full left-0 mt-1 w-48 bg-black border border-blue-800 rounded shadow-lg py-1"
                  >
                    {link.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-brand hover:bg-gray-900 transition-colors"
                        onClick={() => setDropdown(false)}
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-brand text-xs lg:text-sm font-semibold tracking-wide uppercase transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm" target="_blank" rel="noopener noreferrer"
            className="ml-1 bg-brand hover:bg-blue-800 text-white text-xs lg:text-sm font-bold px-3 lg:px-4 py-2 rounded transition-colors uppercase tracking-wide whitespace-nowrap"
          >
            2-Week Trial
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-blue-900 px-4 py-4 flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-300 hover:text-brand font-semibold uppercase tracking-wide text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://teamcurran.sites.zenplanner.com/sign-up-now.cfm" target="_blank" rel="noopener noreferrer"
            className="bg-brand text-white text-center font-bold py-2 rounded uppercase tracking-wide text-sm"
            onClick={() => setOpen(false)}
          >
            2-Week Trial
          </a>
        </div>
      )}
    </nav>
  );
}
