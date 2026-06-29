import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoConnect India',
  description: 'Discover nearby registered auto-rickshaw drivers and contact them directly.',
  manifest: '/manifest.json',
  themeColor: '#0f766e',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
