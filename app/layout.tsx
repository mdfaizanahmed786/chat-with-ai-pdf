import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";




export const metadata: Metadata = {
  title: "Chat with PDF",
  description: "Transform your PDFs into interactive conversations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">

      <body className="flex flex-1 flex-col min-h-screen">
    
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
