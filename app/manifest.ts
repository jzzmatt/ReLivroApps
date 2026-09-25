import type {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReLivroApps",
    short_name: "ReLivroApps",
    description: "Livros escolares — comprar, vender e trocar em Angola.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf1",
    theme_color: "#102d52",
    lang: "pt-AO",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
