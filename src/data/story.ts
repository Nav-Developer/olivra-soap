import type { StaticImageData } from "next/image";

export type Chapter = {
  tag: string;
  title: string;
  text: string;
  text2?: string;
  image?: StaticImageData; // add real photo later
  aspect?: "tall" | "wide"; // set this to show a photo/placeholder block
  points?: { label: string; title: string; text: string }[];
  stats?: { label: string; value: number; suffix?: string }[];
};

// FAKE CONTENT: replace with real copy later.
export const chapters: Chapter[] = [
  {
    tag: "Hello, from Olivra",
    title: "soap the way nature intended",
    text: "Olivra makes handmade soaps from plant-based oils and real botanicals. Simple, gentle and good for everyday skin.",
    aspect: "wide",
  },
  {
    tag: "Our soaps",
    title: "short ingredient lists",
    text: "If you can't pronounce it, it doesn't go in the bar. Olive oil, coconut oil, shea butter and herbs, that's about it.",
    text2: "No parabens, no harsh sulphates, no artificial dyes.",
    aspect: "tall",
  },
  {
    tag: "Made slowly",
    title: "cured for four weeks",
    text: "Every batch is poured by hand and left to cure for four weeks, so each bar turns out hard, long-lasting and mild on skin.",
    text2: "Small batches mean every bar gets proper attention.",
  },
  {
    tag: "For every day",
    title: "bars, gift sets & more",
    text: "From your daily wash to a thoughtful gift, there's an Olivra bar for it.",
    points: [
      {
        label: "Daily",
        title: "Bath bars",
        text: "Neem, lavender, honey oat and more.",
      },
      {
        label: "Gifting",
        title: "Gift sets",
        text: "Boxed sets for festivals and birthdays.",
      },
      {
        label: "Bulk",
        title: "Mini bars",
        text: "Guest-size soaps for hotels and events.",
      },
    ],
  },
  {
    tag: "Try one today",
    title: "your skin will thank you",
    text: "Free shipping above ₹499. Cash on delivery available.",
    stats: [
      { label: "handmade scents", value: 12, suffix: "+" },
      { label: "weeks of curing", value: 4 },
    ],
  },
];
