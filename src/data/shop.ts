// export const WHATSAPP_NUMBER = "919000000000"; // FAKE: country code + number, no + or spaces

// export const CATEGORIES = ["Bath bars", "Gift sets", "Mini bars"] as const;
// export type Category = (typeof CATEGORIES)[number];

// export type Product = {
//   id: string;
//   name: string;
//   category: string;
//   description: string;
//   price: number;
//   size: string;
//   image_url?: string | null;
//   tone: string;
// };

// export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// // Shown until Supabase has rows
// export const FALLBACK: Product[] = [
//   {
//     id: "f1",
//     name: "Neem & Tulsi",
//     category: "Bath bars",
//     description: "Purifying bar with neem and holy basil.",
//     price: 149,
//     size: "100 g",
//     tone: "#A9CF73",
//   },
//   {
//     id: "f2",
//     name: "Lavender Calm",
//     category: "Bath bars",
//     description: "Soothing lavender with shea butter.",
//     price: 169,
//     size: "100 g",
//     tone: "#D6CAF0",
//   },
//   {
//     id: "f3",
//     name: "Honey Oat",
//     category: "Bath bars",
//     description: "Gentle scrub with oats and raw honey.",
//     price: 159,
//     size: "100 g",
//     tone: "#F2D88F",
//   },
//   {
//     id: "f4",
//     name: "Festive Gift Box",
//     category: "Gift sets",
//     description: "Three bars in a handmade box.",
//     price: 499,
//     size: "3 x 100 g",
//     tone: "#A9CF73",
//   },
//   {
//     id: "f5",
//     name: "Guest Minis",
//     category: "Mini bars",
//     description: "Set of 6 guest-size bars.",
//     price: 299,
//     size: "6 x 30 g",
//     tone: "#D6CAF0",
//   },
// ];

export const WHATSAPP_NUMBER = "919000000000"; // FAKE: country code + number, no + or spaces

export const CATEGORIES = ["Bath bars", "Gift sets", "Mini bars"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  size: string;
  image_url?: string | null;
  tone: string;
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
