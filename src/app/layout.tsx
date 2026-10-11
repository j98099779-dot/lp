import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "./globals.css";
import { SITE_CONFIG, getSafeExternalUrl } from "@/lib/site-config";
import { SiteInteractions } from "@/components/site-interactions";

const canonical = getSafeExternalUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "");

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Nail Design`,
  description: SITE_CONFIG.description,
  ...(canonical ? { metadataBase: new URL(canonical), alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
    locale: "pt_BR",
    ...(canonical ? { images: [{ url: "/images/hero-nails.png", width: 1254, height: 1254, alt: "Nail design delicado — imagem conceitual gerada com IA" }] } : {}),
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SiteInteractions />
      </body>
    </html>
  );
}
