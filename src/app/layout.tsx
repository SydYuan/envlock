import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
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
  title: "EnvLock — Encrypted .env Manager",
  description:
    "Zero-knowledge encrypted .env file management. Share secrets safely with your team.",
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <header className="border-b">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6">
              <a href="/" className="text-lg font-bold tracking-tight hover:text-muted-foreground transition-colors">EnvLock</a>
              <nav className="flex gap-4 text-sm text-muted-foreground ml-auto">
                <a href="/about" className="hover:text-foreground transition-colors">About</a>
                <a href="/docs" className="hover:text-foreground transition-colors">Docs</a>
                <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
              <span>EnvLock — Encrypted .env Manager</span>
              <a href="https://github.com/SydYuan/envlock" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </footer>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
