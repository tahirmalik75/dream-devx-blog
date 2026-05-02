// components/layout/Newsletter.tsx
'use client';

export default function Newsletter() {
  return (
    <div className="bg-ink-950 rounded-xl p-6 text-white">
      <h3 className="font-serif text-xl font-bold mb-2">Newsletter</h3>
      <p className="text-ink-300 text-sm mb-4">Get the best articles delivered to your inbox.</p>
      <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="your@email.com"
          className="px-4 py-2 rounded-lg bg-ink-800 text-white placeholder:text-ink-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-accent hover:bg-accent-light rounded-lg text-sm font-semibold transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
