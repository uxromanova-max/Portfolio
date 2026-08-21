import type { Metadata } from "next";
import { Michroma, Special_Gothic_Expanded_One } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

const specialGothicExpandedOne = Special_Gothic_Expanded_One({
  variable: "--font-special-gothic",
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
      className={`${michroma.variable} ${specialGothicExpandedOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
