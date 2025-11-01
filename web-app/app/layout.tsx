import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import FaviconProgress from "./components/layout/Favicon-progress";

export const metadata: Metadata = {
  title: "Bookstore",
  description: "Created by RGBunny",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Toaster></Toaster>
        <NextTopLoader showSpinner={false}></NextTopLoader>
        <FaviconProgress></FaviconProgress>
        {children}
      </body>
    </html>
  );
}
