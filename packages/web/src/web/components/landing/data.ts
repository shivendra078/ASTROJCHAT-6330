export type Status = "online" | "busy" | "offline";

export type Astrologer = {
  id: string;
  name: string;
  img: string;
  skills: string[];
  langs: string[];
  topics: string[];
  gender: "Male" | "Female";
  exp: number;
  price: number;
  oldPrice?: number;
  rating: number;
  orders: number;
  status: Status;
  wait?: number;
  tag?: string;
  bio: string;
};

export const SKILLS = ["Vedic", "Tarot", "Numerology", "KP System", "Vastu", "Prashna", "Lal Kitab", "Palmistry", "Face Reading", "Nadi", "Psychic"];
export const LANGS = ["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Sanskrit"];
export const TOPICS = ["Love", "Marriage", "Career", "Health", "Business", "Family", "Finance", "Education"];

export const astrologers: Astrologer[] = [
  { id: "raghunath", topics: ["Marriage","Family","Finance"], name: "Acharya Raghunath", img: "/images/astro-1.jpg", skills: ["Vedic", "Prashna", "Vastu"], langs: ["Hindi", "Sanskrit"], gender: "Male", exp: 32, price: 45, oldPrice: 60, rating: 4.9, orders: 48210, status: "online", tag: "Top Choice", bio: "Third-generation Jyotishi from Varanasi. Known for precise timing of marriage and property matters." },
  { id: "meera", topics: ["Love","Career","Marriage"], name: "Meera Iyer", img: "/images/astro-2.jpg", skills: ["Tarot", "Numerology"], langs: ["English", "Tamil", "Hindi"], gender: "Female", exp: 9, price: 22, rating: 4.8, orders: 21540, status: "online", tag: "Rising Star", bio: "Intuitive tarot reader focused on relationships and life transitions." },
  { id: "alok", topics: ["Career","Education","Finance"], name: "Pt. Alok Shastri", img: "/images/astro-3.jpg", skills: ["KP System", "Vedic"], langs: ["Hindi", "English"], gender: "Male", exp: 18, price: 35, oldPrice: 42, rating: 4.9, orders: 36020, status: "busy", wait: 5, bio: "KP specialist for career, government jobs and competitive exams." },
  { id: "savitri", topics: ["Family","Health","Marriage"], name: "Savitri Devi", img: "/images/astro-4.jpg", skills: ["Vedic", "Face Reading"], langs: ["Hindi", "Bengali"], gender: "Female", exp: 24, price: 30, rating: 4.7, orders: 29300, status: "online", bio: "Compassionate guidance on family harmony, children and health periods." },
  { id: "arjun", topics: ["Business","Finance","Career"], name: "Arjun Mehta", img: "/images/astro-5.jpg", skills: ["Lal Kitab", "Numerology"], langs: ["Hindi", "Gujarati", "English"], gender: "Male", exp: 7, price: 18, oldPrice: 25, rating: 4.8, orders: 12480, status: "online", tag: "Offer", bio: "Practical Lal Kitab remedies for business growth and money flow." },
  { id: "ananya", topics: ["Love","Marriage"], name: "Ananya Rao", img: "/images/astro-6.jpg", skills: ["Palmistry", "Tarot"], langs: ["English", "Telugu", "Kannada"], gender: "Female", exp: 6, price: 15, rating: 4.7, orders: 9120, status: "offline", bio: "Palm and tarot readings for love, compatibility and self-growth." },
  { id: "devendra", topics: ["Marriage","Health","Business"], name: "Swami Devendra", img: "/images/astro-7.jpg", skills: ["Vedic", "Nadi", "Prashna"], langs: ["Hindi", "Marathi", "Sanskrit"], gender: "Male", exp: 28, price: 52, rating: 4.9, orders: 41800, status: "busy", wait: 12, tag: "Celebrity", bio: "Nadi and Prashna expert consulted for major life decisions and muhurat." },
  { id: "lakshmi", topics: ["Family","Business","Health"], name: "Lakshmi Nair", img: "/images/astro-8.jpg", skills: ["Vedic", "Vastu"], langs: ["Malayalam", "English", "Tamil"], gender: "Female", exp: 15, price: 28, rating: 4.8, orders: 18760, status: "online", bio: "Kerala-tradition astrologer and Vastu consultant for homes and offices." },
  { id: "kavya", topics: ["Love","Career"], name: "Kavya Sharma", img: "/images/astro-9.jpg", skills: ["Tarot", "Psychic"], langs: ["Hindi", "English", "Punjabi"], gender: "Female", exp: 4, price: 12, oldPrice: 18, rating: 4.6, orders: 5230, status: "online", tag: "New", bio: "Energy and angel-card reader for clarity in love and career confusion." },
  { id: "harish", topics: ["Business","Finance"], name: "Harish Joshi", img: "/images/astro-10.jpg", skills: ["KP System", "Numerology"], langs: ["Hindi", "Gujarati"], gender: "Male", exp: 12, price: 25, rating: 4.7, orders: 15400, status: "offline", bio: "Numbers and KP for business names, launch dates and finance." },
  { id: "kamala", topics: ["Marriage","Health","Family","Love"], name: "Dr. Kamala Bhatt", img: "/images/astro-11.jpg", skills: ["Vedic", "Palmistry", "Face Reading"], langs: ["Hindi", "English", "Marathi"], gender: "Female", exp: 35, price: 60, oldPrice: 75, rating: 5.0, orders: 52900, status: "online", tag: "Top Choice", bio: "PhD in Jyotish. Deep chart analysis for marriage, health and longevity." },
  { id: "rohan", topics: ["Career","Education","Love"], name: "Rohan Verma", img: "/images/astro-12.jpg", skills: ["Lal Kitab", "Vedic"], langs: ["Hindi", "English", "Bengali"], gender: "Male", exp: 8, price: 20, rating: 4.7, orders: 10340, status: "busy", wait: 3, bio: "Straightforward readings on career switches, foreign settlement and visas." },
];

export const fmtOrders = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);

export const reviews = [
  { name: "Priya S.", city: "Pune", text: "Meera ji predicted my job switch almost to the month. The chat was calm, private and didn't feel rushed at all.", rating: 5, topic: "Career" },
  { name: "Rohit K.", city: "Lucknow", text: "Got our kundli matched before the engagement. Acharya Raghunath explained every guna patiently — both families were reassured.", rating: 5, topic: "Marriage" },
  { name: "Sneha D.", city: "Kolkata", text: "I was skeptical, but the first free chat was genuinely helpful. The remedies were simple and practical, no fear-mongering.", rating: 5, topic: "Love" },
  { name: "Vikram J.", city: "Jaipur", text: "Used the call feature during a tough business decision. Clear, honest guidance and the timing advice worked out.", rating: 4, topic: "Business" },
  { name: "Aisha M.", city: "Hyderabad", text: "Daily horoscope notifications are spot on and the free Kundli report is more detailed than paid ones I've bought.", rating: 5, topic: "Horoscope" },
];

export const blogs = [
  { img: "/images/blog-1.jpg", tag: "Planetary Transit", title: "Purnima in October 2026: what the full moon means for your sign", date: "Oct 1, 2026", read: "5 min" },
  { img: "/images/blog-2.jpg", tag: "Kundli Basics", title: "Reading your birth chart: the 12 houses explained simply", date: "Sep 26, 2026", read: "8 min" },
  { img: "/images/blog-3.jpg", tag: "Gemstones", title: "Pukhraj, Moonga or Panna? Choosing a gemstone the right way", date: "Sep 19, 2026", read: "6 min" },
];
