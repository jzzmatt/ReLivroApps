import {z} from "zod";
export const listingSchema=z.object({title:z.string().trim().min(2).max(140),subject:z.string().trim().min(1).max(80),grade:z.string().trim().min(1).max(40),price_kz:z.coerce.number().int().min(0).max(100000000),condition:z.string().trim().min(1).max(40),mode:z.string().trim().min(1).max(40),city:z.string().trim().min(1).max(80),municipality:z.string().trim().min(1).max(80),description:z.string().trim().max(2000)});
export const profileSchema=z.object({display_name:z.string().trim().min(2).max(100),school:z.string().trim().max(160),city:z.string().trim().max(80),municipality:z.string().trim().max(80),phone:z.string().trim().max(30),bio:z.string().trim().max(500)});
export const messageSchema=z.object({body:z.string().trim().min(1).max(2000)});
export const reportSchema=z.object({reason:z.string().trim().min(3).max(120)});
export const reviewSchema=z.object({rating:z.coerce.number().int().min(1).max(5),comment:z.string().trim().max(500).optional().or(z.literal(""))});
export type ListingInput=z.infer<typeof listingSchema>;