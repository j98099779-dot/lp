export type Testimonial = {
  name: string;
  service: string;
  quote: string;
  rating?: number;
};

// Personalize the name and copy here. Add only verified business information.
// NEXT_PUBLIC_* variables are public and are read at build time by Next.js.
export const SITE_CONFIG = {
  name: "Ateliê Nails Studio",
  tagline: "Nail design & autocuidado",
  description:
    "Um olhar delicado para o seu estilo. Alongamento, gel e nail art em uma experiência de beleza pensada para você.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappMessage:
    "Olá! Gostaria de conhecer os serviços e consultar os horários disponíveis.",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  address: process.env.NEXT_PUBLIC_STUDIO_ADDRESS ?? "",
  mapsUrl: process.env.NEXT_PUBLIC_MAPS_URL ?? "",
  businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? "",
  testimonials: [] as Testimonial[],
};

export function getWhatsAppUrl(service?: string): string | null {
  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
  if (!/^[1-9]\d{9,14}$/.test(number)) return null;
  const message = service
    ? `Olá! Gostaria de saber mais sobre ${service} no ${SITE_CONFIG.name} e consultar os horários disponíveis.`
    : SITE_CONFIG.whatsappMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getSafeExternalUrl(value: string): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
