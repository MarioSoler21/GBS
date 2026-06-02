'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BarChart3, Globe, FileText, Zap } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contactos', label: 'Contactos', icon: Users },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/propuestas', label: 'Propuestas', icon: FileText },
  { href: '/portal', label: 'Portal', icon: Zap },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 print:hidden">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-200 dark:border-gray-700">
        <Globe className="w-6 h-6 text-blue-600" />
        <span className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
          GBS Global<br />Group
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400">CRM v1.0</p>
      </div>
    </aside>
  );
}
