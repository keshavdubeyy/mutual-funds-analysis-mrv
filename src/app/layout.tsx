import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEBI Investor Behaviour Dashboard",
  description: "Dashboard for the SEBI Investor Survey 2025 analysis.",
};

// Applies the stored/system theme before the page paints, so there's no
// flash of the wrong theme while React hydrates. `suppressHydrationWarning`
// on <html> is required because this script mutates its class outside React.
const THEME_INIT_SCRIPT = `
  try {
    var pref = localStorage.getItem('theme');
    var isDark = pref === 'dark' || (pref !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
