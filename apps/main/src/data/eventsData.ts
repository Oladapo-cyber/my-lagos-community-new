// 20 diverse Lagos events with full detail data
export interface TicketPrices {
  regular: number;
  vip: number;
  gold: number;
  platinum: number;
}

export interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: string;
  img: string;
  description: string;
  organizer: string;
  tags: string[];
  ticketPrices: TicketPrices;
}

export const EVENTS_DATA: EventData[] = [
  {
    id: 1,
    title: "Lagos International Jazz Festival",
    date: "15 Feb, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Eko Hotel & Suites, Victoria Island",
    price: "Starts At ₦15,000",
    category: "Music",
    img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
    description: "Experience the best of jazz music at the Lagos International Jazz Festival. Featuring world-class musicians from across the globe, this annual celebration brings together jazz enthusiasts for an unforgettable evening of soulful music, fine dining, and cultural exchange. The festival showcases both established legends and emerging artists, creating a vibrant atmosphere that resonates with the spirit of Lagos.",
    organizer: "Lagos Jazz Society",
    tags: ["Live Show", "Jazz", "Music Festival"],
    ticketPrices: { regular: 15000, vip: 50000, gold: 200000, platinum: 500000 }
  },
  {
    id: 2,
    title: "Tech Startup Weekend Lagos",
    date: "18 Feb, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "CcHub, Yaba",
    price: "Free",
    category: "Business",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    description: "Join Nigeria's premier startup weekend where aspiring entrepreneurs come together to pitch ideas, form teams, and build products in just 54 hours. Network with mentors, investors, and fellow innovators in Yaba's thriving tech ecosystem. Whether you're a developer, designer, or business strategist, this is your chance to turn your vision into reality.",
    organizer: "CcHub Innovation",
    tags: ["Startup", "Networking", "Tech"],
    ticketPrices: { regular: 0, vip: 0, gold: 0, platinum: 0 }
  },
  {
    id: 3,
    title: "Afrobeats Night at Quilox",
    date: "20 Feb, 2026",
    time: "10:00 PM - 4:00 AM",
    location: "Quilox Nightclub, Victoria Island",
    price: "Starts At ₦25,000",
    category: "Music",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    description: "Get ready for an electrifying night of Afrobeats at Lagos' most exclusive nightclub. Featuring top DJs and surprise celebrity performances, this event promises non-stop dancing, premium cocktails, and VIP experiences. Dress to impress and prepare for a night you'll never forget in the heart of Victoria Island.",
    organizer: "Quilox Entertainment",
    tags: ["Nightlife", "Afrobeats", "Live Band"],
    ticketPrices: { regular: 25000, vip: 75000, gold: 300000, platinum: 750000 }
  },
  {
    id: 4,
    title: "Lagos Food & Wine Festival",
    date: "22 Feb, 2026",
    time: "12:00 PM - 8:00 PM",
    location: "Federal Palace Hotel, Victoria Island",
    price: "Starts At ₦30,000",
    category: "Food & Drinks",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
    description: "Indulge your palate at the Lagos Food & Wine Festival, where Nigeria's top chefs and international culinary artists showcase their finest creations. From traditional Nigerian cuisine to contemporary fusion dishes, paired with an exquisite selection of wines from around the world. Enjoy cooking demonstrations, wine tastings, and exclusive dining experiences.",
    organizer: "Lagos Culinary Circle",
    tags: ["Food", "Wine", "Culinary"],
    ticketPrices: { regular: 30000, vip: 80000, gold: 350000, platinum: 800000 }
  },
  {
    id: 5,
    title: "Art X Lagos 2026",
    date: "25 Feb, 2026",
    time: "10:00 AM - 7:00 PM",
    location: "Eko Convention Centre",
    price: "Starts At ₦5,000",
    category: "Arts & Culture",
    img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop",
    description: "Art X Lagos is West Africa's premier international art fair, bringing together leading galleries, artists, and collectors from across the continent and beyond. Explore contemporary African art through exhibitions, panel discussions, and interactive installations that challenge and inspire. A must-attend event for art lovers and collectors alike.",
    organizer: "Art X Collective",
    tags: ["Art", "Exhibition", "Culture"],
    ticketPrices: { regular: 5000, vip: 20000, gold: 100000, platinum: 250000 }
  },
  {
    id: 6,
    title: "Yoga & Wellness Retreat",
    date: "28 Feb, 2026",
    time: "7:00 AM - 5:00 PM",
    location: "La Campagne Tropicana, Ibeju-Lekki",
    price: "Starts At ₦20,000",
    category: "Health & Wellness",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    description: "Escape the hustle of Lagos for a day of rejuvenation at La Campagne Tropicana. This wellness retreat features yoga sessions led by certified instructors, meditation workshops, healthy organic meals, and spa treatments. Reconnect with nature and find your inner peace in this tropical paradise just outside the city.",
    organizer: "Lagos Wellness Hub",
    tags: ["Yoga", "Wellness", "Meditation"],
    ticketPrices: { regular: 20000, vip: 50000, gold: 150000, platinum: 400000 }
  },
  {
    id: 7,
    title: "Comedy Night with Basket Mouth",
    date: "01 Mar, 2026",
    time: "7:00 PM - 11:00 PM",
    location: "Eko Hotel Grand Ballroom",
    price: "Starts At ₦10,000",
    category: "Comedy",
    img: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop",
    description: "Laugh till your sides hurt at this epic comedy showcase headlined by the legendary Basket Mouth. Joined by a stellar lineup of Nigeria's funniest comedians, this night promises rib-cracking jokes, side-splitting skits, and entertainment that will leave you in stitches. Dinner and drinks packages available.",
    organizer: "Basket Mouth Entertainment",
    tags: ["Comedy", "Live Show", "Entertainment"],
    ticketPrices: { regular: 10000, vip: 30000, gold: 150000, platinum: 500000 }
  },
  {
    id: 8,
    title: "Digital Marketing Masterclass",
    date: "03 Mar, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Landmark Centre, Victoria Island",
    price: "Starts At ₦15,000",
    category: "Webinar",
    img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop",
    description: "Master the art of digital marketing with industry experts who have driven campaigns for Fortune 500 companies. Learn SEO, social media marketing, content strategy, email marketing, and paid advertising in this comprehensive one-day masterclass. Walk away with actionable strategies you can implement immediately.",
    organizer: "DigiLagos Academy",
    tags: ["Marketing", "Digital", "Workshop"],
    ticketPrices: { regular: 15000, vip: 40000, gold: 200000, platinum: 500000 }
  },
  {
    id: 9,
    title: "Lagos Fashion Week 2026",
    date: "05 Mar, 2026",
    time: "4:00 PM - 10:00 PM",
    location: "Federal Palace Hotel",
    price: "Starts At ₦50,000",
    category: "Fashion Show",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop",
    description: "Lagos Fashion Week is Africa's leading fashion event, showcasing the continent's most talented designers on a global stage. Experience cutting-edge runway shows, exclusive after-parties, and networking opportunities with fashion industry leaders. From haute couture to streetwear, witness the future of African fashion unfold.",
    organizer: "Style House Files",
    tags: ["Fashion", "Runway", "Design"],
    ticketPrices: { regular: 50000, vip: 150000, gold: 500000, platinum: 1500000 }
  },
  {
    id: 10,
    title: "Beach Volleyball Championship",
    date: "08 Mar, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Elegushi Beach, Lekki",
    price: "Free",
    category: "Sports",
    img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop",
    description: "Watch top volleyball teams battle it out on the sandy courts of Elegushi Beach. This championship features teams from across Nigeria competing for the grand prize. Enjoy live music, beach vendors, and a vibrant atmosphere while cheering on your favorite teams. Free entry for spectators!",
    organizer: "Lagos Sports Commission",
    tags: ["Sports", "Beach", "Competition"],
    ticketPrices: { regular: 0, vip: 0, gold: 0, platinum: 0 }
  },
  {
    id: 11,
    title: "Nollywood Film Festival",
    date: "10 Mar, 2026",
    time: "2:00 PM - 10:00 PM",
    location: "Silverbird Galleria",
    price: "Starts At ₦8,000",
    category: "Arts & Culture",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop",
    description: "Celebrate the magic of Nigerian cinema at the Nollywood Film Festival. Watch premieres of highly anticipated films, attend Q&A sessions with top directors and actors, and participate in filmmaking workshops. This festival honors the best of Nollywood while showcasing emerging talent in the industry.",
    organizer: "Nollywood Film Board",
    tags: ["Film", "Nollywood", "Cinema"],
    ticketPrices: { regular: 8000, vip: 25000, gold: 100000, platinum: 300000 }
  },
  {
    id: 12,
    title: "Craft Beer Tasting Evening",
    date: "12 Mar, 2026",
    time: "5:00 PM - 9:00 PM",
    location: "Terra Kulture, Victoria Island",
    price: "Starts At ₦12,000",
    category: "Food & Drinks",
    img: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop",
    description: "Discover Nigeria's burgeoning craft beer scene at this exclusive tasting evening. Sample unique brews from local microbreweries, learn about the brewing process from master brewers, and enjoy artisanal food pairings. A perfect evening for beer enthusiasts and foodies looking for something different.",
    organizer: "Lagos Brew Collective",
    tags: ["Beer", "Tasting", "Social"],
    ticketPrices: { regular: 12000, vip: 35000, gold: 120000, platinum: 350000 }
  },
  {
    id: 13,
    title: "Startup Pitch Competition",
    date: "14 Mar, 2026",
    time: "9:00 AM - 3:00 PM",
    location: "Zone Tech Park, Gbagada",
    price: "Free",
    category: "Business",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop",
    description: "Watch as Nigeria's most promising startups pitch their ideas to a panel of top-tier investors and industry leaders. With ₦10 million in prize money at stake, entrepreneurs will present innovative solutions to real-world problems. Attend to discover the next big thing in African tech and business.",
    organizer: "TechPoint Africa",
    tags: ["Startup", "Investment", "Pitch"],
    ticketPrices: { regular: 0, vip: 0, gold: 0, platinum: 0 }
  },
  {
    id: 14,
    title: "Salsa Dancing Night",
    date: "16 Mar, 2026",
    time: "8:00 PM - 12:00 AM",
    location: "Hardrock Cafe Lagos",
    price: "Starts At ₦5,000",
    category: "Music",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
    description: "Put on your dancing shoes for an evening of passionate salsa dancing at Hardrock Cafe Lagos. Whether you're a beginner or experienced dancer, our professional instructors will guide you through the moves. Enjoy Latin music, cocktails, and a warm social atmosphere that will have you dancing all night.",
    organizer: "Lagos Dance Academy",
    tags: ["Dance", "Salsa", "Social"],
    ticketPrices: { regular: 5000, vip: 15000, gold: 50000, platinum: 150000 }
  },
  {
    id: 15,
    title: "Photography Workshop",
    date: "18 Mar, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Freedom Park, Lagos Island",
    price: "Starts At ₦18,000",
    category: "Arts & Culture",
    img: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&auto=format&fit=crop",
    description: "Learn the art of photography from award-winning photographers at this hands-on workshop. Cover composition, lighting, editing, and storytelling through the lens. Perfect for beginners and intermediate photographers looking to level up their skills. Bring your camera and get ready to capture the beauty of Lagos.",
    organizer: "Lagos Photo Collective",
    tags: ["Photography", "Workshop", "Creative"],
    ticketPrices: { regular: 18000, vip: 45000, gold: 150000, platinum: 400000 }
  },
  {
    id: 16,
    title: "Chess Tournament Finals",
    date: "20 Mar, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "Lagos Country Club, Ikeja",
    price: "Starts At ₦3,000",
    category: "Sports",
    img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop",
    description: "Witness Nigeria's sharpest minds battle it out in the Lagos Chess Tournament Finals. This prestigious competition brings together grandmasters and rising stars for an intense day of strategic gameplay. Spectators can enjoy commentary from chess experts and participate in side tournaments for beginners.",
    organizer: "Nigeria Chess Federation",
    tags: ["Chess", "Tournament", "Strategy"],
    ticketPrices: { regular: 3000, vip: 10000, gold: 50000, platinum: 150000 }
  },
  {
    id: 17,
    title: "Electronic Music Festival",
    date: "22 Mar, 2026",
    time: "4:00 PM - 2:00 AM",
    location: "Landmark Beach, Oniru",
    price: "Starts At ₦20,000",
    category: "Music",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
    description: "Experience Lagos' biggest electronic music festival on the stunning shores of Landmark Beach. Featuring international DJs, immersive light shows, and state-of-the-art sound systems, this beachside rave promises an otherworldly experience. Dance under the stars with thousands of fellow music lovers.",
    organizer: "Lagos EDM Collective",
    tags: ["EDM", "Festival", "Beach Party"],
    ticketPrices: { regular: 20000, vip: 60000, gold: 250000, platinum: 700000 }
  },
  {
    id: 18,
    title: "Wine & Paint Session",
    date: "24 Mar, 2026",
    time: "3:00 PM - 7:00 PM",
    location: "Bogobiri House, Ikoyi",
    price: "Starts At ₦15,000",
    category: "Arts & Culture",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop",
    description: "Unleash your inner artist at this relaxing wine and paint session at the charming Bogobiri House. No experience needed — just bring your creativity! A professional artist will guide you step-by-step while you sip on premium wines and enjoy light bites in Ikoyi's most artistic venue.",
    organizer: "Bogobiri Art House",
    tags: ["Art", "Wine", "Creative"],
    ticketPrices: { regular: 15000, vip: 40000, gold: 120000, platinum: 350000 }
  },
  {
    id: 19,
    title: "Book Club Meetup",
    date: "26 Mar, 2026",
    time: "4:00 PM - 7:00 PM",
    location: "Jazzhole, Ikoyi",
    price: "Free",
    category: "Webinar",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop",
    description: "Join Lagos' most vibrant book club for an afternoon of literary discussion at the iconic Jazzhole bookshop. This month we're diving into contemporary African literature. Whether you're an avid reader or just starting your reading journey, you'll find a welcoming community of fellow book lovers.",
    organizer: "Lagos Book Club",
    tags: ["Books", "Literature", "Social"],
    ticketPrices: { regular: 0, vip: 0, gold: 0, platinum: 0 }
  },
  {
    id: 20,
    title: "Nigerian Street Food Festival",
    date: "28 Mar, 2026",
    time: "11:00 AM - 8:00 PM",
    location: "Muri Okunola Park, Victoria Island",
    price: "Starts At ₦2,000",
    category: "Food & Drinks",
    img: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&auto=format&fit=crop",
    description: "Celebrate the rich diversity of Nigerian street food at Muri Okunola Park. From suya and akara to puff-puff and bole, taste the authentic flavors that make Nigerian cuisine legendary. Live music, cultural performances, and cooking competitions round out this delicious family-friendly festival.",
    organizer: "Lagos Food Alliance",
    tags: ["Street Food", "Festival", "Culture"],
    ticketPrices: { regular: 2000, vip: 8000, gold: 30000, platinum: 100000 }
  },
  {
    id: 21,
    title: "Apostle Bolaji Idowu Power Encounter",
    date: "31 Mar, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Lekki Coliseum, Lagos",
    price: "Starts At ₦8,000",
    category: "Religious Events",
    img: "https://alphaleadershipconference.net/wp-content/uploads/2023/06/bolaji-idowu.png",
    description: "Experience a powerful encounter with Apostle Bolaji Idowu as he shares transformative spiritual insights and revelations. This exclusive gathering features inspiring messages, prophetic ministry, and supernatural encounters that will transform your spiritual walk. Join believers from across Lagos for a day of divine empowerment and spiritual awakening.",
    organizer: "Apostle Bolaji Idowu Ministries",
    tags: ["Christian", "Spiritual", "Empowerment"],
    ticketPrices: { regular: 8000, vip: 25000, gold: 100000, platinum: 300000 }
  },
  {
    id: 22,
    title: "Koinonia",
    date: "04 Apr, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Eko Hotel & Suites, Victoria Island",
    price: "Starts At ₦12,000",
    category: "Religious Events",
    img: "https://cdn.vanguardngr.com/wp-content/uploads/2025/08/Selma-.jpeg",
    description: "Be part of Koinonia, a powerful gathering of believers for intimate fellowship, worship, and spiritual communion. Led by Apostle Selman, this sacred gathering creates space for deep connection with God and brothers and sisters in faith. Experience authentic worship, prophetic ministry, and the presence of the Holy Spirit in this transformative gathering.",
    organizer: "Apostle Selman Ministries",
    tags: ["Christian", "Fellowship", "Worship"],
    ticketPrices: { regular: 12000, vip: 35000, gold: 150000, platinum: 500000 }
  },
  {
    id: 23,
    title: "Nasfat Gathering",
    date: "07 Apr, 2026",
    time: "3:00 PM - 8:00 PM",
    location: "Central Mosque, Lagos Island",
    price: "Free",
    category: "Religious Events",
    img: "https://nasfatcounseling.org/wp-content/uploads/2024/08/nasfat-avatar.jpg",
    description: "Join the Nasfat community in this blessed gathering for Quranic recitation, Islamic lectures, and spiritual enlightenment. This inclusive event brings together Muslims of all backgrounds to deepen their faith, learn from Islamic scholars, and strengthen community bonds. Experience meaningful discourse on Islamic teachings, Quranic wisdom, and practical spirituality in today's world.",
    organizer: "Nasfat Community",
    tags: ["Islam", "Community", "Spiritual"],
    ticketPrices: { regular: 0, vip: 0, gold: 0, platinum: 0 }
  }
];

export const EVENT_CATEGORIES = [
  { icon: 'Briefcase', label: 'Business' },
  { icon: 'Gamepad2', label: 'Gaming' },
  { icon: 'Activity', label: 'Health & Wellness' },
  { icon: 'CalendarDays', label: 'Festivals' },
  { icon: 'Music', label: 'Music' },
  { icon: 'UtensilsCrossed', label: 'Food & Drinks' },
  { icon: 'Code2', label: 'Hackathons' },
  { icon: 'Globe', label: 'Virtual Events' },
  { icon: 'Shirt', label: 'Fashion Show' },
  { icon: 'Theater', label: 'Comedy' },
  { icon: 'Trophy', label: 'Sports' },
  { icon: 'Presentation', label: 'Webinar' },
  { icon: 'Heart', label: 'Religious Events' },
  { icon: 'MoreHorizontal', label: 'Other Categories' },
];
