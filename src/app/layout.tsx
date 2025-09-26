/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { ExperienceProvider } from "@/context/ExperienceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Buzz Planners',
  description: 'Plan weddings, travel & celebrations with ease',
  icons: {
    icon: [
      { url: '/buzz-small-logo.png', sizes: 'any' },
    ],
    apple: [
      { url: '/buzz-small-logo.png' },
    ],
    shortcut: ['/buzz-small-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Explicit links to ensure our favicon overrides any default */}
        <link rel="icon" href="/buzz-small-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/buzz-small-logo.png" />
      </head>
      <body>
        <ExperienceProvider>
          {children}
        </ExperienceProvider>
      </body>
    </html>
  );
}
