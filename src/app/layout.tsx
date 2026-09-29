import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RestaurantProvider } from '@/context/RestaurantContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: "The Hunger's Spot | Smart Restaurant Mobile Ordering & Management",
  description: "Experience effortless restaurant dining. Scan your table QR code (Tables 1-4) on your phone, customize your order, pay online with Apple Pay, Google Pay, or Card, with instant kitchen alerts and revenue tracking.",
  manifest: '/manifest.json',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF5E3A"/><text y="62" x="50" text-anchor="middle" font-size="45" fill="white">🍽️</text></svg>',
  }
};

export const viewport: Viewport = {
  themeColor: '#0B0D13',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <RestaurantProvider>
          <div className="app-container">
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
          </div>
        </RestaurantProvider>
      </body>
    </html>
  );
}
