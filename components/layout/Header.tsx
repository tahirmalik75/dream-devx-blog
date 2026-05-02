// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import type { SiteSettings, Category } from '@/types';

const CATEGORIES: Category[] = [
  'Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Finance', 'Education',
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-4">

        {/* Logo / Site name */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.site_name} width={120} height={36} className="h-9 w-auto" />
          ) : (
            <span className="font-serif text-2xl font-bold text-ink-950 tracking-tight">
              {settings.site_name}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-700">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="hover:text-accent transition-colors"
            >
              {cat}
            </Link>
          ))}
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link href="/search" aria-label="Search" className="p-2 rounded-full hover:bg-ink-100 transition-colors">
            <Search size={18} className="text-ink-600" />
          </Link>
          <button
            className="md:hidden p-2 rounded-full hover:bg-ink-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-ink-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/" onClick={() => setOpen(false)} className="py-1 hover:text-accent">Home</Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="py-1 hover:text-accent"
            >
              {cat}
            </Link>
          ))}
          <Link href="/about" onClick={() => setOpen(false)} className="py-1 hover:text-accent">About</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="py-1 hover:text-accent">Contact</Link>
        </nav>
      )}
    </header>
  );
}
