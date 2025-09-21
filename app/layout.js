import { Press_Start_2P } from "next/font/google"; // 1. Impor font pixel
import "./globals.css";

// 2. Konfigurasi font pixel
const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400", // Font pixel biasanya hanya punya satu weight
  variable: "--font-press-start-2p", // Nama variabel CSS untuk digunakan di Tailwind
});

export const metadata = {
  title: "Asset Desain", // Anda bisa sesuaikan kembali judulnya
  description: "Koleksi aset desain modern",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 3. Terapkan variabel font ke body */}
      <body className={`${pressStart2P.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}