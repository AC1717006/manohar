import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Surendra Sa Rajputi Fashion | Royal Rajputi Poshak & Bridal Wear, Ajmer",
    template: "%s | Surendra Sa Rajputi Fashion",
  },
  description:
    "Premium Rajputi Poshak, Bridal Wear, Wedding Collection and Traditional Dresses from Surendra Sa Rajputi Fashion, Ajmer, Rajasthan.",
  metadataBase: new URL("https://surendrasarajputifashion.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-royal-black text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
