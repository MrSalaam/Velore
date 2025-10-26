import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronRight,
  Truck,
  RotateCcw,
  Shield,
  Check,
} from 'lucide-react';
import { Product } from '../types';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductReviews } from '../components/product/ProductReviews';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useLocalStorage';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

// Mock product data - In real app, this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Velvet Rose Intense',
    brand: 'Tom Ford',
    price: 285,
    discount: 15,
    rating: 4.8,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
    ],
    description:
      'Velvet Rose Intense is a luxurious and captivating fragrance that combines the elegance of rose with the richness of velvet. This sophisticated scent is perfect for evening wear and special occasions, leaving a lasting impression wherever you go.',
    category: 'women',
    inStock: true,
    stock: 45,
    featured: true,
    sizes: [
      { size: '30ml', price: 185, stock: 15 },
      { size: '50ml', price: 285, stock: 20 },
      { size: '100ml', price: 385, stock: 10 }
    ],
    createdAt: new Date('2024-01-15'),
    fragrance: {
      topNotes: ['Rose', 'Bergamot', 'Pink Pepper'],
      middleNotes: ['Jasmine', 'Violet', 'Iris'],
      baseNotes: ['Musk', 'Vanilla', 'Patchouli'],
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
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    ],
    description: 'Deep and mysterious oud fragrance perfect for confident individuals.',
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
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'],
    description: 'Fresh and vibrant citrus notes perfect for daily wear.',
    category: 'unisex',
    inStock: true,
    stock: 67,
    featured: true,
    sizes: [
      { size: '30ml', price: 145, stock: 25 },
      { size: '50ml', price: 245, stock: 30 },
      { size: '100ml', price: 345, stock: 12 }
    ],
    createdAt: new Date('2024-01-10'),
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      middleNotes: ['Neroli', 'Petitgrain'],
      baseNotes: ['Cedar', 'White Musk'],
    },
  },
];

// Related products for recommendations
const relatedProducts: Product[] = [
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
    createdAt: new Date('2024-02-01'),
    fragrance: {
      topNotes: ['Bergamot', 'Pink Pepper'],
      middleNotes: ['Oud', 'Rose'],
      baseNotes: ['Amber', 'Incense'],
    },
  },
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
    createdAt: new Date('2024-01-25'),
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
      { size: '75ml', price: 280, stock: 44 },
      { size: '100ml', price: 350, stock: 40 }
    ],
    createdAt: new Date('2024-01-30'),
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
    createdAt: new Date('2024-02-05'),
    fragrance: {
      topNotes: ['Saffron', 'Cardamom'],
      middleNotes: ['Rose', 'Jasmine'],
      baseNotes: ['Amber', 'Oud'],
    },
  },
];

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'fragrance' | 'details'>('description');

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const foundProduct = mockProducts.find((p) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes[0].size);
      }
      setIsLoading(false);
    }, 500);

    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/shop')} variant="primary">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (quantity > product.stock) {
      toast.error('Not enough stock available');
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link to="/shop" className="hover:text-indigo-600">
            Shop
          </Link>
          <ChevronRight size={16} />
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-indigo-600 capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {formatCurrency(discountedPrice)}
              </span>
              {product.discount && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((sizeOption) => (
                  <button
                    key={sizeOption.size}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === sizeOption.size
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {sizeOption.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<ShoppingCart size={20} />}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-3 border-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                }`}
              >
                <Heart
                  size={24}
                  className={isWishlisted ? 'fill-current' : ''}
                />
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Share2 size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Truck className="text-indigo-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    Free Shipping
                  </p>
                  <p className="text-xs text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="text-indigo-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    Easy Returns
                  </p>
                  <p className="text-xs text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="text-indigo-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    Authentic Products
                  </p>
                  <p className="text-xs text-gray-600">100% genuine</p>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <span className="capitalize">{product.category}</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow mb-16">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 font-semibold transition-colors relative ${
                  activeTab === 'description'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('fragrance')}
                className={`py-4 font-semibold transition-colors relative ${
                  activeTab === 'fragrance'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Fragrance Notes
                {activeTab === 'fragrance' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 font-semibold transition-colors relative ${
                  activeTab === 'details'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Product Details
                {activeTab === 'details' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This exquisite fragrance is crafted with the finest ingredients
                  to create a unique and memorable scent experience. Perfect for
                  both day and evening wear, it captures the essence of luxury and
                  sophistication.
                </p>
              </div>
            )}

            {activeTab === 'fragrance' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      1
                    </span>
                    Top Notes
                  </h3>
                  <ul className="space-y-2">
                    {product.fragrance.topNotes.map((note) => (
                      <li key={note} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-indigo-600" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      2
                    </span>
                    Middle Notes
                  </h3>
                  <ul className="space-y-2">
                    {product.fragrance.middleNotes.map((note) => (
                      <li key={note} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-indigo-600" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      3
                    </span>
                    Base Notes
                  </h3>
                  <ul className="space-y-2">
                    {product.fragrance.baseNotes.map((note) => (
                      <li key={note} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-indigo-600" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Brand</span>
                  <span className="text-gray-700">{product.brand}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Category</span>
                  <span className="text-gray-700 capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Available Sizes</span>
                  <span className="text-gray-700">{product.sizes.map(s => s.size).join(', ')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Stock Status</span>
                  <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Rating</span>
                  <span className="text-gray-700">{product.rating} / 5</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Reviews</span>
                  <span className="text-gray-700">{product.reviewCount} reviews</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <ProductReviews
            productId={product.id}
            reviews={[]}
            averageRating={product.rating}
            totalReviews={product.reviewCount}
          />
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                You May Also Like
              </h2>
              <p className="text-gray-600">Similar products you might be interested in</p>
            </div>
            <Link to="/shop">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;