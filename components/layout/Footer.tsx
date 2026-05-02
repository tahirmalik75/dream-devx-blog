// components/layout/Footer.tsx
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import type { SiteSettings, Category } from '@/types';

const CATS: Category[] = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel'];

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <p className="font-serif text-2xl font-bold text-white mb-3">{settings.site_name}</p>
          <p className="text-sm leading-relaxed mb-5">{settings.tagline}</p>
          <div className="flex gap-4">
            {settings.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter size={18}/></a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook size={18}/></a>
            )}
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={18}/></a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Youtube size={18}/></a>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Categories</h3>
          <ul className="space-y-2 text-sm">
            {CATS.map((c) => (
              <li key={c}>
                <Link href={`/category/${c.toLowerCase()}`} className="hover:text-white transition-colors">{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about"          className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact"        className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/sitemap.xml"    className="hover:text-white transition-colors">Sitemap</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
      </div>
    </footer>
  );
}
