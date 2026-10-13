import type { Metadata, Viewport } from 'next';
import './globals.css';
import DotGridCanvas from '@/components/background/DotGridCanvas';
import OnekoCompanion from '@/components/oneko/OnekoCompanion';

export const metadata: Metadata = {
  title: 'Rohit Dare — Software Developer | AI',
  description:
    'Trainer ID Developer Portfolio of Rohit — Full-Stack Developer & AI Engineer. Features an immersive 3D suspended badge interface, battle-tested tech stack, shipped artifacts, and career timeline.',
  icons: {
    icon: '/assets/logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        {/* Prevent flash of unstyled theme on initial load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('trainer_id_theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {/* DOT GRID CANVAS (Fixed full-viewport interactive layer) */}
        <DotGridCanvas />

        {/* APPLICATION MAIN CONTENT */}
        {children}

        {/* ONEKO DESKTOP COMPANION */}
        <OnekoCompanion />
      </body>
    </html>
  );
}
