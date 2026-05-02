// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, Globe } from 'lucide-react';

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/posts',    label: 'All Posts',  icon: FileText        },
  { href: '/admin/posts/new',label: 'New Post',   icon: PlusCircle      },
  { href: '/admin/settings', label: 'Settings',   icon: Settings        },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen flex bg-ink-50">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-ink-950 text-ink-300 flex flex-col">
        <div className="px-6 py-5 border-b border-ink-800">
          <p className="font-serif text-xl font-bold text-white">Admin Panel</p>
          <p className="text-xs text-ink-500 mt-0.5 truncate">{session.user?.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-ink-800 hover:text-white transition-colors"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-ink-800 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-ink-800 hover:text-white transition-colors"
          >
            <Globe size={17} /> View Site
          </Link>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/admin/login' }); }}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-ink-800 hover:text-white transition-colors text-left"
            >
              <LogOut size={17} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
