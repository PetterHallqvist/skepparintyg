import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { clientEnv } from "@/lib/env";
import { BRAND } from "@/lib/brand";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-plex-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: BRAND.titleTemplate,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    locale: "sv_SE",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  twitter: { card: "summary", title: BRAND.name, description: BRAND.description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${plexSans.variable} ${plexMono.variable} ${plexSerif.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ConsentProvider
          posthogKey={clientEnv.NEXT_PUBLIC_POSTHOG_KEY}
          posthogHost={clientEnv.NEXT_PUBLIC_POSTHOG_HOST}
        >
          {children}
        </ConsentProvider>
      </body>
    </html>
  );
}
