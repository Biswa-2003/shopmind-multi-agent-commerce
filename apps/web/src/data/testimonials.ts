export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
  productMentioned: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Rohan Verma",
    role: "Full-Stack Software Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    comment: "I asked ShopMind AI for a laptop under ₹60,000 for Docker & React development. It suggested the Acer Swift Go 14 with 16GB RAM. Ordered it immediately and it runs my dev environment flawlessly!",
    rating: 5,
    productMentioned: "Acer Swift Go 14 OLED",
  },
  {
    id: "test-2",
    name: "Priya Sharma",
    role: "Travel Content Creator",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
    comment: "The comparison tool saved me hours. Comparing Samsung Galaxy S24 Ultra vs iPhone 15 Pro highlighted camera low-light differences clearly. The best shopping assistant I have ever used.",
    rating: 5,
    productMentioned: "Samsung Galaxy S24 Ultra",
  },
  {
    id: "test-3",
    name: "Arjun Nair",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    comment: "Natural language questions like 'Which smartwatch has ECG and lasts 10 days?' worked instantly. Got the Amazfit Balance and the battery actually lasts two full weeks.",
    rating: 5,
    productMentioned: "Amazfit Balance Titanium",
  },
];
