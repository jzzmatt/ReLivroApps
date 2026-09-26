import {demoUuid} from "./demo-uuid";
import type {DemoUserSpec} from "./users";

export type DemoBookSpec = {
  key: string;
  sellerKey: string;
  title: string;
  subject: string;
  grade: string;
  condition: "Como novo" | "Muito bom" | "Bom estado" | "Usado";
  mode: "Venda" | "Troca" | "Oferta";
  priceKz: number;
  city: string;
  municipality: string;
  description: string;
  isPublished: boolean;
  status: "active" | "reserved" | "sold" | "exchanged";
  coverFile: string;
  viewTier: "low" | "medium" | "high" | "none";
};

const COVERS = [
  "matematica-1.svg",
  "lingua-portuguesa-1.svg",
  "estudo-meio-2.svg",
  "matematica-2.svg",
  "lingua-portuguesa-3.svg",
  "matematica-4.svg",
  "historia-5.svg",
  "geografia-6.svg",
  "ciencias-6.svg",
];

type BookDraft = Omit<DemoBookSpec, "key" | "coverFile" | "viewTier"> & {
  coverIndex: number;
  viewTier: DemoBookSpec["viewTier"];
};

const DRAFTS: BookDraft[] = [
  {sellerKey: "lucia", title: "Matemática 1ª Classe", subject: "Matemática", grade: "1ª Classe", condition: "Como novo", mode: "Venda", priceKz: 3500, city: "Luanda", municipality: "Talatona", description: "Manual em bom estado, poucas marcas de utilização. Ideal para estudantes da 1ª classe.", isPublished: true, status: "active", coverIndex: 0, viewTier: "high"},
  {sellerKey: "lucia", title: "Língua Portuguesa 1ª Classe", subject: "Português", grade: "1ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 3000, city: "Luanda", municipality: "Talatona", description: "Livro usado durante um ano lectivo. Algumas anotações, páginas completas.", isPublished: true, status: "active", coverIndex: 1, viewTier: "high"},
  {sellerKey: "miguel", title: "Estudo do Meio 2ª Classe", subject: "Geografia", grade: "2ª Classe", condition: "Bom estado", mode: "Troca", priceKz: 0, city: "Lobito", municipality: "Lobito", description: "Disponível para troca por manual de Matemática do 2º ano.", isPublished: true, status: "active", coverIndex: 2, viewTier: "medium"},
  {sellerKey: "miguel", title: "Matemática 3ª Classe", subject: "Matemática", grade: "3ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 4000, city: "Lobito", municipality: "Lobito", description: "Manual em bom estado, ideal para o 3º ano.", isPublished: true, status: "active", coverIndex: 3, viewTier: "high"},
  {sellerKey: "carlos", title: "Língua Portuguesa 3ª Classe", subject: "Português", grade: "3ª Classe", condition: "Usado", mode: "Venda", priceKz: 1500, city: "Benguela", municipality: "Lobito", description: "Livro usado mas funcional; ideal para quem procura preço baixo.", isPublished: true, status: "active", coverIndex: 4, viewTier: "low"},
  {sellerKey: "ana", title: "Matemática 4ª Classe", subject: "Matemática", grade: "4ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 5000, city: "Luanda", municipality: "Viana", description: "Livro praticamente novo, sem marcas significativas.", isPublished: true, status: "active", coverIndex: 5, viewTier: "medium"},
  {sellerKey: "lucia", title: "Língua Portuguesa — Guia de Estudo — 4ª Classe", subject: "Português", grade: "4ª Classe", condition: "Como novo", mode: "Venda", priceKz: 2500, city: "Luanda", municipality: "Talatona", description: "Suplemento de estudo fictício ReLivroApps — não é manual oficial.", isPublished: true, status: "active", coverIndex: 1, viewTier: "medium"},
  {sellerKey: "miguel", title: "História 5ª Classe", subject: "História", grade: "5ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 4500, city: "Lobito", municipality: "Lobito", description: "Manual em bom estado, poucas marcas.", isPublished: true, status: "active", coverIndex: 6, viewTier: "high"},
  {sellerKey: "maria", title: "Geografia 5ª Classe", subject: "Geografia", grade: "5ª Classe", condition: "Muito bom", mode: "Troca", priceKz: 0, city: "Huambo", municipality: "Huambo", description: "Proponho troca por manual de Ciências da 5ª classe.", isPublished: true, status: "active", coverIndex: 7, viewTier: "medium"},
  {sellerKey: "lucia", title: "Matemática 5ª Classe", subject: "Matemática", grade: "5ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 6000, city: "Luanda", municipality: "Talatona", description: "Manual em bom estado, ideal para estudantes da 5ª classe.", isPublished: true, status: "active", coverIndex: 0, viewTier: "high"},
  {sellerKey: "miguel", title: "Matemática — Exercícios de Revisão — 5ª Classe", subject: "Matemática", grade: "5ª Classe", condition: "Como novo", mode: "Venda", priceKz: 2000, city: "Lobito", municipality: "Lobito", description: "Caderno de exercícios fictício para revisão — demo ReLivroApps.", isPublished: true, status: "active", coverIndex: 0, viewTier: "low"},
  {sellerKey: "teresa", title: "Língua Portuguesa 5ª Classe", subject: "Português", grade: "5ª Classe", condition: "Usado", mode: "Oferta", priceKz: 0, city: "Benguela", municipality: "Benguela", description: "Oferta a família que precise — recolha em Benguela.", isPublished: true, status: "active", coverIndex: 4, viewTier: "medium"},
  {sellerKey: "joao", title: "Ciências da Natureza 5ª Classe", subject: "Biologia", grade: "5ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 5500, city: "Luanda", municipality: "Benfica", description: "Livro em bom estado, todas as páginas intactas.", isPublished: true, status: "active", coverIndex: 8, viewTier: "low"},
  {sellerKey: "miguel", title: "Matemática 6ª Classe", subject: "Matemática", grade: "6ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 8000, city: "Lobito", municipality: "Lobito", description: "Manual muito bem conservado.", isPublished: true, status: "active", coverIndex: 3, viewTier: "high"},
  {sellerKey: "lucia", title: "História 6ª Classe", subject: "História", grade: "6ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 5000, city: "Luanda", municipality: "Talatona", description: "Usado um ano lectivo, sem páginas em falta.", isPublished: true, status: "active", coverIndex: 6, viewTier: "medium"},
  {sellerKey: "helena", title: "Geografia 6ª Classe", subject: "Geografia", grade: "6ª Classe", condition: "Bom estado", mode: "Troca", priceKz: 0, city: "Lubango", municipality: "Lubango", description: "Troca por manual de Português do 6º ano.", isPublished: true, status: "active", coverIndex: 7, viewTier: "low"},
  {sellerKey: "antonio", title: "Língua Portuguesa 6ª Classe", subject: "Português", grade: "6ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 7000, city: "Benguela", municipality: "Lobito", description: "Livro praticamente novo.", isPublished: true, status: "active", coverIndex: 4, viewTier: "medium"},
  {sellerKey: "rui", title: "Preparação para Exames — Matemática — 6ª Classe", subject: "Matemática", grade: "6ª Classe", condition: "Como novo", mode: "Venda", priceKz: 3000, city: "Luanda", municipality: "Cacuaco", description: "Material de apoio fictício — demo ReLivroApps.", isPublished: true, status: "active", coverIndex: 0, viewTier: "low"},
  {sellerKey: "sandra", title: "Estudo do Meio 4ª Classe", subject: "Geografia", grade: "4ª Classe", condition: "Usado", mode: "Oferta", priceKz: 0, city: "Luanda", municipality: "Kilamba", description: "Oferta local Kilamba — estado usado mas legível.", isPublished: true, status: "active", coverIndex: 2, viewTier: "none"},
  {sellerKey: "pedro", title: "Educação Musical 3ª Classe", subject: "Português", grade: "3ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 2500, city: "Luanda", municipality: "Kilamba", description: "Manual em bom estado (categoria artes — título inspirado no catálogo público).", isPublished: true, status: "active", coverIndex: 1, viewTier: "low"},
  {sellerKey: "paulo", title: "Matemática 2ª Classe", subject: "Matemática", grade: "2ª Classe", condition: "Muito bom", mode: "Troca", priceKz: 0, city: "Luanda", municipality: "Viana", description: "Troca por livro de Português.", isPublished: true, status: "active", coverIndex: 3, viewTier: "none"},
  {sellerKey: "ines", title: "Língua Portuguesa 2ª Classe", subject: "Português", grade: "2ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 2800, city: "Huambo", municipality: "Huambo", description: "Manual em bom estado.", isPublished: false, status: "active", coverIndex: 1, viewTier: "none"},
  {sellerKey: "carlos", title: "Matemática 5ª Classe (reservado)", subject: "Matemática", grade: "5ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 5000, city: "Benguela", municipality: "Lobito", description: "Anúncio pausado para demonstração.", isPublished: false, status: "reserved", coverIndex: 0, viewTier: "none"},
  {sellerKey: "lucia", title: "História 5ª Classe — rascunho", subject: "História", grade: "5ª Classe", condition: "Usado", mode: "Venda", priceKz: 2000, city: "Luanda", municipality: "Talatona", description: "Rascunho não publicado (demo).", isPublished: false, status: "active", coverIndex: 6, viewTier: "none"},
  {sellerKey: "miguel", title: "Geografia 5ª Classe — pausado", subject: "Geografia", grade: "5ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 4000, city: "Lobito", municipality: "Lobito", description: "Listing pausado pelo vendedor.", isPublished: false, status: "active", coverIndex: 7, viewTier: "none"},
  {sellerKey: "ana", title: "Matemática 6ª Classe — vendido", subject: "Matemática", grade: "6ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 10000, city: "Luanda", municipality: "Viana", description: "Transacção demo concluída.", isPublished: false, status: "sold", coverIndex: 3, viewTier: "none"},
  {sellerKey: "maria", title: "Português 4ª Classe — trocado", subject: "Português", grade: "4ª Classe", condition: "Bom estado", mode: "Troca", priceKz: 0, city: "Huambo", municipality: "Huambo", description: "Troca demo concluída.", isPublished: false, status: "exchanged", coverIndex: 4, viewTier: "none"},
  {sellerKey: "lucia", title: "Matemática 10ª Classe (secundário)", subject: "Matemática", grade: "10ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 12000, city: "Luanda", municipality: "Talatona", description: "Manual secundário para testar filtros fora do primário.", isPublished: true, status: "active", coverIndex: 0, viewTier: "medium"},
  {sellerKey: "miguel", title: "Física 11ª Classe", subject: "Física", grade: "11ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 15000, city: "Lobito", municipality: "Lobito", description: "Livro de secundário em muito bom estado.", isPublished: true, status: "active", coverIndex: 8, viewTier: "low"},
  {sellerKey: "joao", title: "Matemática 1ª Classe — Luanda", subject: "Matemática", grade: "1ª Classe", condition: "Como novo", mode: "Venda", priceKz: 4000, city: "Luanda", municipality: "Benfica", description: "Outro anúncio Luanda para pesquisa por cidade.", isPublished: true, status: "active", coverIndex: 0, viewTier: "medium"},
  {sellerKey: "teresa", title: "História 5ª Classe — Benguela", subject: "História", grade: "5ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 3500, city: "Benguela", municipality: "Benguela", description: "Pesquisa Benguela demo.", isPublished: true, status: "active", coverIndex: 6, viewTier: "low"},
  {sellerKey: "helena", title: "Geografia 6ª Classe — Huambo", subject: "Geografia", grade: "6ª Classe", condition: "Usado", mode: "Venda", priceKz: 3000, city: "Huambo", municipality: "Huambo", description: "Pesquisa Huambo demo.", isPublished: true, status: "active", coverIndex: 7, viewTier: "low"},
  {sellerKey: "rui", title: "Matemática 3ª Classe — Lobito", subject: "Matemática", grade: "3ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 3200, city: "Lobito", municipality: "Lobito", description: "Pesquisa Lobito demo.", isPublished: true, status: "active", coverIndex: 3, viewTier: "medium"},
  {sellerKey: "sandra", title: "Português 5ª Classe — Lubango", subject: "Português", grade: "5ª Classe", condition: "Bom estado", mode: "Oferta", priceKz: 0, city: "Lubango", municipality: "Lubango", description: "Oferta demo Lubango.", isPublished: true, status: "active", coverIndex: 4, viewTier: "none"},
  {sellerKey: "paulo", title: "Matemática 4ª Classe — rascunho", subject: "Matemática", grade: "4ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 4500, city: "Luanda", municipality: "Viana", description: "Não publicado — controlo vendedor.", isPublished: false, status: "active", coverIndex: 5, viewTier: "none"},
  {sellerKey: "pedro", title: "Ciências 6ª Classe", subject: "Biologia", grade: "6ª Classe", condition: "Muito bom", mode: "Venda", priceKz: 6500, city: "Luanda", municipality: "Kilamba", description: "Vendedor ocasional — um anúncio activo.", isPublished: true, status: "active", coverIndex: 8, viewTier: "low"},
  {sellerKey: "ines", title: "História 4ª Classe", subject: "História", grade: "4ª Classe", condition: "Bom estado", mode: "Venda", priceKz: 3800, city: "Huambo", municipality: "Huambo", description: "Segundo anúncio ocasional.", isPublished: true, status: "active", coverIndex: 6, viewTier: "none"},
];

export const DEMO_BOOKS: DemoBookSpec[] = DRAFTS.map((d, i) => ({
  key: `book-${String(i + 1).padStart(3, "0")}`,
  sellerKey: d.sellerKey,
  title: d.title,
  subject: d.subject,
  grade: d.grade,
  condition: d.condition,
  mode: d.mode,
  priceKz: d.priceKz,
  city: d.city,
  municipality: d.municipality,
  description: d.description,
  isPublished: d.isPublished,
  status: d.status,
  coverFile: COVERS[d.coverIndex % COVERS.length],
  viewTier: d.viewTier,
}));

export function demoBookId(key: string): string {
  return demoUuid("book", key);
}

export function sellerKeyFromUser(users: DemoUserSpec[], sellerKey: string): DemoUserSpec {
  const u = users.find(x => x.key === sellerKey);
  if (!u) throw new Error(`Unknown seller key: ${sellerKey}`);
  return u;
}
