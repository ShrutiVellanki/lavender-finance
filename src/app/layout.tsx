import type { Metadata } from "next";
import { ThemeProvider } from "@/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lavender Finance",
    template: "%s | Lavender Finance"
  },
  description: "Personal finance management and tracking",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
