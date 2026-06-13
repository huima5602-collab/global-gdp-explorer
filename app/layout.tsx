import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global GDP Explorer',
  description: 'World Bank GDP dashboard, API and database schema'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
