export type ListingMode="Venda"|"Troca"|"Oferta";
export type BookCondition="Como novo"|"Muito bom"|"Bom estado"|"Usado";
export type BookImage={id:string;storage_path:string;sort_order:number};
export type Book={id:string;seller_id:string;title:string;subject:string;grade:string;condition:BookCondition;mode:ListingMode;price_kz:number;description:string|null;city:string|null;municipality:string|null;is_published:boolean;created_at:string;updated_at:string;book_images?:BookImage[];profiles?:{display_name:string|null;avatar_url:string|null}|null};
export const subjects=["Matemática","Português","Física","Biologia","História","Geografia"] as const;
export const grades=["7ª Classe","8ª Classe","9ª Classe","10ª Classe","11ª Classe","12ª Classe"] as const;
export const conditions:BookCondition[]=["Como novo","Muito bom","Bom estado","Usado"];
export const modes:ListingMode[]=["Venda","Troca","Oferta"];
export function formatPrice(value:number){return Number(value||0).toLocaleString("pt-AO")+" Kz";}
