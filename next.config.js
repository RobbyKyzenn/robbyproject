// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mode output ini penting untuk Vercel agar bisa membuat situs statis
  output: 'export',

  // Menonaktifkan optimisasi gambar bawaan Next.js yang tidak bekerja 
  // pada situs statis. Ini akan membuat komponen <Image> berfungsi seperti <img> biasa.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;