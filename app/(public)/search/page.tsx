// app/(public)/search/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { Search as SearchIcon, Calendar, Clock, ChevronRight } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  async function handleSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${q}%,content.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setResults(data);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-ink-950 mb-6">Search Articles</h1>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for technology, lifestyle, stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            className="w-full px-6 py-4 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-xl transition-all"
          />
          <button 
            onClick={() => handleSearch(searchTerm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-xl hover:bg-accent-light transition-colors"
          >
            <SearchIcon size={24} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 animate-pulse">
          <div className="w-12 h-12 bg-accent/20 rounded-full mb-4" />
          <p className="text-ink-400">Searching the archives...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          <p className="text-ink-500 font-medium">{results.length} results found for "{query || searchTerm}"</p>
          {results.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <div className="glass-card rounded-2xl p-6 flex gap-6 hover:translate-x-1 transition-all duration-300">
                <div className="relative w-40 h-28 rounded-xl overflow-hidden shrink-0">
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{post.category}</span>
                  <h2 className="text-xl font-bold text-ink-950 group-hover:text-accent transition-colors line-clamp-1">{post.title}</h2>
                  <p className="text-ink-500 text-sm line-clamp-1 mt-1">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : query && (
        <div className="text-center py-20 glass-card rounded-3xl">
          <p className="text-xl text-ink-950 font-bold mb-2">No results found</p>
          <p className="text-ink-500">Try different keywords or browse our categories.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
