// app/layout.tsx
import React from "react";
import "./globals.css";

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
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
