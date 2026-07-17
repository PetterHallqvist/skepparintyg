import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

/** Web app manifest (SPEC M7 DoD). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f0",
    theme_color: "#0f2233",
    lang: "sv-SE",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
