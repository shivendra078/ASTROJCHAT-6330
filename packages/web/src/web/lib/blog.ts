import { astrologers } from "../components/landing/data";

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "tip"; title: string; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  tags: string[];
  lang: "English" | "Hindi";
  author: string; // astrologer id
  date: string; // YYYY-MM-DD
  img: string;
  views: number;
  featured?: boolean;
  body: Block[];
};

export const CATEGORIES = [
  "Vedic",
  "Kundli",
  "Transits",
  "Festivals",
  "Tarot",
  "Numerology",
  "Vastu",
  "Gemstones",
  "Compatibility",
  "Zodiac Signs",
  "Career & Money",
  "Mythological Tales",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const LANGUAGES = ["English", "Hindi"] as const;

export const POSTS: Post[] = [
  {
    slug: "purnima-october-2026-full-moon-meaning",
    title: "Sharad Purnima 2026: what the October full moon means for your sign",
    excerpt:
      "The brightest full moon of the year arrives on 26 October. Here is how the Moon in Revati–Ashwini colours each rashi, and the simple rituals worth keeping.",
    category: "Transits",
    tags: ["Moon", "Purnima", "Rituals"],
    lang: "English",
    author: "meera",
    date: "2026-10-01",
    img: "/images/blog-1.jpg",
    views: 48210,
    featured: true,
    body: [
      { t: "p", text: "Sharad Purnima, the full moon of Ashwin, is said to be the one night the Moon shines with all sixteen kalas. In 2026 the exact full moon falls on the morning of 26 October (IST), so most panchangs observe the vrat and moon-gazing on the night of 25 October." },
      { t: "h2", text: "Why this full moon is special" },
      { t: "p", text: "Coming right after the monsoon, the sky is at its clearest and the Moon sits near Revati and Ashwini — the last and first nakshatras of the zodiac. Astrologers read it as a night of completion and fresh starts at once: a good time to close emotional loops and set one clear intention." },
      { t: "ul", items: ["Kheer is kept under moonlight and eaten at dawn as prasad.", "Lakshmi is worshipped as Kojagari — 'who is awake?' — so many families stay up through the night.", "It is a gentle night for meditation, journaling and reconciling with someone you love."] },
      { t: "h2", text: "Sign-by-sign highlights" },
      { t: "p", text: "Fire signs (Aries, Leo, Sagittarius) feel a surge of confidence — channel it into a single priority rather than five. Earth signs (Taurus, Virgo, Capricorn) may see a money matter resolve. Air signs (Gemini, Libra, Aquarius) benefit from honest conversations. Water signs (Cancer, Scorpio, Pisces) should rest; emotions run high and intuition runs higher." },
      { t: "tip", title: "Simple remedy", text: "Offer raw milk mixed with water to the Moon after moonrise and chant 'Om Somaya Namah' 11 times. Keep it calm and unhurried — the intention matters more than the count." },
      { t: "quote", text: "The full moon does not change who you are. It simply turns the lights on so you can see it." },
    ],
  },
  {
    slug: "12-houses-of-birth-chart-explained",
    title: "Reading your birth chart: the 12 houses explained simply",
    excerpt: "Your kundli is a map of twelve rooms. Learn what each bhava rules, and how to spot the strongest areas of your life at a glance.",
    category: "Kundli",
    tags: ["Houses", "Beginners", "Lagna"],
    lang: "English",
    author: "alok",
    date: "2026-09-26",
    img: "/images/blog-2.jpg",
    views: 61540,
    featured: true,
    body: [
      { t: "p", text: "Every kundli is divided into twelve bhavas, or houses. The first house begins at your Lagna — the sign rising on the eastern horizon when you were born — and the rest follow in order. Planets sitting in a house, and the lord of that house, describe how that area of life plays out." },
      { t: "h2", text: "The four pillars: 1, 4, 7 and 10" },
      { t: "p", text: "The kendra houses carry the most weight. The 1st is your body and temperament, the 4th home, mother and inner peace, the 7th marriage and partnerships, and the 10th career and public standing. Benefic planets here give a stable life; strong malefics give drive and ambition." },
      { t: "h2", text: "Wealth, effort and fortune" },
      { t: "ul", items: ["2nd — family, speech and accumulated wealth", "3rd — courage, siblings, short travel and skills", "5th — children, creativity, intelligence and past-life merit", "9th — dharma, father, teachers and luck", "11th — gains, income and fulfilment of desires"] },
      { t: "h2", text: "The challenging houses: 6, 8 and 12" },
      { t: "p", text: "The dusthanas are not 'bad' houses — they are where we grow. The 6th rules competition, debt and health routines; the 8th sudden change, research and the occult; the 12th expenses, foreign lands and moksha. Malefics actually do well in the 6th, where they help you beat rivals." },
      { t: "tip", title: "Try it yourself", text: "Generate your free kundli, open the Planets tab and note which houses hold three or more planets. Those are the stories your life will keep returning to." },
    ],
  },
  {
    slug: "choosing-gemstone-pukhraj-moonga-panna",
    title: "Pukhraj, Moonga or Panna? Choosing a gemstone the right way",
    excerpt: "A gemstone amplifies a planet — it does not fix it. Here is how astrologers decide which stone suits your chart, and which ones to avoid.",
    category: "Gemstones",
    tags: ["Remedies", "Jupiter", "Mars", "Mercury"],
    lang: "English",
    author: "arjun",
    date: "2026-09-19",
    img: "/images/blog-3.jpg",
    views: 39880,
    body: [
      { t: "p", text: "Gemstones are one of the most requested remedies, and one of the most misused. A stone strengthens the planet it represents. If that planet rules good houses in your chart, the effect is helpful; if it rules the 6th, 8th or 12th, a stone can amplify exactly the problems you want to reduce." },
      { t: "h2", text: "The three popular stones" },
      { t: "ul", items: ["Pukhraj (yellow sapphire) — Jupiter. Wisdom, children, marriage for women, teaching and finance.", "Moonga (red coral) — Mars. Energy, property, courage and recovery from fatigue.", "Panna (emerald) — Mercury. Speech, business, writing, analytics and nervous balance."] },
      { t: "h2", text: "How the right stone is chosen" },
      { t: "p", text: "An astrologer looks at your Lagna lord, the 5th and 9th lords (always considered friendly), and the running Mahadasha. A Sagittarius or Pisces ascendant often suits Pukhraj; Aries or Scorpio may suit Moonga; Gemini or Virgo may suit Panna — but placements and dashas can change the answer." },
      { t: "tip", title: "Before you buy", text: "Wear a trial stone for a week before committing to an expensive one, insist on a lab certificate, and never combine Pukhraj with Panna or Moonga with Panna without a reading." },
    ],
  },
  {
    slug: "navratri-2026-dates-colours-nine-forms",
    title: "Navratri 2026: dates, colours of the day and the nine forms of Durga",
    excerpt: "Sharad Navratri begins on 11 October 2026. A day-by-day guide to each goddess, her colour and the bhog that is traditionally offered.",
    category: "Festivals",
    tags: ["Navratri", "Durga", "Vrat"],
    lang: "English",
    author: "savitri",
    date: "2026-09-30",
    img: "/images/blog-7.jpg",
    views: 52340,
    featured: true,
    body: [
      { t: "p", text: "Sharad Navratri starts on Pratipada of Ashwin Shukla Paksha, the day after the new moon. In 2026 that is Sunday, 11 October, with Ghatasthapana in the morning and Vijayadashami (Dussehra) falling on 20 October." },
      { t: "h2", text: "The nine forms" },
      { t: "ul", items: ["Day 1 — Shailaputri", "Day 2 — Brahmacharini", "Day 3 — Chandraghanta", "Day 4 — Kushmanda", "Day 5 — Skandamata", "Day 6 — Katyayani", "Day 7 — Kalaratri", "Day 8 — Mahagauri (Ashtami, Kanya Pujan)", "Day 9 — Siddhidatri"] },
      { t: "h2", text: "Fasting the gentle way" },
      { t: "p", text: "You do not need to fast all nine days to receive the blessing. Many families keep the first and last day, or Ashtami alone. Sattvic food — fruit, milk, sabudana, kuttu and samak rice — keeps the mind calm and the body light." },
      { t: "tip", title: "Muhurat check", text: "Use our Panchang page to confirm the exact Pratipada timing and Abhijit Muhurat for Ghatasthapana in your city." },
    ],
  },
  {
    slug: "tarot-for-beginners-three-card-spread",
    title: "Tarot for beginners: your first three-card spread",
    excerpt: "Past, present, future is the oldest spread for a reason. Learn how to shuffle, ask a good question and read the cards as a story.",
    category: "Tarot",
    tags: ["Tarot", "Beginners", "Spreads"],
    lang: "English",
    author: "kavya",
    date: "2026-09-24",
    img: "/images/blog-4.jpg",
    views: 27610,
    body: [
      { t: "p", text: "Tarot is less about predicting a fixed future and more about seeing the forces around a question clearly. The three-card spread is the perfect place to start: it is small enough to read in a few minutes, and rich enough to surprise you." },
      { t: "h2", text: "Ask an open question" },
      { t: "p", text: "Swap 'Will I get the job?' for 'What do I need to know about this job opportunity?'. Open questions invite guidance instead of a yes or no, and they keep the reading honest." },
      { t: "h2", text: "Lay the cards" },
      { t: "ul", items: ["Left — the past, or what has led here", "Centre — the present, or the heart of the matter", "Right — the likely direction if nothing changes"] },
      { t: "p", text: "Read the three cards together. Do suits repeat? Many Cups point to emotions, Pentacles to money and work, Swords to thought and conflict, Wands to energy and ambition. A Major Arcana card signals a bigger life lesson." },
      { t: "quote", text: "The cards do not tell you what to do. They show you what you already know but have not said out loud." },
    ],
  },
  {
    slug: "vastu-tips-main-entrance",
    title: "Vastu for the main entrance: 7 small changes with big impact",
    excerpt: "The main door is the mouth of the home. Simple, renovation-free Vastu tips to invite light, prosperity and calm through your entrance.",
    category: "Vastu",
    tags: ["Vastu", "Home", "Prosperity"],
    lang: "English",
    author: "lakshmi",
    date: "2026-09-21",
    img: "/images/blog-5.jpg",
    views: 33190,
    body: [
      { t: "p", text: "In Vastu Shastra, energy — prana — enters a home primarily through its main door. You do not need to move walls to improve it. A few thoughtful changes can make the entrance feel more welcoming to people and to prosperity alike." },
      { t: "h2", text: "Seven easy changes" },
      { t: "ul", items: ["Keep the area well lit, especially after sunset.", "Fix squeaky hinges and broken bells — sound at the door should be pleasant.", "Place a tulsi or money plant nearby, but not thorny plants.", "Use a clean doormat and avoid shoes piled at the door.", "An urli with floating flowers or a swastik/om symbol is traditional and auspicious.", "Avoid a mirror directly facing the main door.", "North, north-east and east facing doors are considered most favourable."] },
      { t: "tip", title: "If your door faces south", text: "Do not panic. A south-facing door is fine with a copper or brass threshold strip, a bright red or maroon door colour, and good lighting." },
    ],
  },
  {
    slug: "saturn-in-pisces-2026-what-to-expect",
    title: "Saturn in Pisces: what the rest of 2026 asks of each sign",
    excerpt: "Shani continues its walk through Pisces. Who is in Sade Sati, who has Dhaiya, and how to work with Saturn instead of fearing it.",
    category: "Transits",
    tags: ["Saturn", "Sade Sati", "Shani"],
    lang: "English",
    author: "raghunath",
    date: "2026-09-17",
    img: "/images/blog-6.jpg",
    views: 71230,
    featured: true,
    body: [
      { t: "p", text: "Saturn moves slowly — about two and a half years in each sign — so its transits shape long chapters rather than single days. Through 2026 it remains in Pisces, the sign of surrender, compassion and endings." },
      { t: "h2", text: "Sade Sati and Dhaiya right now" },
      { t: "ul", items: ["Aquarius Moon — last phase of Sade Sati: lessons conclude, responsibilities lighten.", "Pisces Moon — peak of Sade Sati: rest, discipline and health routines are key.", "Aries Moon — first phase begins: plan finances and avoid impulsive moves.", "Leo and Sagittarius Moon — Dhaiya (Kantak Shani): patience in work and family matters."] },
      { t: "h2", text: "Working with Shani" },
      { t: "p", text: "Saturn rewards structure, honesty and service. The most powerful remedies are behavioural: keep promises, respect elders and workers, be punctual, and give to those who have less. Traditional remedies include lighting a sesame-oil lamp under a peepal tree on Saturdays and reciting the Hanuman Chalisa." },
      { t: "quote", text: "Shani is the strict teacher, not the enemy. He only takes away what you were never meant to keep." },
    ],
  },
  {
    slug: "life-path-number-numerology-guide",
    title: "Your life path number: a quick numerology guide",
    excerpt: "Add the digits of your birth date and you get a number that describes your life's core lesson. Here is what 1 through 9 (and 11, 22) mean.",
    category: "Numerology",
    tags: ["Numerology", "Life Path", "Beginners"],
    lang: "English",
    author: "harish",
    date: "2026-09-14",
    img: "/images/blog-8.jpg",
    views: 29470,
    body: [
      { t: "p", text: "Your life path number is the single most important number in numerology. To find it, add every digit of your full date of birth until you reach one digit — unless you land on 11 or 22, the master numbers, which are kept as they are." },
      { t: "tip", title: "Example", text: "Born 14 August 1995: 1+4+0+8+1+9+9+5 = 37, and 3+7 = 10, and 1+0 = 1. Life path 1." },
      { t: "h2", text: "What each number means" },
      { t: "ul", items: ["1 — leader and pioneer", "2 — peacemaker and partner", "3 — communicator and creator", "4 — builder and organiser", "5 — explorer and free spirit", "6 — nurturer and healer", "7 — seeker and analyst", "8 — achiever and manager of wealth", "9 — humanitarian and old soul", "11 / 22 — master intuitive / master builder"] },
      { t: "p", text: "Numerology works best alongside your kundli. A life path 8 with a strong Saturn, for example, often shows a slow but very solid rise in career." },
    ],
  },
  {
    slug: "kundli-matching-36-gunas-explained",
    title: "Kundli matching: what the 36 gunas really tell you",
    excerpt: "18 is the pass mark, but the score is only the start. A practical look at Ashtakoot milan, Nadi dosha and what matters beyond the number.",
    category: "Compatibility",
    tags: ["Marriage", "Guna Milan", "Manglik"],
    lang: "English",
    author: "kamala",
    date: "2026-09-10",
    img: "/images/blog-9.jpg",
    views: 58820,
    body: [
      { t: "p", text: "Ashtakoot milan compares the Moon nakshatras of two people across eight factors, worth 36 points in total. Families often treat 18 as the minimum, but experienced astrologers look at the whole picture." },
      { t: "h2", text: "The eight kootas" },
      { t: "ul", items: ["Varna (1) — temperament and values", "Vashya (2) — mutual attraction and influence", "Tara (3) — health and wellbeing together", "Yoni (4) — physical and intimate compatibility", "Graha Maitri (5) — mental friendship", "Gana (6) — nature: Deva, Manushya or Rakshasa", "Bhakoot (7) — family welfare and finances", "Nadi (8) — health of progeny"] },
      { t: "h2", text: "Beyond the score" },
      { t: "p", text: "A 28/36 match with an afflicted 7th house can be harder than a 20/36 match with strong Venus and Jupiter in both charts. Manglik status, the running dashas and the 7th lord's condition all matter, and many doshas have classical cancellations." },
      { t: "tip", title: "Start here", text: "Generate both kundlis for free, note each person's Moon nakshatra, then bring both to an astrologer for a full reading." },
    ],
  },
  {
    slug: "rahu-ketu-mythology-samudra-manthan",
    title: "How Rahu and Ketu were born: the story of Samudra Manthan",
    excerpt: "One demon, one sip of amrit and one swift discus. The myth behind the shadow planets — and why they still chase the Sun and Moon.",
    category: "Mythological Tales",
    tags: ["Rahu", "Ketu", "Mythology"],
    lang: "English",
    author: "devendra",
    date: "2026-09-06",
    img: "/images/blog-10.jpg",
    views: 24150,
    body: [
      { t: "p", text: "When the devas and asuras churned the cosmic ocean for amrit, the nectar of immortality, Lord Vishnu took the form of Mohini to distribute it. One clever asura, Svarbhanu, disguised himself as a deva and sat between the Sun and the Moon." },
      { t: "p", text: "Just as the nectar touched his throat, Surya and Chandra recognised him. Vishnu's Sudarshan Chakra severed his head — but having tasted amrit, he could not die. The head became Rahu, the body Ketu." },
      { t: "h2", text: "What it means in astrology" },
      { t: "p", text: "Rahu, the head, is endless desire and worldly ambition; Ketu, the headless body, is detachment, intuition and past-life skill. They are always exactly opposite each other, and eclipses happen when the Sun and Moon come close to them — the old grudge, replayed in the sky." },
      { t: "quote", text: "Rahu wants everything; Ketu has already had it. Life is the art of walking between them." },
    ],
  },
  {
    slug: "moon-sign-vs-sun-sign",
    title: "Moon sign vs Sun sign: which one should you read?",
    excerpt: "Western horoscopes use your Sun sign; Vedic astrology prefers your Moon sign. Here is why, and how to find your rashi in seconds.",
    category: "Zodiac Signs",
    tags: ["Moon", "Rashi", "Beginners"],
    lang: "English",
    author: "rohan",
    date: "2026-09-02",
    img: "/images/blog-11.jpg",
    views: 44960,
    body: [
      { t: "p", text: "If you have ever read a Vedic horoscope and felt it did not match, you might have been reading the wrong sign. Vedic astrology gives first importance to the Moon, which governs the mind, emotions and daily experience." },
      { t: "h2", text: "Why the Moon matters" },
      { t: "p", text: "The Sun changes signs once a month; the Moon every two and a half days. That speed makes it the best indicator of how events feel to you. Dashas, Sade Sati and daily horoscopes in Indian astrology are all calculated from the Moon sign." },
      { t: "h2", text: "Why your Sun sign may differ too" },
      { t: "p", text: "Vedic astrology uses the sidereal zodiac, which is currently about 24° behind the tropical zodiac used in the West. So a Western Aries born in late March is often a Vedic Pisces." },
      { t: "tip", title: "Find your rashi", text: "Our Free Kundli shows your Moon sign, nakshatra and pada on the first screen." },
    ],
  },
  {
    slug: "career-astrology-10th-house",
    title: "Career astrology: what your 10th house says about your work",
    excerpt: "From the 10th lord to the Sun and Saturn, the chart factors that point to government jobs, business, creative work and late bloomers.",
    category: "Career & Money",
    tags: ["Career", "10th House", "Saturn"],
    lang: "English",
    author: "alok",
    date: "2026-08-28",
    img: "/images/blog-12.jpg",
    views: 36780,
    body: [
      { t: "p", text: "The 10th house — karma bhava — is the highest point of the chart and shows your work in the world. The sign there, planets in it, and where its lord goes together sketch the kind of career that feels natural to you." },
      { t: "h2", text: "Quick indicators" },
      { t: "ul", items: ["Sun strong in the 10th — government, administration, leadership roles", "Mercury — business, communication, technology, accounting", "Venus — design, fashion, hospitality, the arts", "Mars — engineering, defence, sports, surgery, real estate", "Jupiter — teaching, law, finance, advisory", "Saturn — slow, steady rise; large organisations, operations, public service"] },
      { t: "h2", text: "Timing matters" },
      { t: "p", text: "The dasha of the 10th lord, or of planets placed in the 10th, often brings promotions or a change of field. Transiting Jupiter over the 10th or aspecting it is a classic window for growth." },
    ],
  },
  {
    slug: "diwali-2026-lakshmi-puja-muhurat-hindi",
    title: "दिवाली 2026: लक्ष्मी पूजा का शुभ मुहूर्त और पूजा विधि",
    excerpt: "इस वर्ष दिवाली 8 नवंबर 2026 को मनाई जाएगी। जानें प्रदोष काल में लक्ष्मी पूजन का सही समय और सरल पूजा विधि।",
    category: "Festivals",
    tags: ["Diwali", "Lakshmi", "Muhurat"],
    lang: "Hindi",
    author: "raghunath",
    date: "2026-09-29",
    img: "/images/blog-7.jpg",
    views: 41870,
    body: [
      { t: "p", text: "कार्तिक मास की अमावस्या को दीपावली का पर्व मनाया जाता है। वर्ष 2026 में अमावस्या तिथि 8 नवंबर की शाम से आरंभ होकर 9 नवंबर तक रहेगी, इसलिए प्रदोष काल में लक्ष्मी पूजन 8 नवंबर, रविवार को किया जाएगा।" },
      { t: "h2", text: "पूजा की सामग्री" },
      { t: "ul", items: ["लक्ष्मी-गणेश की मूर्ति या चित्र", "कमल का फूल, कुमकुम, अक्षत", "घी के दीपक और मिट्टी के दीये", "खील-बताशे और मिठाई"] },
      { t: "h2", text: "सरल पूजा विधि" },
      { t: "p", text: "स्नान के बाद पूजा स्थान को साफ करें, चौकी पर लाल वस्त्र बिछाकर गणेश और लक्ष्मी जी को स्थापित करें। पहले गणेश जी का, फिर लक्ष्मी जी का पूजन करें और 'ॐ श्रीं महालक्ष्म्यै नमः' मंत्र का 108 बार जाप करें।" },
      { t: "tip", title: "ध्यान दें", text: "अपने शहर का सटीक प्रदोष काल और स्थिर लग्न जानने के लिए हमारा पंचांग पेज देखें।" },
    ],
  },
  {
    slug: "shani-sade-sati-upay-hindi",
    title: "शनि की साढ़ेसाती: लक्षण, प्रभाव और सरल उपाय",
    excerpt: "साढ़ेसाती से डरने की नहीं, समझने की ज़रूरत है। जानें इसके तीन चरण और शनिदेव को प्रसन्न करने के आसान उपाय।",
    category: "Vedic",
    tags: ["Saturn", "Sade Sati", "Remedies"],
    lang: "Hindi",
    author: "devendra",
    date: "2026-09-12",
    img: "/images/blog-6.jpg",
    views: 38420,
    body: [
      { t: "p", text: "जब गोचर में शनि आपकी चंद्र राशि से बारहवें, पहले और दूसरे भाव से गुजरता है, तो लगभग साढ़े सात वर्ष की यह अवधि साढ़ेसाती कहलाती है।" },
      { t: "h2", text: "तीन चरण" },
      { t: "ul", items: ["पहला चरण — खर्च और मानसिक चिंता बढ़ सकती है", "दूसरा चरण — स्वास्थ्य और ज़िम्मेदारियों पर ध्यान", "तीसरा चरण — परिवार और धन से जुड़ी सीख"] },
      { t: "h2", text: "सरल उपाय" },
      { t: "p", text: "शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएँ, हनुमान चालीसा का पाठ करें, और ज़रूरतमंदों की सेवा करें। ईमानदारी और अनुशासन शनिदेव के सबसे प्रिय उपाय हैं।" },
    ],
  },
  {
    slug: "angel-number-1111-meaning",
    title: "1111 angel number: meaning for love, career and twin flames",
    excerpt: "Seeing 11:11 everywhere? Numerologists read it as a doorway number — a nudge to notice your thoughts, because they are manifesting fast.",
    category: "Numerology",
    tags: ["Angel Numbers", "Manifestation"],
    lang: "English",
    author: "meera",
    date: "2026-08-22",
    img: "/images/blog-8.jpg",
    views: 66310,
    body: [
      { t: "p", text: "1111 is made of the number 1 — beginnings, independence, will — repeated four times, and it also contains the master number 11, the number of intuition. Together they suggest a moment where intention and opportunity line up." },
      { t: "h2", text: "In love" },
      { t: "p", text: "If you are single, 1111 encourages you to be clear about what you want rather than settling. In a relationship, it is a call to start something new together — a trip, a home, an honest conversation." },
      { t: "h2", text: "In career" },
      { t: "p", text: "A good time to pitch the idea, apply for the role or start the side project. The number favours initiative over waiting for permission." },
      { t: "tip", title: "A small ritual", text: "Next time you see 11:11, pause, breathe, and say one sentence about what you want — in the present tense." },
    ],
  },
  {
    slug: "mercury-retrograde-survival-guide",
    title: "Mercury retrograde survival guide: what to do and what to avoid",
    excerpt: "Three or four times a year Budh appears to move backwards. Here is a calm, practical checklist instead of panic.",
    category: "Transits",
    tags: ["Mercury", "Retrograde"],
    lang: "English",
    author: "ananya",
    date: "2026-08-15",
    img: "/images/blog-12.jpg",
    views: 31260,
    body: [
      { t: "p", text: "Mercury retrograde is an optical effect — from Earth the planet seems to reverse in the sky. Astrologically it slows down Mercury's themes: communication, contracts, travel, technology and trade." },
      { t: "h2", text: "Good things to do" },
      { t: "ul", items: ["Revise, edit and finish old projects", "Reconnect with old friends and clients", "Back up your phone and laptop", "Re-read contracts before signing"] },
      { t: "h2", text: "Things to postpone if you can" },
      { t: "ul", items: ["Buying new gadgets or vehicles", "Launching a brand or website", "Signing long-term agreements in a hurry"] },
      { t: "quote", text: "Retrograde is not a stop sign. It is a 'slow down, check your mirrors' sign." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug) ?? null;
export const authorOf = (p: Post) => astrologers.find((a) => a.id === p.author)!;

export const fmtPostDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const readMins = (p: Post) => {
  const words = p.body
    .map((b) => (b.t === "ul" ? b.items.join(" ") : b.t === "tip" ? `${b.title} ${b.text}` : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(3, Math.round(words / 160) + 2);
};

export const fmtViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

export const ALL_TAGS = Array.from(new Set(POSTS.flatMap((p) => p.tags))).sort();

export const related = (p: Post, n = 3) =>
  POSTS.filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, score: (x.category === p.category ? 3 : 0) + x.tags.filter((t) => p.tags.includes(t)).length + (x.lang === p.lang ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || b.x.date.localeCompare(a.x.date))
    .slice(0, n)
    .map((r) => r.x);
