// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import type { SiteSettings, Category } from '@/types';

const CATEGORIES: Category[] = [
  'Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Finance', 'Education',
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`max-w-7xl mx-auto px-4 transition-all duration-500 ${scrolled ? 'max-w-5xl' : 'max-w-7xl'}`}>
        <div className="glass-header rounded-2xl px-6 flex items-center justify-between h-16 gap-4 shadow-xl border-white/20">
          
          {/* Logo / Site name */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt={settings.site_name} width={120} height={36} className="h-9 w-auto" />
            ) : (
              <span className="font-serif text-xl md:text-2xl font-bold text-ink-950 tracking-tight">
                {settings.site_name}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-ink-700">
            <Link href="/" className="hover:text-accent transition-all hover:scale-105">Home</Link>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="hover:text-accent transition-all hover:scale-105"
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/search" aria-label="Search" className="p-2 rounded-full hover:bg-white/50 transition-colors">
              <Search size={18} className="text-ink-600" />
            </Link>
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/50 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden mt-2 glass-card rounded-2xl px-6 py-6 flex flex-col gap-4 text-sm font-bold shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
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
            <div className="h-px bg-ink-100 my-2" />
            <Link href="/about" onClick={() => setOpen(false)} className="py-1 hover:text-accent">About Us</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="py-1 hover:text-accent">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
