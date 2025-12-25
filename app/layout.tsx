import type { Metadata } from "next";
import "./globals.css"; // <--- INI WAJIB ADA! JANGAN DIHAPUS
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = { 
  title: "SynClass App",
  description: "Sistem Informasi Akademik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Tambahkan class flex agar Sidebar dan Konten berdampingan */}
      <body className="flex bg-gray-100 min-h-screen">
        
        {/* 1. Sidebar Kiri (Akan hilang otomatis kalau di /login) */}
        <Sidebar />

        {/* 2. Area Konten Kanan (Berubah-ubah sesuai halaman) */}
        <main className="flex-1 overflow-y-auto h-screen">
          {children}
        </main>
        
      </body>
    </html>
  );
}