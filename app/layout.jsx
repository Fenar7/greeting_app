import './globals.css';

export const metadata = {
  title: 'For Shahanas — With All My Heart',
  description: 'A little universe made with love, for the woman who means the world. Happy Birthday, Umma.',
  openGraph: {
    title: 'For Shahanas, with all my heart ♡',
    description: 'Something beautiful was made just for you.',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#171219',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
