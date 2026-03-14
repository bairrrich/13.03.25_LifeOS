import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/ui/components/theme-provider";

export const metadata: Metadata = {
  title: "LifeOS",
  description: "Life management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
