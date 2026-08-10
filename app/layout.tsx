import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXMOD | Modular Buildings for Australian Projects",
  description: "Integrated modular design, engineering, manufacturing and project delivery for Australian building projects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
