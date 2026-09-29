import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  // 1. Laptops
  {
    id: "lap-1",
    name: "Acer Swift Go 14 OLED",
    brand: "Acer",
    category: "Laptops",
    price: 57990,
    originalPrice: 69999,
    discount: 17,
    rating: 4.7,
    reviewCount: 940,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
    ],
    description: "The ideal coding laptop under ₹60,000 featuring a gorgeous 2.8K 90Hz OLED display, Intel Core i5 13th Gen CPU, and 16GB LPDDR5 RAM for multitasking, containers, and VS Code.",
    specifications: {
      "Processor": "Intel Core i5-13500H (12 Cores, 16 Threads)",
      "RAM": "16GB LPDDR5 Dual-Channel",
      "Storage": "512GB PCIe Gen4 NVMe SSD",
      "Display": "14-inch 2.8K (2880x1800) OLED 90Hz 100% DCI-P3",
      "Battery": "65Wh (Up to 10.5 Hours)",
      "Weight": "1.25 kg",
      "OS": "Windows 11 Home + MS Office 2021"
    },
    features: [
      "2.8K OLED vibrant high-refresh display",
      "Fast 100W USB-C PD Charging",
      "Full HD 1440p AI Webcam with temporal noise reduction",
      "TwinAir cooling with dual copper heat pipes"
    ],
    availability: "in-stock",
    tags: ["laptop", "coding", "under-60000", "oled", "lightweight", "intel", "acer"],
    matchScore: 98,
    aiPros: [
      "Unbeatable 2.8K OLED screen for this price bracket",
      "16GB RAM handles Docker and modern development IDEs easily",
      "Ultra-portable at just 1.25 kg"
    ],
    aiCons: [
      "Soldered RAM cannot be upgraded later",
      "Glossy screen reflects overhead office lights"
    ]
  },
  {
    id: "lap-2",
    name: "Apple MacBook Air M3 (13.6-inch)",
    brand: "Apple",
    category: "Laptops",
    price: 104990,
    originalPrice: 114900,
    discount: 9,
    rating: 4.9,
    reviewCount: 2310,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
    ],
    description: "Lean, mean M3 machine. Delivers industry-leading 18-hour battery life, fanless silent operation, and breathtaking Liquid Retina display clarity.",
    specifications: {
      "Processor": "Apple M3 chip (8-core CPU, 10-core GPU, 16-core Neural Engine)",
      "RAM": "16GB Unified Memory",
      "Storage": "512GB SSD",
      "Display": "13.6-inch Liquid Retina display with True Tone (500 nits)",
      "Battery": "52.6Wh (Up to 18 Hours video playback)",
      "Weight": "1.24 kg",
      "OS": "macOS Sonoma"
    },
    features: [
      "Completely silent fanless aluminum design",
      "MagSafe 3 charging port with braided cable",
      "Support for up to two external displays with lid closed",
      "Four-speaker sound system with Spatial Audio"
    ],
    availability: "in-stock",
    tags: ["laptop", "apple", "macbook", "battery-life", "coding", "premium", "m3"],
    matchScore: 96,
    aiPros: [
      "Phenomenal 18-hour real world battery endurance",
      "Completely quiet zero-fan design that never throttles on battery",
      "Industry best trackpad and keyboard experience"
    ],
    aiCons: [
      "Premium pricing for unified storage upgrades",
      "External dual monitor requires laptop lid to stay closed"
    ]
  },
  {
    id: "lap-3",
    name: "ASUS Vivobook 15X",
    brand: "ASUS",
    category: "Laptops",
    price: 52990,
    originalPrice: 64990,
    discount: 18,
    rating: 4.5,
    reviewCount: 810,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"],
    description: "A dependable coding and office companion equipped with AMD Ryzen 5 7530U, 16GB expandable memory, and military-grade durability.",
    specifications: {
      "Processor": "AMD Ryzen 5 7530U (6 Cores, 12 Threads)",
      "RAM": "16GB DDR4 (Expandable to 24GB)",
      "Storage": "512GB NVMe SSD",
      "Display": "15.6-inch Full HD Anti-Glare 300 nits",
      "Battery": "50Wh (Up to 8 Hours)",
      "Weight": "1.60 kg",
      "OS": "Windows 11 Home"
    },
    features: [
      "Military-grade MIL-STD 810H durability",
      "Physical privacy shutter on webcam",
      "180-degree lay-flat hinge for easy collaboration"
    ],
    availability: "in-stock",
    tags: ["laptop", "coding", "under-60000", "budget", "amd", "asus"],
    matchScore: 92,
    aiPros: [
      "RAM is expandable for future heavy workflow needs",
      "Solid thermal efficiency with AMD 7000-series chip",
      "Full numeric keypad included"
    ],
    aiCons: [
      "Screen is standard IPS 45% NTSC, not wide-gamut",
      "Slightly heavier than 14-inch options at 1.6kg"
    ]
  },
  {
    id: "lap-4",
    name: "Dell XPS 16 (2026 Edition)",
    brand: "Dell",
    category: "Laptops",
    price: 184990,
    originalPrice: 209990,
    discount: 12,
    rating: 4.8,
    reviewCount: 390,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"],
    description: "Flagship executive powerhouse with Intel Core Ultra 7, NVIDIA RTX 4060, 4K InfinityEdge touchscreen, and haptic glass touchpad.",
    specifications: {
      "Processor": "Intel Core Ultra 7 155H with AI Boost NPU",
      "RAM": "32GB LPDDR5X",
      "Storage": "1TB PCIe 4.0 SSD",
      "Display": "16.3-inch 4K+ (3840x2400) OLED Touch 500 nits",
      "Graphics": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "Battery": "99.5Wh",
      "Weight": "2.13 kg",
      "OS": "Windows 11 Pro"
    },
    features: [
      "CNC machined aluminum and Gorilla Glass 3",
      "Zero-lattice capacitive touch function row",
      "Massive 99.5Wh maximum flight-safe battery"
    ],
    availability: "in-stock",
    tags: ["laptop", "dell", "creator", "coding", "rtx", "workstation", "premium"],
    matchScore: 95,
    aiPros: [
      "Jaw-dropping 4K OLED touch panel",
      "Great AI & GPU compute capabilities with RTX 4060",
      "Futuristic minimalist aesthetic"
    ],
    aiCons: [
      "High price tag",
      "Only USB-C ports, adapter required for legacy USB-A"
    ]
  },

  // 2. Smartphones
  {
    id: "phone-1",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 129999,
    originalPrice: 144999,
    discount: 10,
    rating: 4.9,
    reviewCount: 3120,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"],
    description: "The definitive smartphone for mobile photography and AI productivity with 200MP sensor, 5x optical telephoto, flat titanium frame, and built-in S-Pen.",
    specifications: {
      "Camera": "200MP Main + 50MP Periscope (5x) + 10MP (3x) + 12MP Ultra-Wide",
      "Display": "6.8-inch Dynamic AMOLED 2X 120Hz 2600 nits Gorilla Armor",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "Battery": "5000 mAh with 45W Fast Charging",
      "RAM & Storage": "12GB RAM, 256GB / 512GB UFS 4.0",
      "Durability": "Titanium Frame + IP68 Water Resistance"
    },
    features: [
      "Galaxy AI ProVisual Engine with Generative Photo Edit",
      "Anti-reflective Corning Gorilla Armor glass",
      "Integrated S-Pen stylus for precision notes & remote clicks",
      "7 years of major Android OS and security upgrades"
    ],
    availability: "in-stock",
    tags: ["smartphone", "photography", "camera", "flagship", "samsung", "ai", "s-pen"],
    matchScore: 99,
    aiPros: [
      "Best zoom photography and nightography currently on the market",
      "Gorilla Armor virtually eliminates sunlight reflections",
      "7 years of guaranteed software support"
    ],
    aiCons: [
      "Large and boxy footprint in small pockets",
      "45W charger not included in box"
    ]
  },
  {
    id: "phone-2",
    name: "Apple iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    price: 124900,
    originalPrice: 134900,
    discount: 7,
    rating: 4.9,
    reviewCount: 2840,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80"],
    description: "Forged in Grade 5 aerospace titanium with the ground-breaking A17 Pro chip, custom Action button, and studio-grade 48MP ProRAW photography.",
    specifications: {
      "Camera": "48MP Main with sensor-shift OIS + 12MP 3x Telephoto + 12MP Ultra-Wide",
      "Display": "6.1-inch Super Retina XDR OLED 120Hz ProMotion",
      "Processor": "Apple A17 Pro (3nm)",
      "Battery": "Up to 23 hours video playback, MagSafe wireless",
      "Port": "USB-C (USB 3 10Gbps speeds)",
      "Weight": "187 grams"
    },
    features: [
      "Lightweight Grade 5 Titanium design",
      "ProRes 4K 60fps video capture straight to external SSD",
      "Configurable Action button for instant camera/shortcut access",
      "Console-level gaming with hardware-accelerated ray tracing"
    ],
    availability: "in-stock",
    tags: ["smartphone", "photography", "apple", "iphone", "camera", "titanium", "flagship"],
    matchScore: 97,
    aiPros: [
      "Industry unmatched ProRes video recording quality",
      "Noticeably lighter and more comfortable than previous models",
      "Blazing fast A17 Pro GPU for heavy creative tasks"
    ],
    aiCons: [
      "Base model starts at 128GB storage",
      "Charging speed is capped at 25W"
    ]
  },
  {
    id: "phone-3",
    name: "Google Pixel 8 Pro",
    brand: "Google",
    category: "Smartphones",
    price: 89999,
    originalPrice: 106999,
    discount: 16,
    rating: 4.7,
    reviewCount: 1420,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"],
    description: "Google's AI masterpiece with Best Take, Magic Editor, Night Sight video, and Google Tensor G3 silicon.",
    specifications: {
      "Camera": "50MP Main + 48MP Telephoto (5x) + 48MP Ultra-Wide with Macro",
      "Display": "6.7-inch Super Actua LTPO OLED 120Hz 2400 nits",
      "Processor": "Google Tensor G3 + Titan M2 security",
      "Battery": "5050 mAh with 30W Fast Charging",
      "OS": "Stock Android 14 with 7 years of Pixel drops"
    },
    features: [
      "AI Audio Magic Eraser and Video Boost",
      "Skin temperature sensor on back visor",
      "Ultra-clear computational portraits and skin tone accuracy"
    ],
    availability: "in-stock",
    tags: ["smartphone", "google", "pixel", "camera", "photography", "ai"],
    matchScore: 94,
    aiPros: [
      "Most natural skin tones and computational photography",
      "Pure Google Android experience with immediate updates",
      "High brightness screen easy to view under midday sun"
    ],
    aiCons: [
      "Tensor G3 throttles under prolonged high-end 3D gaming",
      "Fingerprint sensor can be slightly sluggish with thick protectors"
    ]
  },
  {
    id: "phone-4",
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Smartphones",
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    rating: 4.8,
    reviewCount: 1890,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"],
    description: "Unmatched performance per rupee with Snapdragon 8 Gen 3, Hasselblad 4th Gen cameras, and 100W SUPERVOOC charging.",
    specifications: {
      "Processor": "Snapdragon 8 Gen 3",
      "Camera": "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultra-Wide",
      "Display": "6.82-inch 2K 120Hz ProXDR 4500 nits peak brightness",
      "Battery": "5400 mAh with 100W Wired + 50W Wireless Charging"
    },
    features: [
      "100W charger in the box: 0 to 100% in 26 minutes",
      "Hasselblad color calibration for portraits and landscapes",
      "Aqua Touch lets you use screen with wet hands"
    ],
    availability: "in-stock",
    tags: ["smartphone", "oneplus", "fast-charging", "snapdragon", "flagship-killer"],
    matchScore: 93,
    aiPros: [
      "Insanely fast 100W charging with charger bundled",
      "Huge 5400mAh battery easily provides 1.5 to 2 days usage",
      "Gorgeous 4500-nit peak display"
    ],
    aiCons: [
      "IP65 rating is splashproof but not full submersion proof",
      "Curved edges have occasional palm touches"
    ]
  },

  // 3. Headphones
  {
    id: "head-1",
    name: "Sony WH-1000XM5 Wireless ANC",
    brand: "Sony",
    category: "Headphones",
    price: 26990,
    originalPrice: 34990,
    discount: 23,
    rating: 4.8,
    reviewCount: 3820,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    description: "The gold standard in active noise cancellation for office work, flights, and study sessions. Dual processors and 8 microphones eliminate typing and background chatter.",
    specifications: {
      "Noise Cancellation": "Auto NC Optimizer with Integrated Processor V1 + QN1",
      "Battery Life": "30 hours (ANC On), 40 hours (ANC Off)",
      "Charging": "3 minutes charge = 3 hours playback",
      "Weight": "250 grams",
      "Codecs": "LDAC, AAC, SBC"
    },
    features: [
      "Multipoint pairing to effortlessly switch between laptop and phone",
      "Speak-to-Chat automatically pauses music when you talk",
      "Crystal-clear voice calls with 4 beamforming microphones & AI noise reduction"
    ],
    availability: "in-stock",
    tags: ["headphones", "office-work", "anc", "noise-cancelling", "sony", "wireless"],
    matchScore: 98,
    aiPros: [
      "Top-tier background noise isolation for crowded workspaces",
      "Plush headband feels weightless during 8-hour workdays",
      "Exceptional call microphone background separation"
    ],
    aiCons: [
      "Earcups rotate flat but the headband does not fold inward",
      "Touch sensors take an adjustment period"
    ]
  },
  {
    id: "head-2",
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Headphones",
    price: 34900,
    originalPrice: 39900,
    discount: 13,
    rating: 4.8,
    reviewCount: 1670,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"],
    description: "Legendary Bose comfort paired with spatial audio immersion and CustomTune technology that measures your ear acoustics.",
    specifications: {
      "Noise Cancellation": "World-class Bose CustomTune ANC",
      "Battery Life": "24 hours (18 hours with Immersive Audio)",
      "Bluetooth": "5.3 with Snapdragon Sound and aptX Adaptive",
      "Weight": "253 grams"
    },
    features: [
      "Bose Immersive Audio places sound outside your head in 3D space",
      "Foldable hinges make it ultra-compact for business travel",
      "Aware Mode with ActiveSense lets environmental announcements pass naturally"
    ],
    availability: "in-stock",
    tags: ["headphones", "bose", "anc", "travel", "office-work", "spatial-audio"],
    matchScore: 96,
    aiPros: [
      "Unrivaled clamping force and ear cushion comfort",
      "Folds down small for briefcase or bag travel",
      "Natural awareness mode doesn't sound digital"
    ],
    aiCons: [
      "Battery life is 24 hours vs Sony's 30 hours",
      "Bose Music app occasionally takes a moment to reconnect"
    ]
  },
  {
    id: "head-3",
    name: "Apple AirPods Pro (2nd Gen, USB-C)",
    brand: "Apple",
    category: "Headphones",
    price: 21990,
    originalPrice: 24900,
    discount: 12,
    rating: 4.9,
    reviewCount: 5210,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80"],
    description: "Pocket-sized acoustic perfection with H2 chip, Adaptive Audio, Conversation Awareness, and USB-C MagSafe case with Precision Finding.",
    specifications: {
      "Driver": "Apple custom high-excursion driver + amplifier",
      "Battery": "6 hours listening (30 hours with case)",
      "Charging": "USB-C, MagSafe, Apple Watch charger",
      "Resistance": "IP54 dust and sweat resistance"
    },
    features: [
      "Adaptive Audio dynamically blends Transparency and Active Noise Cancellation",
      "Personalized Spatial Audio with dynamic head tracking",
      "Case has built-in speaker for Find My alerts"
    ],
    availability: "in-stock",
    tags: ["headphones", "earbuds", "apple", "airpods", "anc", "usb-c"],
    matchScore: 95,
    aiPros: [
      "Seamless instant switching across Mac, iPhone, and iPad",
      "Incredible transparency mode sounds like you aren't wearing earbuds",
      "Pocket friendly case with lanyard loop and Find My chirp"
    ],
    aiCons: [
      "Best features require Apple ecosystem",
      "Touch stem volume swipe requires gentle pinch"
    ]
  },

  // 4. Smartwatches
  {
    id: "watch-1",
    name: "Noise ColorFit Pro 5",
    brand: "Noise",
    category: "Smartwatches",
    price: 3799,
    originalPrice: 6999,
    discount: 46,
    rating: 4.4,
    reviewCount: 4210,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"],
    description: "The premier smartwatch under ₹5,000 featuring a 1.85-inch AMOLED display, BT calling with TruSync, rapid SOS, and complete health telemetry.",
    specifications: {
      "Display": "1.85-inch AMOLED 1000 nits Always-On",
      "Battery": "Up to 7 days normal use, 2 days with BT calling",
      "Water Resistance": "IP68 water and sweat resistant",
      "Health Sensors": "SpO2, 24/7 Heart Rate, Stress, Sleep Architecture"
    },
    features: [
      "Bluetooth calling with noise-cancelling microphone",
      "100+ Sports tracking modes",
      "Emergency SOS feature and functional rotary crown"
    ],
    availability: "in-stock",
    tags: ["smartwatch", "under-5000", "budget", "noise", "amoled", "calling"],
    matchScore: 97,
    aiPros: [
      "Outstanding value under ₹5,000 with genuine AMOLED panel",
      "Loud and clear speaker for quick wrist phone calls",
      "Lightweight ergonomic zinc alloy build"
    ],
    aiCons: [
      "No standalone GPS; borrows phone's GPS for outdoor mapping",
      "Companion app has occasional promotion banners"
    ]
  },
  {
    id: "watch-2",
    name: "Fire-Boltt Invincible Plus",
    brand: "Fire-Boltt",
    category: "Smartwatches",
    price: 4499,
    originalPrice: 9999,
    discount: 55,
    rating: 4.3,
    reviewCount: 3100,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    description: "Massive feature set under ₹5,000 with 4GB onboard storage for offline MP3 music, TWS earbud pairing, and 1.43-inch 2.5D round AMOLED screen.",
    specifications: {
      "Display": "1.43-inch Round AMOLED 460x460 (600 nits)",
      "Storage": "4GB Internal memory for offline music playback",
      "Battery": "380 mAh (Up to 5 days normal use)",
      "Connectivity": "Bluetooth 5.0 with TWS earphone direct pairing"
    },
    features: [
      "Play music directly to wireless earbuds without bringing your phone",
      "300+ Sports modes with continuous heart rate",
      "Full metallic casing with rotating navigation crown"
    ],
    availability: "in-stock",
    tags: ["smartwatch", "under-5000", "music-storage", "fire-boltt", "amoled"],
    matchScore: 93,
    aiPros: [
      "Internal 4GB memory allows gym workouts without your phone",
      "Sharp circular AMOLED dial with classy watch faces",
      "Solid metallic build quality"
    ],
    aiCons: [
      "Heavier on slender wrists at 65 grams",
      "Step count algorithm can occasionally overcount driving bumps"
    ]
  },
  {
    id: "watch-3",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "Smartwatches",
    price: 89900,
    originalPrice: 89900,
    discount: 0,
    rating: 4.9,
    reviewCount: 1290,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"],
    description: "The ultimate rugged sports watch made of aerospace titanium. Precision dual-frequency GPS, depth gauge, and 3000-nit ultra-bright display.",
    specifications: {
      "Case": "49mm Grade 5 Titanium with raised sapphire crystal",
      "Display": "Always-On Retina 3000 nits peak brightness",
      "Battery": "Up to 36 hours regular, 72 hours in Low Power mode",
      "Sensors": "ECG, Blood Oxygen, Depth gauge with EN13319 dive computer cert"
    },
    features: [
      "86-decibel Emergency Siren audible up to 180 meters",
      "Precision dual-frequency GPS (L1 and L5)",
      "Customizable orange Action button"
    ],
    availability: "in-stock",
    tags: ["smartwatch", "apple", "ultra", "titanium", "gps", "rugged", "premium"],
    matchScore: 94,
    aiPros: [
      "Brightest smartwatch screen in the world (3000 nits)",
      "Medical-grade ECG and diving depth certification",
      "Double Tap gesture lets you answer calls one-handed"
    ],
    aiCons: [
      "Bulky 49mm case requires larger wrists",
      "Exclusive to Apple iPhone users"
    ]
  },

  // 5. Cameras
  {
    id: "cam-1",
    name: "Sony Alpha A7 IV Mirrorless Camera",
    brand: "Sony",
    category: "Cameras",
    price: 219990,
    originalPrice: 242990,
    discount: 9,
    rating: 4.9,
    reviewCount: 680,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"],
    description: "The benchmark full-frame hybrid camera for wedding, wildlife, and commercial video creators with 33MP Exmor R sensor and real-time human/animal eye AF.",
    specifications: {
      "Sensor": "33MP Full-Frame Back-Illuminated Exmor R CMOS",
      "Video": "4K 60p 10-bit 4:2:2 recording, S-Cinetone",
      "Stabilization": "5-Axis Optical in-body image stabilization (5.5 stops)",
      "Autofocus": "759 phase-detection points with AI tracking"
    },
    features: [
      "Breathing compensation with compatible Sony E-mount lenses",
      "Side-opening vari-angle LCD touchscreen for vlogging",
      "Dual card slots (CFexpress Type A and SD UHS-II)"
    ],
    availability: "in-stock",
    tags: ["camera", "photography", "sony", "full-frame", "4k", "mirrorless", "creator"],
    matchScore: 96,
    aiPros: [
      "Unrivaled real-time autofocus accuracy",
      "Gorgeous 10-bit 4:2:2 video with S-Cinetone color profile",
      "Vast Sony E-mount lens selection available"
    ],
    aiCons: [
      "4K 60p video has an APS-C 1.5x crop",
      "Body only; high-quality lenses sold separately"
    ]
  },
  {
    id: "cam-2",
    name: "Fujifilm X-T5 Mirrorless",
    brand: "Fujifilm",
    category: "Cameras",
    price: 154999,
    originalPrice: 169999,
    discount: 9,
    rating: 4.8,
    reviewCount: 520,
    image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&q=80"],
    description: "Dedicated to still photography with 40.2MP X-Trans CMOS 5 HR sensor, classic tactile analog dials, and iconic film simulation color profiles.",
    specifications: {
      "Sensor": "40.2MP X-Trans 5 HR APS-C",
      "Stabilization": "7.0 stops 5-axis in-body image stabilization",
      "Viewfinder": "3.69M-dot 0.8x magnification OLED EVF",
      "Mechanical Shutter": "1/8000s (up to 1/180,000s electronic)"
    },
    features: [
      "Classic film simulations including Nostalgic Neg and Classic Chrome",
      "Three-way tilting LCD monitor",
      "Dual SD UHS-II memory card slots"
    ],
    availability: "in-stock",
    tags: ["camera", "photography", "fujifilm", "film-simulation", "retro"],
    matchScore: 93,
    aiPros: [
      "JPEG output with film simulations looks like analog photography out-of-camera",
      "Tactile physical shutter and ISO dials make shooting pure joy",
      "Compact retro body styling"
    ],
    aiCons: [
      "Screen tilts but doesn't flip out sideways for selfie vlogging",
      "Buffer clears slowly during rapid continuous burst shooting"
    ]
  },

  // 6. Tablets
  {
    id: "tab-1",
    name: "Apple iPad Air M2 (11-inch)",
    brand: "Apple",
    category: "Tablets",
    price: 59900,
    originalPrice: 59900,
    discount: 0,
    rating: 4.8,
    reviewCount: 1180,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"],
    description: "Supercharged by Apple M2. Liquid Retina display, landscape stereo speakers, support for Apple Pencil Pro with haptic squeeze, and Magic Keyboard.",
    specifications: {
      "Processor": "Apple M2 (8-core CPU, 9-core GPU)",
      "Display": "11-inch Liquid Retina with P3 wide color and True Tone",
      "Storage": "128GB / 256GB / 512GB",
      "Camera": "Landscape 12MP Ultra Wide with Center Stage"
    },
    features: [
      "Compatible with Apple Pencil Pro and Apple Pencil (USB-C)",
      "Landscape oriented camera for natural video calls",
      "All-day 10-hour battery life"
    ],
    availability: "in-stock",
    tags: ["tablet", "apple", "ipad", "m2", "stylus", "creativity"],
    matchScore: 95,
    aiPros: [
      "M2 performance is blazing fast for video editing and digital art",
      "Apple Pencil Pro squeeze gestures feel intuitive",
      "Super light at 462 grams"
    ],
    aiCons: [
      "Screen is 60Hz, not 120Hz ProMotion",
      "Pencil Pro and Magic Keyboard are separate purchases"
    ]
  },
  {
    id: "tab-2",
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    category: "Tablets",
    price: 108999,
    originalPrice: 121999,
    discount: 11,
    rating: 4.7,
    reviewCount: 740,
    image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80"],
    description: "Massive 14.6-inch Dynamic AMOLED 2X canvas with IP68 water resistance, Snapdragon 8 Gen 2, and S-Pen included inside the retail box.",
    specifications: {
      "Display": "14.6-inch Dynamic AMOLED 2X 120Hz HDR10+",
      "Processor": "Snapdragon 8 Gen 2 for Galaxy",
      "Battery": "11,200 mAh with 45W fast charge",
      "Stylus": "IP68 S-Pen included in box"
    },
    features: [
      "Samsung DeX creates a full multi-window desktop workstation",
      "Quad AKG speakers with Dolby Atmos surround sound",
      "Waterproof tablet and S-Pen design"
    ],
    availability: "in-stock",
    tags: ["tablet", "samsung", "amoled", "s-pen", "dex", "large-screen"],
    matchScore: 92,
    aiPros: [
      "Enormous gorgeous AMOLED panel for media and split-screen multitasking",
      "S-Pen included free inside box",
      "Samsung DeX turns it into an Android laptop alternative"
    ],
    aiCons: [
      "14.6-inch is huge for reading in bed with one hand",
      "Android tablet apps still trail iPadOS in niche pro audio tools"
    ]
  },

  // 7. Monitors
  {
    id: "mon-1",
    name: "LG UltraFine 27\" 4K IPS Monitor",
    brand: "LG",
    category: "Monitors",
    price: 28990,
    originalPrice: 38000,
    discount: 24,
    rating: 4.7,
    reviewCount: 920,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"],
    description: "Crisp 4K UHD (3840x2160) IPS panel designed for programmers and creative designers. USB-C 65W one-cable laptop charging.",
    specifications: {
      "Screen Size": "27-inch 4K UHD (3840 x 2160)",
      "Color Accuracy": "DCI-P3 95%, HDR10",
      "Connectivity": "USB-C (65W PD), 2x HDMI 2.0, 1x DisplayPort 1.4, 2x USB 3.0",
      "Stand": "Height, Pivot & Tilt adjustable ergonomic stand"
    },
    features: [
      "Single USB-C cable transmits video, data and 65W laptop power",
      "Hardware calibration support with LG Calibration Studio",
      "Anti-glare matte coating reduces office eye strain"
    ],
    availability: "in-stock",
    tags: ["monitor", "4k", "coding", "usb-c", "ips", "lg", "office"],
    matchScore: 95,
    aiPros: [
      "Pin-sharp text rendering makes long coding sessions easy on the eyes",
      "USB-C 65W charging cleans up desktop cable clutter",
      "Fully adjustable ergonomic stand with 90-degree vertical pivot"
    ],
    aiCons: [
      "60Hz refresh rate (not built for competitive fast twitch FPS gaming)",
      "Built-in 5W speakers are mediocre for music"
    ]
  },
  {
    id: "mon-2",
    name: "Samsung Odyssey G7 32\" Curved Gaming",
    brand: "Samsung",
    category: "Monitors",
    price: 44990,
    originalPrice: 59900,
    discount: 25,
    rating: 4.6,
    reviewCount: 650,
    image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80"],
    description: "Deep 1000R curvature matching human eye field of view with QLED Quantum Dot colors, 240Hz refresh rate, and 1ms GtG response time.",
    specifications: {
      "Display": "32-inch QLED WQHD (2560x1440) 1000R Curve",
      "Refresh Rate": "240Hz with 1ms GtG response",
      "Sync": "NVIDIA G-Sync compatible & AMD FreeSync Premium Pro",
      "HDR": "VESA DisplayHDR 600"
    },
    features: [
      "Futuristic CoreSync rear RGB ambient lighting",
      "Quantum Dot technology produces 125% sRGB coverage",
      "Black Equalizer highlights enemies hiding in dark shadow corners"
    ],
    availability: "in-stock",
    tags: ["monitor", "gaming", "240hz", "curved", "samsung", "qled"],
    matchScore: 92,
    aiPros: [
      "Ultra-fluid 240Hz refresh rate with zero motion blur",
      "Deep 1000R curve provides cinematic peripheral immersion",
      "Superb contrast ratio with deep blacks"
    ],
    aiCons: [
      "Aggressive 1000R curve takes getting used to for spreadsheet work",
      "Deep tripod stand takes up substantial desk space"
    ]
  },

  // 8. Gaming
  {
    id: "gam-1",
    name: "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
    brand: "Keychron",
    category: "Gaming",
    price: 18990,
    originalPrice: 22990,
    discount: 17,
    rating: 4.9,
    reviewCount: 1140,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"],
    description: "All-metal CNC aluminum 75% mechanical keyboard with double-gasket acoustic mounting, hot-swappable switches, and Bluetooth 5.1 / QMK VIA programmable keys.",
    specifications: {
      "Body": "Full 6063 CNC Machined Aluminum",
      "Switches": "Keychron K Pro Red (Lubed, Linear)",
      "Connectivity": "Bluetooth 5.1 (3 Devices) + Type-C Wired (1000Hz polling)",
      "Battery": "4000 mAh (Up to 300 hours with backlights off)"
    },
    features: [
      "Double-gasket acoustic foam design for deep 'thocky' typing acoustics",
      "Fully remappable keys and custom macros via open-source QMK/VIA web app",
      "Precision CNC rotary knob for instant volume & zoom scrubbing"
    ],
    availability: "in-stock",
    tags: ["gaming", "keyboard", "mechanical", "keychron", "coding", "custom"],
    matchScore: 96,
    aiPros: [
      "Deepest, most satisfying acoustic keystroke sound in its category",
      "Heavy aluminum brick (1.7kg) never shifts on desk during intense typing",
      "Instant Mac and Windows layout toggle switch"
    ],
    aiCons: [
      "Heavy to carry in laptop bags; strictly a desktop keyboard",
      "South-facing RGB shines between keys rather than through key legends"
    ]
  },
  {
    id: "gam-2",
    name: "Sony PlayStation 5 Slim Console",
    brand: "Sony",
    category: "Gaming",
    price: 54990,
    originalPrice: 54990,
    discount: 0,
    rating: 4.9,
    reviewCount: 4890,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"],
    description: "Next-generation gaming console with ultra-high speed 1TB SSD, Ray Tracing, 4K 120Hz support, and DualSense haptic feedback.",
    specifications: {
      "CPU": "x86-64-AMD Ryzen Zen 2, 8 Cores / 16 Threads at 3.5GHz",
      "GPU": "AMD Radeon RDNA 2-based graphics engine (10.3 TFLOPS)",
      "Storage": "1TB Custom Ultra-High Speed NVMe SSD",
      "Audio": "Tempest 3D AudioTech"
    },
    features: [
      "Haptic feedback and adaptive triggers on DualSense controller",
      "Near-instant game load speeds with raw 5.5GB/s I/O throughput",
      "Slimmer chassis with attachable Ultra HD Blu-ray disc drive"
    ],
    availability: "in-stock",
    tags: ["gaming", "console", "ps5", "playstation", "sony", "4k"],
    matchScore: 95,
    aiPros: [
      "Industry best haptic feedback and adaptive trigger immersion",
      "Stellar library of exclusive titles (Spider-Man, God of War, Horizon)",
      "Now comes with upgraded 1TB standard storage"
    ],
    aiCons: [
      "Vertical stand is now sold as a separate accessory",
      "4K 120Hz requires a modern HDMI 2.1 TV"
    ]
  },

  // 9. Home Appliances
  {
    id: "app-1",
    name: "Ecovacs Deebot T20 Omni Robot Vacuum & Mop",
    brand: "Ecovacs",
    category: "Home Appliances",
    price: 69900,
    originalPrice: 119900,
    discount: 42,
    rating: 4.6,
    reviewCount: 430,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80"],
    description: "Fully autonomous cleaning station that washes mops in 55°C hot water, empties dust into sealed antibacterial bags, and lifts mops 9mm over rugs.",
    specifications: {
      "Suction Power": "6000 Pa Deep Clean Suction",
      "Mopping": "OZMO Turbo 2.0 dual spinning pressurized mops",
      "Station": "Hot Water Mop Wash + Auto Emptying + Hot Air Drying",
      "Navigation": "TrueDetect 3D 3.0 structured light obstacle avoidance"
    },
    features: [
      "55°C Hot water mop washing dissolves kitchen oil and dirt",
      "Auto mop lifting prevents dirtying clean carpets",
      "YIKO Voice assistant with room-level localized voice control"
    ],
    availability: "in-stock",
    tags: ["home-appliances", "robot-vacuum", "smart-home", "cleaning", "automation"],
    matchScore: 92,
    aiPros: [
      "Virtually hands-free floor maintenance for 60+ days",
      "Hot water mop wash prevents sour mildew smell",
      "Avoids phone cables, shoes and toys with 3D optical cameras"
    ],
    aiCons: [
      "Omni dock station requires dedicated floor area",
      "Dirty water tank needs refilling and emptying once or twice a week"
    ]
  },
  {
    id: "app-2",
    name: "Dyson Purifier Hot+Cool Gen1",
    brand: "Dyson",
    category: "Home Appliances",
    price: 46900,
    originalPrice: 56900,
    discount: 18,
    rating: 4.7,
    reviewCount: 880,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80"],
    description: "Tri-function air purifier that automatically senses pollution, captures 99.95% of ultrafine PM0.1 particles, heats rooms in winter, and cools with high-velocity airflow.",
    specifications: {
      "Filtration": "HEPA H13 sealed standard + Activated Carbon filter",
      "Airflow": "290 liters per second with Air Multiplier tech",
      "Oscillation": "Adjustable up to 350 degrees",
      "Sensors": "Real-time PM2.5, PM10, temperature and humidity sensors"
    },
    features: [
      "Fully sealed to HEPA H13: what goes inside stays inside",
      "Safe ceramic heating elements with auto shut-off if knocked over",
      "Curved magnetic remote stores neatly on top of the machine"
    ],
    availability: "in-stock",
    tags: ["home-appliances", "air-purifier", "dyson", "heater", "smart-home"],
    matchScore: 93,
    aiPros: [
      "Combines whole-room air purifier and winter space heater in one footprint",
      "Real-time LCD display shows live indoor air quality",
      "Bladeless safe design around young kids and pets"
    ],
    aiCons: [
      "Replacement HEPA filters are proprietary",
      "Higher fan speeds produce audible air rush noise"
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export const MOCK_PRODUCTS = PRODUCTS;
