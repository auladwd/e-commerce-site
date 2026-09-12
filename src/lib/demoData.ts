export interface ProductItem {
  id: string;
  _id?: string;
  title: string;
  titleBn: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  descriptionBn: string;
  category: string;
  categoryBn: string;
  images: {
    url: string;
    public_id?: string;
  }[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isFlashDeal: boolean;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  image: string;
  icon?: string;
}

export const demoCategories: CategoryItem[] = [
  {
    id: "gadgets",
    name: "Smart Gadgets",
    nameBn: "স্মার্ট গ্যাজেট",
    slug: "gadgets",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
    icon: "Watch",
  },
  {
    id: "fashion-men",
    name: "Men's Fashion",
    nameBn: "পুরুষদের ফ্যাশন",
    slug: "fashion-men",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&q=80",
    icon: "Shirt",
  },
  {
    id: "fashion-women",
    name: "Women's Collection",
    nameBn: "মহিলাদের কালেকশন",
    slug: "fashion-women",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    icon: "Sparkles",
  },
  {
    id: "organic-food",
    name: "Organic & Grocery",
    nameBn: "অর্গানিক ও খাঁটি খাবার",
    slug: "organic-food",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80",
    icon: "Apple",
  },
  {
    id: "home-living",
    name: "Home & Living",
    nameBn: "হোম ও লিভিং",
    slug: "home-living",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80",
    icon: "Home",
  },
];

export const demoProducts: ProductItem[] = [
  {
    id: "p1",
    _id: "p1",
    title: "T900 Ultra Smartwatch with Bluetooth Calling & Heart Rate",
    titleBn: "টি৯০০ আল্ট্রা স্মার্টওয়াচ - ব্লুটুথ কলিং ও হার্ট রেট সেন্সর সহ",
    slug: "t900-ultra-smartwatch",
    price: 2450,
    salePrice: 1650,
    description: "Experience premium styling with wireless charging, IPS large display, step counter, calling feature, and long battery life.",
    descriptionBn: "প্রিমিয়াম মেটালিক বডি, স্পষ্ট এইচডি ডিসপ্লে, ব্লুটুথ কলিং, ওয়্যারলেস চার্জিং এবং দীর্ঘ ব্যাটারি ব্যাকআপ সহ আকর্ষণীয় স্মার্টওয়াচ।",
    category: "gadgets",
    categoryBn: "স্মার্ট গ্যাজেট",
    images: [
      { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80" },
    ],
    stock: 45,
    rating: 4.8,
    numReviews: 84,
    isFeatured: true,
    isFlashDeal: true,
    colors: ["Black", "Orange", "Silver"],
    tags: ["smartwatch", "gadgets", "trending"],
  },
  {
    id: "p2",
    _id: "p2",
    title: "ANC Pro Wireless Bluetooth Earbuds with Deep Bass",
    titleBn: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন ওয়্যারলেস ব্লুটুথ ইয়ারবাডস",
    slug: "anc-pro-wireless-earbuds",
    price: 1850,
    salePrice: 1250,
    description: "Crystal clear sound with Active Noise Cancellation, touch controls, IPX5 water resistance, and 30-hour battery life with case.",
    descriptionBn: "অরিজিনাল ডিপ বাস সাউন্ড, নয়েজ ক্যান্সেলেশন, টাচ কন্ট্রোল এবং ওয়াটারপ্রুফ সুবিধা সহ একটানা দীর্ঘক্ষণ শোনার সেরা ইয়ারবাডস।",
    category: "gadgets",
    categoryBn: "স্মার্ট গ্যাজেট",
    images: [
      { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80" },
    ],
    stock: 60,
    rating: 4.9,
    numReviews: 142,
    isFeatured: true,
    isFlashDeal: true,
    colors: ["White", "Midnight Black"],
    tags: ["earbuds", "audio", "sale"],
  },
  {
    id: "p3",
    _id: "p3",
    title: "Premium Embroidered Cotton Semi-Long Panjabi for Men",
    titleBn: "প্রিমিয়াম সুতি সেমি-লং পাঞ্জাবি - আকর্ষণীয় এমব্রয়ডারি ডিজাইন",
    slug: "premium-cotton-panjabi",
    price: 2200,
    salePrice: 1550,
    description: "Crafted from 100% pure combed cotton for ultimate comfort, elegant neckline embroidery, tailored fit suitable for festivals and occasions.",
    descriptionBn: "১০০% পিওর কটন ফেব্রিক, চমৎকার গলার কাজ এবং আরামদায়ক ফিটিং। যেকোনো উৎসব বা অনুষ্ঠানে পরার জন্য অত্যন্ত প্রিমিয়াম।",
    category: "fashion-men",
    categoryBn: "পুরুষদের ফ্যাশন",
    images: [
      { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80" },
    ],
    stock: 28,
    rating: 4.7,
    numReviews: 56,
    isFeatured: true,
    isFlashDeal: false,
    sizes: ["M (40)", "L (42)", "XL (44)", "XXL (46)"],
    colors: ["Navy Blue", "Olive Green", "White"],
    tags: ["panjabi", "eid", "fashion"],
  },
  {
    id: "p4",
    _id: "p4",
    title: "Handloom Traditional Pure Dhakai Jamdani Saree",
    titleBn: "হাতে বোনা ট্র্যাডিশনাল পিওর ঢাকাই জামদানি শাড়ি",
    slug: "traditional-dhakai-jamdani-saree",
    price: 4500,
    salePrice: 3200,
    description: "Authentic handloom Jamdani saree with fine artistic motifs, breathable fabric, and unmatched grace for special ceremonies.",
    descriptionBn: "খাঁটি তাঁতের কাজের গর্জিয়াস ঢাকাই জামদানি শাড়ি। সুক্ষ্ম সুতার নকশা এবং রয়াল লুক যা বিশেষ অনুষ্ঠানে আপনাকে করবে অনন্য।",
    category: "fashion-women",
    categoryBn: "মহিলাদের কালেকশন",
    images: [
      { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80" },
    ],
    stock: 15,
    rating: 5.0,
    numReviews: 38,
    isFeatured: true,
    isFlashDeal: true,
    colors: ["Crimson Red", "Royal Blue", "Golden Beige"],
    tags: ["saree", "jamdani", "traditional"],
  },
  {
    id: "p5",
    _id: "p5",
    title: "100% Pure Natural Sundarban Honey (500gm Glass Jar)",
    titleBn: "১০০% খাঁটি প্রাকৃতিক সুন্দরবনের খলিশা ফুলের মধু (৫০০ গ্রাম)",
    slug: "pure-sundarban-honey",
    price: 950,
    salePrice: 750,
    description: "Raw, unprocessed natural wild bee honey collected directly from Sundarbans. Packed with natural enzymes and medicinal properties.",
    descriptionBn: "সুন্দরবনের সরাসরি মৌয়ালদের থেকে সংগৃহীত কোনো প্রকার ভেজালহীন খাঁটি প্রাকৃতিক মধু। রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে অত্যন্ত কার্যকর।",
    category: "organic-food",
    categoryBn: "অর্গানিক ও খাঁটি খাবার",
    images: [
      { url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80" },
    ],
    stock: 80,
    rating: 4.9,
    numReviews: 210,
    isFeatured: true,
    isFlashDeal: false,
    tags: ["honey", "organic", "pure"],
  },
  {
    id: "p6",
    _id: "p6",
    title: "Rechargeable 6-Blade Portable Smoothie Blender (USB-C)",
    titleBn: "রিচার্জেবল ৬-ব্লেড পোর্টেবল জুসার ও স্মুদি ব্লেন্ডার",
    slug: "rechargeable-portable-blender",
    price: 1600,
    salePrice: 1150,
    description: "Blend fresh fruit juice anywhere with powerful stainless steel blades, rechargeable lithium battery, and portable travel bottle lid.",
    descriptionBn: "অফিস, ট্রাভেল বা বাসায় যেকোনো ফলের জুস তৈরি করুন চোখের পলকে। পাওয়ারফুল ৬টি স্টেইনলেস ব্লেড এবং দ্রুত ইউএসবি চার্জিং সুবিধা।",
    category: "home-living",
    categoryBn: "হোম ও লিভিং",
    images: [
      { url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80" },
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 95,
    isFeatured: true,
    isFlashDeal: true,
    colors: ["Pink", "Cyan Blue", "White"],
    tags: ["blender", "kitchen", "gadget"],
  },
];
