import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Send, Quote } from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useLocalStorage';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

// Mock data for hero slides
const heroSlides = [
  {
    id: 1,
    title: 'Discover Your Signature Scent',
    subtitle: 'Explore our luxury collection of premium perfumes',
    video: '/videos/asad.mp4',
    cta: 'Shop Now',
    link: '/shop',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh fragrances for the modern individual',
    video: '/videos/euphoria.mp4',
    cta: 'Explore Collection',
    link: '/shop?filter=new',
  },
  {
    id: 3,
    title: 'Limited Edition',
    subtitle: 'Exclusive scents you won\'t find anywhere',
    video: '/videos/khamrah.mp4',
    cta: 'View Collection',
    link: '/shop?filter=limited',
  },
];

// Categories data
const categories = [
  {
    id: 'men',
    name: "Men's Fragrances",
    description: 'Bold and sophisticated scents',
    tagline: 'Confidence in Every Note',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800',
    icon: '♂',
    link: '/shop?category=men',
  },
  {
    id: 'women',
    name: "Women's Fragrances",
    description: 'Elegant and enchanting perfumes',
    tagline: 'Elegance Captured in Essence',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800',
    icon: '♀',
    link: '/shop?category=women',
  },
  {
    id: 'unisex',
    name: 'Unisex Fragrances',
    description: 'Versatile scents for everyone',
    tagline: 'Beyond Boundaries',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',
    icon: '◈',
    link: '/shop?category=unisex',
  },
];

// Mock featured products
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Velvet Rose',
    brand: 'Tom Ford',
    price: 285,
    discount: 15,
    rating: 4.8,
    reviewCount: 234,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
    description: 'A luxurious blend of rose and velvet',
    category: 'women',
    inStock: true,
    stock: 45,
    featured: true,
    sizes: [
      { size: '50ml', price: 285, stock: 25 },
      { size: '100ml', price: 385, stock: 20 }
    ],
    createdAt: new Date('2024-01-15'),
    fragrance: {
      topNotes: ['Rose', 'Bergamot'],
      middleNotes: ['Jasmine', 'Violet'],
      baseNotes: ['Musk', 'Vanilla'],
    },
  },
  {
    id: '2',
    name: 'Oud Noir',
    brand: 'Versace',
    price: 320,
    discount: 20,
    rating: 4.9,
    reviewCount: 189,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400'],
    description: 'Deep and mysterious oud fragrance',
    category: 'men',
    inStock: true,
    stock: 32,
    featured: true,
    sizes: [
      { size: '50ml', price: 320, stock: 18 },
      { size: '100ml', price: 420, stock: 14 }
    ],
    createdAt: new Date('2024-01-20'),
    fragrance: {
      topNotes: ['Oud', 'Saffron'],
      middleNotes: ['Leather', 'Amber'],
      baseNotes: ['Sandalwood', 'Patchouli'],
    },
  },
  {
    id: '3',
    name: 'Citrus Bloom',
    brand: 'Chanel',
    price: 245,
    rating: 4.7,
    reviewCount: 312,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
    description: 'Fresh and vibrant citrus notes',
    category: 'unisex',
    inStock: true,
    stock: 67,
    featured: true,
    sizes: [
      { size: '30ml', price: 245, stock: 25 },
      { size: '50ml', price: 295, stock: 22 },
      { size: '100ml', price: 345, stock: 20 }
    ],
    createdAt: new Date('2024-01-10'),
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      middleNotes: ['Neroli', 'Petitgrain'],
      baseNotes: ['Cedar', 'White Musk'],
    },
  },
  {
    id: '4',
    name: 'Midnight Oud',
    brand: 'Dior',
    price: 380,
    discount: 10,
    rating: 5.0,
    reviewCount: 156,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'],
    description: 'Intense and captivating evening scent',
    category: 'unisex',
    inStock: true,
    stock: 23,
    featured: true,
    sizes: [
      { size: '50ml', price: 380, stock: 12 },
      { size: '100ml', price: 480, stock: 11 }
    ],
    createdAt: new Date('2024-01-25'),
    fragrance: {
      topNotes: ['Bergamot', 'Pink Pepper'],
      middleNotes: ['Oud', 'Rose'],
      baseNotes: ['Amber', 'Incense'],
    },
  },
];

