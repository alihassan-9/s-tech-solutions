import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SkyBackground } from "@/components/sky/SkyBackground";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent-serif",
  weight: "400",
  style: ["italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S-Tech Solutions: Lead Generation, Data & CRM Operations",
  description:
    "S-Tech Solutions is a Bahawalpur, Pakistan-based business services company delivering lead generation, data research & verification, CRM management, and email marketing support for startups, agencies, and international teams.",
  keywords: [
    "lead generation",
    "prospect research",
    "data entry",
    "data verification",
    "CRM management",
    "email marketing support",
    "Bahawalpur",
  ],
  openGraph: {
    title: "S-Tech Solutions: Lead Generation, Data & CRM Operations",
    description:
      "Lead generation, data operations, CRM management, and email marketing support, built for teams that need growth systems they can trust.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#9dcdff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll />

        {/* Scroll-reveal animations start at opacity:0 and are driven by JS.
            With scripting off they would never play, so unhide them. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>

        <SkyBackground />
        <ScrollProgress />
        <CustomCursor />

        {children}
      </body>
    </html>
  );
}
