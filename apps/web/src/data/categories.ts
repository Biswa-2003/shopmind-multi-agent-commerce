export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  slug: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-smartphones",
    name: "Smartphones",
    description: "Flagships, camera phones & 5G performers",
    itemCount: 4,
    slug: "smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  },
  {
    id: "cat-laptops",
    name: "Laptops",
    description: "Coding powerhouses, ultrabooks & MacBooks",
    itemCount: 4,
    slug: "laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  },
  {
    id: "cat-headphones",
    name: "Headphones",
    description: "ANC noise-cancelling, studio & wireless",
    itemCount: 3,
    slug: "headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  },
  {
    id: "cat-smartwatches",
    name: "Smartwatches",
    description: "ECG, fitness tracking, GPS & battery kings",
    itemCount: 3,
    slug: "smartwatches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: "cat-cameras",
    name: "Cameras",
    description: "Full-frame mirrorless & 4K creator kits",
    itemCount: 2,
    slug: "cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  },
  {
    id: "cat-tablets",
    name: "Tablets",
    description: "OLED stylus pads & digital sketchbooks",
    itemCount: 2,
    slug: "tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  },
  {
    id: "cat-monitors",
    name: "Monitors",
    description: "4K IPS color-accurate & curved gaming",
    itemCount: 2,
    slug: "monitors",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  },
  {
    id: "cat-gaming",
    name: "Gaming",
    description: "Mechanical keyboards, mice & consoles",
    itemCount: 2,
    slug: "gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",
  },
  {
    id: "cat-appliances",
    name: "Home Appliances",
    description: "Smart robotic vacuums & air purifiers",
    itemCount: 2,
    slug: "home-appliances",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  },
];