// Best sellers for 3D carousel
const bestSellers: Product[] = [
  {
    id: '5',
    name: 'Amber Mystique',
    brand: 'Gucci',
    price: 295,
    rating: 4.9,
    reviewCount: 445,
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400'],
    description: 'Warm amber with exotic spices',
    category: 'women',
    inStock: true,
    stock: 89,
    sizes: [
      { size: '50ml', price: 295, stock: 45 },
      { size: '100ml', price: 395, stock: 44 }
    ],
    createdAt: new Date('2024-01-12'),
    fragrance: {
      topNotes: ['Amber', 'Cinnamon'],
      middleNotes: ['Orchid', 'Honey'],
      baseNotes: ['Vanilla', 'Tonka Bean'],
    },
  },
  {
    id: '6',
    name: 'Ocean Blue',
    brand: 'Armani',
    price: 210,
    rating: 4.6,
    reviewCount: 523,
    images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400'],
    description: 'Fresh aquatic fragrance',
    category: 'men',
    inStock: true,
    stock: 134,
    sizes: [
      { size: '50ml', price: 210, stock: 50 },
      { size: '75ml', price: 260, stock: 44 },
      { size: '100ml', price: 310, stock: 40 }
    ],
    createdAt: new Date('2024-01-08'),
    fragrance: {
      topNotes: ['Sea Notes', 'Mint'],
      middleNotes: ['Lavender', 'Sage'],
      baseNotes: ['Driftwood', 'Musk'],
    },
  },
  {
    id: '7',
    name: 'Golden Saffron',
    brand: 'Prada',
    price: 340,
    discount: 15,
    rating: 4.8,
    reviewCount: 267,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
    description: 'Luxurious saffron and gold accord',
    category: 'unisex',
    inStock: true,
    stock: 56,
    sizes: [
      { size: '50ml', price: 340, stock: 28 },
      { size: '100ml', price: 440, stock: 28 }
    ],
    createdAt: new Date('2024-01-18'),
    fragrance: {
      topNotes: ['Saffron', 'Cardamom'],
      middleNotes: ['Rose', 'Jasmine'],
      baseNotes: ['Amber', 'Oud'],
    },
  },
  {
    id: '8',
    name: 'Velvet Night',
    brand: 'Yves Saint Laurent',
    price: 275,
    rating: 4.7,
    reviewCount: 389,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400'],
    description: 'Sensual evening fragrance',
    category: 'women',
    inStock: true,
    stock: 72,
    sizes: [
      { size: '30ml', price: 275, stock: 25 },
      { size: '50ml', price: 325, stock: 24 },
      { size: '100ml', price: 375, stock: 23 }
    ],
    createdAt: new Date('2024-01-22'),
    fragrance: {
      topNotes: ['Blackberry', 'Plum'],
      middleNotes: ['Iris', 'Violet'],
      baseNotes: ['Vanilla', 'Patchouli'],
    },
  },
  {
    id: '9',
    name: 'Leather & Wood',
    brand: 'Tom Ford',
    price: 365,
    rating: 5.0,
    reviewCount: 198,
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
    description: 'Bold leather and wood composition',
    category: 'men',
    inStock: true,
    stock: 41,
    sizes: [
      { size: '50ml', price: 365, stock: 21 },
      { size: '100ml', price: 465, stock: 20 }
    ],
    createdAt: new Date('2024-01-28'),
    fragrance: {
      topNotes: ['Leather', 'Black Pepper'],
      middleNotes: ['Cedarwood', 'Tobacco'],
      baseNotes: ['Vetiver', 'Amber'],
    },
  },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Absolutely love the quality and selection! Fast shipping and beautiful packaging.',
    product: 'Velvet Rose',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Best online perfume store! Authentic products and amazing customer service.',
    product: 'Oud Noir',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    comment: 'Found my signature scent here. The recommendations were spot on!',
    product: 'Citrus Bloom',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3D Card Stack state
  const [currentBestSeller, setCurrentBestSeller] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Touch handling for mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Category hover state
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate card stack
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentBestSeller((prev) => (prev + 1) % bestSellers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get visible best sellers for 3D display
  const getVisibleBestSellers = () => {
    return bestSellers.map((product: Product, index: number) => {
      const position = (index - currentBestSeller + bestSellers.length) % bestSellers.length;
      return { ...product, position };
    });
  };

  // Get stacked cards for 3D effect
  const getStackedCards = () => {
    return bestSellers.map((product: Product, index: number) => {
      const position = (index - currentBestSeller + bestSellers.length) % bestSellers.length;
      return { ...product, position };
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Successfully subscribed to our newsletter!');
    setEmail('');
    setIsSubscribing(false);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.sizes[0].size, 1);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
    const isAdded = !isInWishlist(productId);
    toast.success(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
  };

  // Navigation functions for best sellers
  const nextBestSeller = () => {
    setCurrentBestSeller((prev) => (prev + 1) % bestSellers.length);
  };

  const prevBestSeller = () => {
    setCurrentBestSeller((prev) => (prev - 1 + bestSellers.length) % bestSellers.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        nextBestSeller();
      } else {
        // Swipe right - prev
        prevBestSeller();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Banner - Auto-rotating Carousel */}
      <section className="relative h-[500px] sm:h-[550px] md:h-[650px] lg:h-[700px] xl:h-[750px] overflow-hidden group">

        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
            }`}
          >
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-teal-900/30 z-10 mix-blend-multiply" />
            
            {/* Video with Enhanced Effects */}
            <video
              src={slide.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            />
            
            {/* Content Container with Enhanced Layout */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                  {/* Decorative Element */}
                  <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4 sm:mb-6 rounded-full animate-fade-in" />
                  
                  {/* Title with Enhanced Typography */}
                  <h1 className="text-white font-extrabold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight animate-fade-in transform transition-all duration-700 hover:translate-x-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl drop-shadow-2xl">
  
                      {slide.title}
                    
                  </h1>
                  
                  {/* Subtitle with Better Spacing */}
                  <p className="text-gray-100 mb-6 sm:mb-7 md:mb-8 lg:mb-10 animate-fade-in-delay transform transition-all duration-700 delay-200 hover:translate-x-2 leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg font-light max-w-prose">
                    {slide.subtitle}
                  </p>
                  
                  {/* Enhanced CTA Button */}
                  <Link to={slide.link}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="relative overflow-hidden bg-emerald-600 text-white hover:from-emerald-700 hover:to-teal-700 transform transition-all duration-300 hover:scale-105  px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full group/button"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.cta}
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>

                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

    {/* Categories Section - Premium Redesign */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block mb-4">
              <span className="text-emerald-600 font-medium text-sm tracking-[0.3em] uppercase">
                Discover Your Signature
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
              Explore by
              <span className="block font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Collection
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Curated fragrances that define elegance and sophistication
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={category.link}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`,
                }}
                aria-label={`Browse ${category.name}`}
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 bg-white">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-700 z-10"></div>
                    
                    {/* Premium Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>

                    {/* Image */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Category Icon - Floating */}
                    <div className="absolute top-6 right-6 z-30">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-2xl font-light group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        {category.icon}
                      </div>
                    </div>

                    {/* Premium Badge */}
                    <div className="absolute top-6 left-6 z-30">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20 tracking-wider">
                        PREMIUM
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-6 md:p-8 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    {/* Tagline - Hidden by default, shown on hover */}
                    <div className="overflow-hidden mb-3">
                      <p className={`text-emerald-300 text-sm font-light italic tracking-wide transition-all duration-500 ${
                        hoveredCategory === category.id 
                          ? 'translate-y-0 opacity-100' 
                          : 'translate-y-4 opacity-0'
                      }`}>
                        {category.tagline}
                      </p>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-white font-serif text-2xl md:text-3xl mb-3 group-hover:text-emerald-100 transition-colors duration-300">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-200 text-sm md:text-base mb-6 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center gap-3 text-white font-medium group-hover:gap-4 transition-all duration-300">
                      <span className="relative">
                        Explore Collection
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                      </span>
                      <ChevronRight 
                        size={20} 
                        className="group-hover:translate-x-1 transition-transform duration-300" 
                      />
                    </div>
                  </div>

                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-400/50 transition-all duration-500 pointer-events-none"></div>
                </div>

                {/* Floating Decorative Element */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`}></div>
              </Link>
            ))}
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-16 md:mt-20 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid - Premium Redesign */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-20 gap-6">
            <div className="max-w-2xl">
              <div className="inline-block mb-4">
                <span className="text-emerald-600 font-medium text-sm tracking-[0.3em] uppercase">
                  Handpicked Selection
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-4 tracking-tight">
                Featured
                <span className="block font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                  Fragrances
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Premium selection of luxury fragrances crafted for the discerning individual
              </p>
            </div>

            {/* View All Button */}
            <Link to="/shop" className="group">
              <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="font-medium">View All Collection</span>
                <ChevronRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </div>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Product Card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                    {/* Premium Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>

                    {/* Product Image */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-4 left-4 z-30">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                          SAVE {product.discount}%
                        </div>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`absolute top-4 right-4 z-30 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-white shadow-md'
                      }`}
                      aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={18}
                        className={isInWishlist(product.id) ? 'fill-current' : ''}
                      />
                    </button>

                    {/* Quick Actions - Show on Hover */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-white/95 backdrop-blur-sm text-gray-900 font-semibold py-3 px-4 rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
                      >
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Brand */}
                    <p className="text-sm text-emerald-600 font-medium mb-2 tracking-wide uppercase">
                      {product.brand}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {product.rating}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price Container */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(
                              product.discount
                                ? product.price * (1 - product.discount / 100)
                                : product.price
                            )}
                          </span>
                          {product.discount && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        {product.discount && (
                          <span className="text-xs text-emerald-600 font-medium mt-1">
                            You save {formatCurrency(product.price * (product.discount / 100))}
                          </span>
                        )}
                      </div>

                      {/* Stock Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 50 
                          ? 'bg-emerald-100 text-emerald-700'
                          : product.stock > 20
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 50 ? 'In Stock' : product.stock > 20 ? 'Limited' : 'Low Stock'}
                      </div>
                    </div>

                    {/* Fragrance Notes Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                        Top Notes
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {product.fragrance.topNotes.slice(0, 3).map((note, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-400/30 transition-all duration-500 pointer-events-none"></div>
                </div>

                {/* Floating Shadow Effect */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>

          {/* Bottom Decorative Element */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers 3D Card Stack - Premium Redesign */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block mb-4">
              <span className="text-emerald-400 font-medium text-sm tracking-[0.3em] uppercase">
                Customer Favorites
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-6 tracking-tight">
              Best
              <span className="block font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mt-2">
                Sellers
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover the fragrances loved by thousands of satisfied customers
            </p>
          </div>

          {/* 3D Card Stack Container */}
          <div 
            className="relative h-[650px] md:h-[700px] lg:h-[750px] flex items-center justify-center touch-pan-y"
            onMouseEnter={() => !isMobile && setIsAutoRotating(false)}
            onMouseLeave={() => !isMobile && setIsAutoRotating(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ perspective: '2500px' }}
          >
            {getStackedCards().map((item) => {
              const position = item.position;
              const isActive = position === 0;
              const zIndex = bestSellers.length - position;
              
              // Calculate transformations for 3D stack effect
              const getTransform = () => {
                if (position === 0) {
                  return 'translateX(0) translateY(0) translateZ(0) rotateY(0deg) scale(1)';
                } else if (position === 1) {
                  return 'translateX(60px) translateY(30px) translateZ(-100px) rotateY(-8deg) scale(0.95)';
                } else if (position === 2) {
                  return 'translateX(120px) translateY(60px) translateZ(-200px) rotateY(-15deg) scale(0.9)';
                } else if (position === bestSellers.length - 1) {
                  return 'translateX(-60px) translateY(30px) translateZ(-100px) rotateY(8deg) scale(0.95)';
                } else if (position === bestSellers.length - 2) {
                  return 'translateX(-120px) translateY(60px) translateZ(-200px) rotateY(15deg) scale(0.9)';
                } else {
                  return 'translateX(0) translateY(90px) translateZ(-300px) rotateY(0deg) scale(0.85)';
                }
              };

              const getOpacity = () => {
                if (position === 0) return 1;
                if (position <= 2 || position >= bestSellers.length - 2) return 0.6;
                return 0.2;
              };

              return (
                <div
                  key={item.id}
                  className="absolute transition-all duration-700 ease-out cursor-pointer select-none"
                  style={{
                    transform: getTransform(),
                    opacity: getOpacity(),
                    zIndex: zIndex,
                  }}
                  onClick={() => {
                    if (position !== 0) {
                      setCurrentBestSeller((currentBestSeller + position) % bestSellers.length);
                    }
                  }}
                >
                  {/* Product Card */}
                  <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden w-[340px] md:w-[380px] lg:w-[420px] transform transition-all duration-500 ${
                    isActive ? 'ring-4 ring-emerald-400/50 shadow-emerald-500/30' : ''
                  }`}>
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 group">
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 z-10 ${
                        isActive ? 'opacity-100' : 'opacity-60'
                      }`}></div>

                      {/* Premium Shine Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 z-20 ${
                        isActive ? 'animate-shine' : '-translate-x-full'
                      }`}></div>

                      {/* Product Image */}
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isActive ? 'scale-100' : 'scale-110'
                        }`}
                      />

                      {/* Rank Badge - Top Left */}
                      <div className="absolute top-4 left-4 z-30">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-75"></div>
                          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 text-white w-16 h-16 rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-white/50">
                            <span className="text-xs font-bold uppercase">Top</span>
                            <span className="text-2xl font-extrabold leading-none">
                              #{bestSellers.findIndex(p => p.id === item.id) + 1}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bestseller Badge - Top Right */}
                      <div className="absolute top-4 right-4 z-30">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-sm border border-white/30">
                          <Star size={14} className="fill-current" />
                          BESTSELLER
                        </div>
                      </div>

                      {/* Discount Badge */}
                      {item.discount && (
                        <div className="absolute top-20 right-4 z-30">
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
                            SAVE {item.discount}%
                          </div>
                        </div>
                      )}

                      {/* Wishlist Button - Active Card Only */}
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(item.id);
                          }}
                          className={`absolute bottom-4 right-4 z-30 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                            isInWishlist(item.id)
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white/90 text-gray-600 hover:bg-white shadow-md'
                          }`}
                          aria-label={isInWishlist(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart
                            size={20}
                            className={isInWishlist(item.id) ? 'fill-current' : ''}
                          />
                        </button>
                      )}

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold tracking-wide uppercase text-emerald-300">
                            {item.brand}
                          </p>
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold">
                              {item.rating}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-200 text-sm line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6 md:p-8">
                      {/* Rating Details */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={
                                i < Math.floor(item.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 font-semibold">
                          ({item.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Price Container */}
                      <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                              {formatCurrency(
                                item.discount
                                  ? item.price * (1 - item.discount / 100)
                                  : item.price
                              )}
                            </span>
                            {item.discount && (
                              <span className="text-lg text-gray-400 line-through">
                                {formatCurrency(item.price)}
                              </span>
                            )}
                          </div>
                          {item.discount && (
                            <span className="text-sm text-emerald-600 font-bold mt-1">
                              You save {formatCurrency(item.price * (item.discount / 100))}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex flex-col items-end">
                          <div className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                            item.stock > 50 
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.stock > 20
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.stock > 50 ? 'In Stock' : item.stock > 20 ? 'Limited' : 'Low Stock'}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 font-medium">
                            {item.stock} units left
                          </span>
                        </div>
                      </div>

                      {/* Fragrance Notes */}
                      <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">
                          Signature Notes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.fragrance.topNotes.slice(0, 2).map((note, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-3 py-2 rounded-full font-semibold border border-emerald-200"
                            >
                              {note}
                            </span>
                          ))}
                          {item.fragrance.middleNotes.slice(0, 1).map((note, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-2 rounded-full font-semibold border border-purple-200"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Add to Cart Button - Only for Active Card */}
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 px-6 rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-3 group/btn transform hover:scale-105"
                        >
                          <ShoppingCart size={22} className="group-hover/btn:scale-110 transition-transform" />
                          <span className="text-lg">Add to Cart</span>
                        </button>
                      )}
                    </div>

                    {/* Hover Border Glow - Only for Active Card */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/50 transition-all duration-500 pointer-events-none animate-pulse"></div>
                    )}
                  </div>

                  {/* Floating Glow Effect - Only for Active Card */}
                  {isActive && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-full blur-2xl animate-pulse"></div>
                  )}
                </div>
              );
            })}

            {/* Navigation Arrows - Desktop Only */}
            {!isMobile && (
              <>
                <button
                  onClick={prevBestSeller}
                  className="absolute left-4 md:left-8 lg:left-16 z-20 bg-white/95 hover:bg-white p-4 md:p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 group"
                  aria-label="Previous product"
                >
                  <ChevronLeft size={28} className="text-gray-900 group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={nextBestSeller}
                  className="absolute right-4 md:right-8 lg:right-16 z-20 bg-white/95 hover:bg-white p-4 md:p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:translate-x-1 group"
                  aria-label="Next product"
                >
                  <ChevronRight size={28} className="text-gray-900 group-hover:text-emerald-600 transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Swipe Indicator - Mobile Only */}
          {isMobile && (
            <div className="flex justify-center mt-8 md:hidden">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-white/70 text-sm font-medium flex items-center gap-2">
                  <ChevronLeft size={16} />
                  Swipe to browse
                  <ChevronRight size={16} />
                </p>
              </div>
            </div>
          )}

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {bestSellers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBestSeller(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === currentBestSeller
                    ? 'w-16 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg shadow-emerald-400/50'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-rotate Control - Desktop Only */}
          {!isMobile && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 flex items-center gap-2"
              >
                {isAutoRotating ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    Auto-rotating
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    Paused (hover to pause)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {bestSellers.reduce((sum, p) => sum + p.reviewCount, 0).toLocaleString()}+
              </div>
              <div className="text-emerald-300 text-sm font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                4.9
              </div>
              <div className="text-emerald-300 text-sm font-medium">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {bestSellers.length}
              </div>
              <div className="text-emerald-300 text-sm font-medium">
                Top Sellers
              </div>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Premium Redesign */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Floating Quote Icons */}
        <div className="absolute top-10 right-20 opacity-10">
          <Quote size={120} className="text-emerald-400 rotate-12" />
        </div>
        <div className="absolute bottom-10 left-20 opacity-10">
          <Quote size={100} className="text-teal-400 -rotate-12" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block mb-4">
              <span className="text-emerald-600 font-medium text-sm tracking-[0.3em] uppercase">
                Customer Stories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
              What Our
              <span className="block font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Customers Say
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Real experiences from fragrance enthusiasts who found their perfect scent
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`,
                }}
              >
                {/* Testimonial Card */}
                <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden">
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-[2px]">
                    <div className="w-full h-full bg-white rounded-3xl"></div>
                  </div>

                  {/* Content */}
                  <div className="relative p-8">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <Quote size={40} className="text-emerald-400" />
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-6">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(testimonial.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 italic relative">
                      <span className="text-4xl text-emerald-200 absolute -top-2 -left-2 font-serif">"</span>
                      {testimonial.comment}
                      <span className="text-4xl text-emerald-200 absolute -bottom-4 -right-2 font-serif">"</span>
                    </blockquote>

                    {/* Customer Info */}
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-emerald-100">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        {/* Online Status Indicator */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>

                      {/* Customer Details */}
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-bold text-lg mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-emerald-600 text-sm font-medium mb-2">
                          Verified Customer
                        </p>
                        
                        {/* Product Mentioned */}
                        {testimonial.product && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                              <span className="text-emerald-600 font-bold text-xs">P</span>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              Purchased {testimonial.product}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-700 pointer-events-none"></div>
                </div>

                {/* Floating Shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                10K+
              </div>
              <div className="text-emerald-600 text-sm font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                4.9★
              </div>
              <div className="text-emerald-600 text-sm font-medium">
                Average Rating
              </div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                98%
              </div>
              <div className="text-emerald-600 text-sm font-medium">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                24/7
              </div>
              <div className="text-emerald-600 text-sm font-medium">
                Customer Support
              </div>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
