import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"ReLivroApps — Livros escolares para todos",description:"Marketplace mobile-first para encontrar, trocar e partilhar livros escolares."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt"><body>{children}</body></html>}