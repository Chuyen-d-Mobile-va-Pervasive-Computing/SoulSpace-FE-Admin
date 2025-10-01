import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PendingOrdersProvider } from "@/app/cashier/context/PendingOrdersContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiosk Order Meal",
  description: "Order meals quickly and easily with Kiosk Order Meal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <PendingOrdersProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={5000}
          />
        </PendingOrdersProvider>
      </body>
    </html>
  );
}