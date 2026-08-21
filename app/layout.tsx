import type { Metadata } from "next";
import { Michroma, Prosto_One } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

const prostoOne = Prosto_One({
  variable: "--font-prosto-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Diana Romanova — Portfolio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${michroma.variable} ${prostoOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
