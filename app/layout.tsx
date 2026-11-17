import "./global.css";
import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { SplashScreenProvider } from "./components/SplashScreenProvider";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "_mohamed_hichem_bahri",
    template: "%s | _hichem_bahri",
  },
  description: "Mohamed Hichem Bahri — data engineer. Portfolio of projects in data engineering, LLM agents and analytics.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/logo.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: "_mohamed_hichem_bahri",
    description: "Mohamed Hichem Bahri — data engineer. Portfolio of projects in data engineering, LLM agents and analytics.",
    url: baseUrl,
    siteName: "_mohamed_hichem_bahri",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "_mohamed_hichem_bahri",
    description: "Mohamed Hichem Bahri — data engineer. Portfolio of projects in data engineering, LLM agents and analytics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cx("", firaCode.variable)}>
      <body className="border-border box-content min-h-screen font-mono antialiased">
        <SplashScreenProvider>
          <div className="bg-background fixed inset-0 -z-20" />
          <main>
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </SplashScreenProvider>
      </body>
    </html>
  );
}
