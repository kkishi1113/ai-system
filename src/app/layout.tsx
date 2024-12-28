// app/layout.tsx
import React from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation";

export const metadata = {
  title: "AI Task System",
  description: "A system that automates tasks using two AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="pb-16">
        <Providers>
          {children}
          <Navigation />
        </Providers>
      </body>
    </html>
  );
}
