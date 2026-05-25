import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Emyris Biolifesciences | Premium Healthcare & Innovation",
  description: "Committed to innovation, society, and healthcare. Emyris Biolifesciences is leading the way in modern pharmaceutical solutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* Navigation Bar can be added here */}
        <main>{children}</main>
        {/* Footer can be added here */}
      </body>
    </html>
  );
}
