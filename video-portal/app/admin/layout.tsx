import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TV Facebrasil Control Tower",
  description: "Dashboard de Gerenciamento de Produção de Vídeos",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#101622] text-[#FFFFFF] min-h-screen`}>
        {children}
      </div>
    </ClerkProvider>
  );
}
