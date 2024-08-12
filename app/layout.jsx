import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import localFont from "next/font/local";
export const metadata = {
  title: "BatteSim",
  description: "FIght Gemini in this retro castle defense battle simulator",
};

const atariFont = localFont({
  src: "./fonts/Atari.ttf",
});

export default function RootLayout({ children }) {
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
      </head>
      <body className={atariFont.className}>{children}</body>
    </html>
  );
}
