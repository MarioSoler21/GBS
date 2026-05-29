import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GBS Global Group CRM',
  description: 'CRM Dashboard para GBS Global Group',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white`}>
        <ThemeProvider>
          <Sidebar />
          <main className="ml-56 min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
