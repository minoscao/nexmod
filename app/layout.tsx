import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexmod-modular-australia.minos-cao.chatgpt.site"),
  title: "NEXMOD | Modular Development. Redefined.",
  description: "Complete room-scale modular buildings designed, engineered and delivered as one connected system for Australian projects.",
  openGraph: {
    title: "NEXMOD | Modular Development. Redefined.",
    description: "Complete room-scale modular buildings designed, engineered and delivered as one connected system for Australian projects.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "NEXMOD Modular Development. Redefined." }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
