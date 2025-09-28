// File: app/layout.js

import { Inter, Press_Start_2P } from 'next/font/google';
import './globals.css';

// Konfigurasi font biasa (sans-serif) sebagai cadangan
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // Variabel untuk font biasa
});

// Konfigurasi font pixel
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel', // Variabel untuk font pixel
});

export const metadata = {
  title: "www.robbyproject.web",
  description: "Website Portofolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark"> 
      <body className={`${inter.variable} ${pressStart2P.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}