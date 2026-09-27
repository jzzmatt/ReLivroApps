export type ListingMode="Venda"|"Troca"|"Oferta";
export type PaymentArrangement="A combinar"|"Transferência"|"Dinheiro";
export type BookCondition="Como novo"|"Muito bom"|"Bom estado"|"Usado";
export type BookImage={id:string;storage_path:string;sort_order:number;slot?:string|null};
export type Book={id:string;seller_id:string;title:string;subject:string;grade:string;condition:BookCondition;mode:ListingMode;price_kz:number;description:string|null;city:string|null;municipality:string|null;is_published:boolean;status:"active"|"reserved"|"sold"|"exchanged";sold_at:string|null;created_at:string;updated_at:string;video_path?:string|null;ai_suggested_condition?:BookCondition|null;ai_analyzed_at?:string|null;payment_arrangement?:PaymentArrangement|null;book_images?:BookImage[];profiles?:{display_name:string|null;avatar_url:string|null;city?:string|null;municipality?:string|null;school?:string|null;school_verified_at?:string|null}|null};
export const subjects=["Matemática","Português","Física","Biologia","História","Geografia"] as const;
export const grades=["7ª Classe","8ª Classe","9ª Classe","10ª Classe","11ª Classe","12ª Classe"] as const;
export const conditions:BookCondition[]=["Como novo","Muito bom","Bom estado","Usado"];
export const modes:ListingMode[]=["Venda","Troca","Oferta"];
export const paymentArrangements:PaymentArrangement[]=["A combinar","Transferência","Dinheiro"];
export function parsePaymentArrangement(value:unknown):PaymentArrangement{
  if(value==="Transferência"||value==="Dinheiro"||value==="A combinar")return value;
  return"A combinar";
}
export function formatPrice(value:number){return Number(value||0).toLocaleString("pt-AO")+" Kz";}
