// components/layout/Newsletter.tsx
'use client';

export default function Newsletter() {
  return (
    <div className="bg-ink-950/90 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10 shadow-xl">
      <h3 className="font-serif text-xl font-bold mb-2">Newsletter</h3>
      <p className="text-ink-300 text-sm mb-4">Get the best articles delivered to your inbox.</p>
      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="your@email.com"
          className="px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder:text-ink-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent border border-white/5"
          required
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-accent hover:bg-accent-light rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20 active:scale-95"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
