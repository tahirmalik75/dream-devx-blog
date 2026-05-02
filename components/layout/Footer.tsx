// components/layout/Footer.tsx
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Youtube, MessageCircle, Music2 } from 'lucide-react';
import type { SiteSettings, Category } from '@/types';

const CATS: Category[] = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel'];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const whatsappUrl = "https://wa.me/923001215715";
  const instaUrl    = "https://www.instagram.com/dream.devx?igsh=MW4zem5seWwwY3puYQ==";
  const tiktokUrl   = "https://www.tiktok.com/@dream.devx?_r=1&_t=ZS-9627wQXmAVE";

  return (
    <footer className="mt-20 px-4 pb-10">
      <div className="max-w-7xl mx-auto glass-card rounded-[2.5rem] overflow-hidden border-white/20 shadow-2xl">
        <div className="bg-ink-950/90 px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-serif text-3xl font-bold text-white mb-4 tracking-tight">{settings.site_name}</p>
            <p className="text-ink-400 text-sm leading-relaxed mb-6 max-w-md">Building the future of digital media. Connect with us on our social platforms below.</p>
            
            <div className="flex flex-wrap gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"><MessageCircle size={20}/></a>
              <a href={instaUrl} target="_blank" rel="noopener noreferrer" title="Instagram" className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all"><Instagram size={20}/></a>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" title="TikTok" className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"><Music2 size={20}/></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"><Twitter size={18}/></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Categories</h3>
            <ul className="space-y-3 text-sm text-ink-400">
              {CATS.map((c) => (
                <li key={c}>
                  <Link href={`/category/${c.toLowerCase()}`} className="hover:text-accent transition-colors font-medium">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Quick Links</h3>
            <ul className="space-y-3 text-sm text-ink-400">
              <li><Link href="/about"          className="hover:text-accent transition-colors font-medium">Our Story</Link></li>
              <li><Link href="/contact"        className="hover:text-accent transition-colors font-medium">Work with Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-accent transition-colors font-medium">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="bg-ink-950 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5">
          <p className="text-[10px] text-ink-500 uppercase tracking-widest">
            © {new Date().getFullYear()} {settings.site_name}. Engineered by dream devx.
          </p>
          <div className="flex gap-6 text-[10px] text-ink-500 uppercase tracking-widest font-bold">
            <span className="hover:text-white cursor-pointer">Sitemap</span>
            <span className="hover:text-white cursor-pointer">RSS Feed</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 px-3 py-1 bg-white text-ink-950 text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </a>
    </footer>
  );
}
