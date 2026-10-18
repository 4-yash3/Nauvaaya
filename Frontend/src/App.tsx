import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  X, 
  Plus, 
  Minus, 
  Sparkles, 
  ShieldCheck, 
  ArrowDown, 
  Check, 
  SlidersHorizontal, 
  RotateCcw, 
  Star, 
  Ruler, 
  Truck, 
  RefreshCw, 
  Play 
} from 'lucide-react';
import type { 
  MediaItem, 
  Variant, 
  Product, 
  CartItem, 
  OrderConfirmation 
} from './types';
import { CheckoutModal } from './components/CheckoutModal';

// Curated artisan metadata mapping for the database products
const PRODUCT_METADATA: Record<string, Partial<Product>> = {
  'paper-and-poppy': {
    category: 'Shirts',
    tag: 'New Arrival',
    colors: ['#fbf8f2', '#e28847', '#d8caa8'],
    fabric: '100% Breathable Fine Cotton',
    artisan_technique: 'Floral threadwork and handcrafted notched collar'
  },
  'sun-and-script': {
    category: 'Exclusive Collections',
    tag: 'Bestseller',
    colors: ['#e5973b', '#b8b5b0', '#d8caa8'],
    fabric: '100% Long-Staple Cotton',
    artisan_technique: 'Sunflower block print with fine script needlework'
  },
  'the-back-story-edit': {
    category: 'Statement Shirts',
    tag: 'Limited Edition',
    colors: ['#ffffff', '#df8f9f', '#c69d7b'],
    fabric: '100% Pre-washed Slub Cotton',
    artisan_technique: 'Hindi typography and back panel narrative embroidery'
  },
  'the-statement-spine': {
    category: 'Statement Shirts',
    tag: 'Signature',
    colors: ['#ffffff', '#28221e', '#cead93'],
    fabric: '100% Textured Cotton Weave',
    artisan_technique: 'Minimalist spine embroidery with custom needlework'
  },
  'threaded-banter': {
    category: 'Embroidered Pieces',
    tag: 'Handcrafted',
    colors: ['#ffffff', '#bcc2e2', '#7a8b7b'],
    fabric: '100% Breathable Khadi Cotton',
    artisan_technique: 'Delicate conversation threadwork across collar & chest'
  }
};

// Default products populated with local backend static files and database variants
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'f8896d77-2604-4066-b76d-aac9d9e2bd74',
    name: 'Sun and Script',
    slug: 'sun-and-script',
    price: 1499,
    primary_image_url: 'http://127.0.0.1:8000/static/products/sun-and-script/1.png',
    gallery_urls: [
      'http://127.0.0.1:8000/static/products/sun-and-script/1.png',
      'http://127.0.0.1:8000/static/products/sun-and-script/2.png',
      'http://127.0.0.1:8000/static/products/sun-and-script/3.png',
      'http://127.0.0.1:8000/static/products/sun-and-script/4.png'
    ],
    media: [
      { image_url: 'http://127.0.0.1:8000/static/products/sun-and-script/1.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/sun-and-script/2.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/sun-and-script/3.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/sun-and-script/4.png', media_type: 'image' }
    ],
    variants: [
      { id: 'fda95c1c-263b-48fe-add7-c92662421133', size: 'S', sku: 'SAS-S', stock_quantity: 15 },
      { id: '6811efc8-4448-4804-a16c-469710c5e8b5', size: 'M', sku: 'SAS-M', stock_quantity: 20 },
      { id: '32979fbf-d035-4706-b946-de6269da8ae2', size: 'L', sku: 'SAS-L', stock_quantity: 10 }
    ],
    available_sizes: ['S', 'M', 'L'],
    in_stock: true,
    category: 'Exclusive Collections',
    colors: ['#e5973b', '#b8b5b0', '#d8caa8'],
    tag: 'Bestseller',
    description: 'Artisanal script embroidery on premium cotton with handcrafted sunflower sleeve accents.',
    fabric: '100% Long-Staple Cotton',
    artisan_technique: 'Sunflower block print with fine script needlework'
  },
  {
    id: '9f418d4c-72ae-4afd-a0da-42cde581a7df',
    name: 'Paper and Poppy',
    slug: 'paper-and-poppy',
    price: 1499,
    primary_image_url: 'http://127.0.0.1:8000/static/products/paper-and-poppy/1.png',
    gallery_urls: [
      'http://127.0.0.1:8000/static/products/paper-and-poppy/1.png',
      'http://127.0.0.1:8000/static/products/paper-and-poppy/2.png',
      'http://127.0.0.1:8000/static/products/paper-and-poppy/3.png',
      'http://127.0.0.1:8000/static/products/paper-and-poppy/4.png',
      'http://127.0.0.1:8000/static/products/paper-and-poppy/video.mp4'
    ],
    media: [
      { image_url: 'http://127.0.0.1:8000/static/products/paper-and-poppy/1.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/paper-and-poppy/2.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/paper-and-poppy/3.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/paper-and-poppy/4.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/paper-and-poppy/video.mp4', media_type: 'video' }
    ],
    variants: [
      { id: '96e32176-c07a-4654-85b0-49c2137af444', size: 'S', sku: 'PAP-S', stock_quantity: 15 },
      { id: '3a8304cc-4d4b-4390-8039-a34361d15082', size: 'M', sku: 'PAP-M', stock_quantity: 20 },
      { id: '4ba7a94b-9b19-43cc-b10b-f275083aad25', size: 'L', sku: 'PAP-L', stock_quantity: 8 }
    ],
    available_sizes: ['S', 'M', 'L'],
    in_stock: true,
    category: 'Shirts',
    colors: ['#fbf8f2', '#e28847', '#d8caa8'],
    tag: 'New Arrival',
    description: 'Nature-inspired embroidered shirt tailored from breathable cotton with handcrafted floral details.',
    fabric: '100% Breathable Fine Cotton',
    artisan_technique: 'Floral threadwork and handcrafted notched collar'
  },
  {
    id: 'e05c7a65-b83d-4575-a0ad-eafd3b3a0422',
    name: 'The back story Edit',
    slug: 'the-back-story-edit',
    price: 1699,
    primary_image_url: 'http://127.0.0.1:8000/static/products/the-back-story-edit/1.png',
    gallery_urls: [
      'http://127.0.0.1:8000/static/products/the-back-story-edit/1.png',
      'http://127.0.0.1:8000/static/products/the-back-story-edit/2.png',
      'http://127.0.0.1:8000/static/products/the-back-story-edit/3.png',
      'http://127.0.0.1:8000/static/products/the-back-story-edit/4.png',
      'http://127.0.0.1:8000/static/products/the-back-story-edit/video.mp4'
    ],
    media: [
      { image_url: 'http://127.0.0.1:8000/static/products/the-back-story-edit/1.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-back-story-edit/2.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-back-story-edit/3.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-back-story-edit/4.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-back-story-edit/video.mp4', media_type: 'video' }
    ],
    variants: [
      { id: '511f553f-c373-41f1-845c-4062910c645f', size: 'S', sku: 'BSE-S', stock_quantity: 12 },
      { id: '4bf765a8-1224-4bb3-9a40-2234f12e731c', size: 'M', sku: 'BSE-M', stock_quantity: 18 },
      { id: '71581565-6d8b-4248-b7d5-b1da787f6002', size: 'L', sku: 'BSE-L', stock_quantity: 8 }
    ],
    available_sizes: ['S', 'M', 'L'],
    in_stock: true,
    category: 'Statement Shirts',
    colors: ['#ffffff', '#df8f9f', '#c69d7b'],
    tag: 'Limited Edition',
    description: 'Statement artwork and narrative needlework detailed across the rear panel of pre-washed cotton.',
    fabric: '100% Pre-washed Slub Cotton',
    artisan_technique: 'Hindi typography and back panel narrative embroidery'
  },
  {
    id: '2b2005de-491f-4386-bad0-3ac6cb7c54d8',
    name: 'The statement Spine',
    slug: 'the-statement-spine',
    price: 1599,
    primary_image_url: 'http://127.0.0.1:8000/static/products/the-statement-spine/1.png',
    gallery_urls: [
      'http://127.0.0.1:8000/static/products/the-statement-spine/1.png',
      'http://127.0.0.1:8000/static/products/the-statement-spine/2.png',
      'http://127.0.0.1:8000/static/products/the-statement-spine/3.png',
      'http://127.0.0.1:8000/static/products/the-statement-spine/4.png',
      'http://127.0.0.1:8000/static/products/the-statement-spine/video.mp4'
    ],
    media: [
      { image_url: 'http://127.0.0.1:8000/static/products/the-statement-spine/1.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-statement-spine/2.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-statement-spine/3.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-statement-spine/4.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/the-statement-spine/video.mp4', media_type: 'video' }
    ],
    variants: [
      { id: '49eb6c21-6452-45e3-8dcd-2d0792a7d1b4', size: 'S', sku: 'TSS-S', stock_quantity: 10 },
      { id: 'df74a06b-db68-493a-8808-b5ddbc9ea328', size: 'M', sku: 'TSS-M', stock_quantity: 15 },
      { id: '1fe50610-67c1-4a67-81cd-4872ca9d5cb0', size: 'L', sku: 'TSS-L', stock_quantity: 12 }
    ],
    available_sizes: ['S', 'M', 'L'],
    in_stock: true,
    category: 'Statement Shirts',
    colors: ['#ffffff', '#28221e', '#cead93'],
    tag: 'Signature',
    description: 'Minimalist spine-aligned graphic embroidery executed in fine contrasting artisan threads.',
    fabric: '100% Textured Cotton Weave',
    artisan_technique: 'Minimalist spine embroidery with custom needlework'
  },
  {
    id: '88ce74c5-0445-4601-9456-258415b11dac',
    name: 'Threaded banter',
    slug: 'threaded-banter',
    price: 1399,
    primary_image_url: 'http://127.0.0.1:8000/static/products/threaded-banter/1.png',
    gallery_urls: [
      'http://127.0.0.1:8000/static/products/threaded-banter/1.png',
      'http://127.0.0.1:8000/static/products/threaded-banter/2.png',
      'http://127.0.0.1:8000/static/products/threaded-banter/3.png',
      'http://127.0.0.1:8000/static/products/threaded-banter/4.png'
    ],
    media: [
      { image_url: 'http://127.0.0.1:8000/static/products/threaded-banter/1.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/threaded-banter/2.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/threaded-banter/3.png', media_type: 'image' },
      { image_url: 'http://127.0.0.1:8000/static/products/threaded-banter/4.png', media_type: 'image' }
    ],
    variants: [
      { id: 'ac841602-0336-4afe-8f87-6eb017f55211', size: 'S', sku: 'THB-S', stock_quantity: 20 },
      { id: 'b5840098-5607-40de-8292-9084dc077e08', size: 'M', sku: 'THB-M', stock_quantity: 25 },
      { id: '002dc406-521b-4ccd-973e-99c4960445cb', size: 'L', sku: 'THB-L', stock_quantity: 15 }
    ],
    available_sizes: ['S', 'M', 'L'],
    in_stock: true,
    category: 'Embroidered Pieces',
    colors: ['#ffffff', '#bcc2e2', '#7a8b7b'],
    tag: 'Handcrafted',
    description: 'Subtle typography needlework on breathable fabric with conversational handcrafted charm.',
    fabric: '100% Breathable Khadi Cotton',
    artisan_technique: 'Delicate conversation threadwork across collar & chest'
  }
];

const CATEGORIES = [
  {
    title: 'SHIRTS',
    image: 'http://127.0.0.1:8000/static/products/paper-and-poppy/1.png',
    categoryKey: 'Shirts'
  },
  {
    title: 'EMBROIDERED PIECES',
    image: 'http://127.0.0.1:8000/static/products/threaded-banter/1.png',
    categoryKey: 'Embroidered Pieces'
  },
  {
    title: 'EXCLUSIVE COLLECTIONS',
    image: 'http://127.0.0.1:8000/static/products/sun-and-script/1.png',
    categoryKey: 'Exclusive Collections'
  },
  {
    title: 'STATEMENT SHIRTS',
    image: 'http://127.0.0.1:8000/static/products/the-statement-spine/1.png',
    categoryKey: 'Statement Shirts'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'product'>('home');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderConfirmation | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(MOCK_PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'craft' | 'fit' | 'shipping' | 'care'>('craft');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Shop Page Filters & Controls
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAgreed, setNewsletterAgreed] = useState(true);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const announcements = [
    "✧ LIMITED PIECES   |   CRAFTED IN SMALL BATCHES   |   WORLDWIDE SHIPPING",
    "✧ HANDCRAFTED EMBROIDERY   |   PURE ARTISANAL COTTON   |   SHIPS IN 48 HOURS",
    "✧ COMPLIMENTARY SHIPPING ON ORDERS OVER ₹ 5,000   |   EASY EXCHANGES"
  ];

  // Sync hash routing with page state
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const slug = hash.replace('#product-', '');
        const found = products.find(p => p.slug === slug);
        if (found) {
          setSelectedProduct(found);
          setSelectedSize(found.available_sizes[0] || 'M');
          setSelectedGalleryIdx(0);
          setProductQuantity(1);
          setCurrentPage('product');
          return;
        }
      }
      if (hash.startsWith('#shop')) {
        setCurrentPage('shop');
      } else {
        setCurrentPage('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  const navigateTo = (page: 'home' | 'shop', category = 'All') => {
    setCurrentPage(page);
    if (category !== 'All') {
      setSelectedCategory(category);
    }
    window.location.hash = page === 'shop' ? '#shop' : '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductPage = async (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.available_sizes[0] || 'M');
    setSelectedGalleryIdx(0);
    setProductQuantity(1);
    setCurrentPage('product');
    window.location.hash = `#product-${product.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch full product detail with all media and variants from FastAPI backend
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/products/${product.slug}`);
      if (res.ok) {
        const detail = await res.json();
        const gallery = detail.images?.map((img: MediaItem) => img.image_url) || product.gallery_urls;
        setSelectedProduct(prev => prev ? {
          ...prev,
          ...detail,
          gallery_urls: gallery,
          media: detail.images || prev.media,
          variants: detail.variants || prev.variants,
          available_sizes: detail.variants?.filter((v: Variant) => v.stock_quantity > 0).map((v: Variant) => v.size) || prev.available_sizes
        } : null);
      }
    } catch {
      // Fallback seamlessly to existing product state
    }
  };

  // Reusable catalog loader that syncs live database variants and stock
  const loadCatalog = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/products');
      if (!res.ok) throw new Error('API request failed');
      const catalog: Product[] = await res.json();
      if (catalog && catalog.length > 0) {
        // Fetch full media & variants array for each product in parallel
        const enrichedList = await Promise.all(
          catalog.map(async (prod) => {
            const meta = PRODUCT_METADATA[prod.slug] || {};
            try {
              const detailRes = await fetch(`http://127.0.0.1:8000/api/v1/products/${prod.slug}`);
              if (detailRes.ok) {
                const detail = await detailRes.json();
                const gallery = detail.images?.map((img: MediaItem) => img.image_url) || [prod.primary_image_url];
                return {
                  ...prod,
                  ...detail,
                  ...meta,
                  primary_image_url: prod.primary_image_url || gallery[0],
                  gallery_urls: gallery,
                  media: detail.images || [],
                  variants: detail.variants || [],
                  available_sizes: detail.variants?.filter((v: Variant) => v.stock_quantity > 0).map((v: Variant) => v.size) || prod.available_sizes
                };
              }
            } catch {
              // If detail fetch fails, use card response
            }
            return {
              ...prod,
              ...meta,
              gallery_urls: prod.primary_image_url ? [prod.primary_image_url] : []
            };
          })
        );
        setProducts(enrichedList);
        setSelectedProduct(prev => {
          if (!prev) return prev;
          const found = enrichedList.find(p => p.id === prev.id);
          return found || prev;
        });
      }
    } catch {
      setProducts(MOCK_PRODUCTS);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleOrderSuccess = (order: OrderConfirmation) => {
    setCompletedOrder(order);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    // Reload products so deducted stock quantities in PostgreSQL are updated in UI
    loadCatalog();
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (product: Product, selectedSize: string, quantity = 1) => {
    const liveProd = products.find(p => p.id === product.id) || product;
    const chosenVariant = liveProd.variants?.find((v) => v.size === selectedSize);

    if (!chosenVariant) {
      alert("Please select a size first.");
      return;
    }

    if (chosenVariant.stock_quantity <= 0) {
      alert(`Size ${selectedSize} is sold out.`);
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.variant_id === chosenVariant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        
        if (newQty > chosenVariant.stock_quantity) {
          alert(`Only ${chosenVariant.stock_quantity} available in size ${selectedSize}.`);
          return prevCart;
        }
        
        updated[existingIndex].quantity = newQty;
        return updated;
      }

      const primaryImg = liveProd.media?.find((img) => img.is_primary)?.image_url 
        || liveProd.primary_image_url 
        || liveProd.gallery_urls?.[0] 
        || '';

      return [
        ...prevCart,
        {
          variant_id: chosenVariant.id,
          product_id: liveProd.id,
          name: liveProd.name,
          size: chosenVariant.size,
          price: liveProd.price,
          image_url: primaryImg,
          quantity: quantity,
          max_stock: chosenVariant.stock_quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (variant_id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.variant_id === variant_id) {
        const newQty = item.quantity + delta;
        if (newQty > item.max_stock) {
          alert(`Only ${item.max_stock} available in stock for size ${item.size}.`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterAgreed) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Shop Page filtered & sorted product list
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        if (selectedCategory !== 'All' && prod.category !== selectedCategory) return false;
        if (selectedSizeFilter !== 'All' && !prod.available_sizes.includes(selectedSizeFilter)) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = prod.name.toLowerCase().includes(q);
          const matchCat = (prod.category || '').toLowerCase().includes(q);
          const matchTag = (prod.tag || '').toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-az') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, selectedSizeFilter, sortBy, searchQuery]);

  // Related products for product detail page
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter(p => p.id !== selectedProduct.id)
      .slice(0, 4);
  }, [products, selectedProduct]);

  // Full normalized media list for the selected product
  const currentProductMedia = useMemo(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.media && selectedProduct.media.length > 0) {
      return selectedProduct.media;
    }
    if (selectedProduct.gallery_urls && selectedProduct.gallery_urls.length > 0) {
      return selectedProduct.gallery_urls.map(url => ({
        image_url: url,
        media_type: (url && url.endsWith('.mp4')) ? ('video' as const) : ('image' as const)
      }));
    }
    if (selectedProduct.primary_image_url) {
      return [{
        image_url: selectedProduct.primary_image_url,
        media_type: 'image' as const
      }];
    }
    return [];
  }, [selectedProduct]);

  const handlePrevMedia = () => {
    if (currentProductMedia.length <= 1) return;
    setSelectedGalleryIdx(prev => (prev === 0 ? currentProductMedia.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    if (currentProductMedia.length <= 1) return;
    setSelectedGalleryIdx(prev => (prev === currentProductMedia.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for product gallery
  useEffect(() => {
    if (currentPage !== 'product') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevMedia();
      } else if (e.key === 'ArrowRight') {
        handleNextMedia();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, currentProductMedia.length]);

  // Active gallery item (image or video)
  const activeMediaItem = useMemo(() => {
    if (currentProductMedia.length === 0) return null;
    return currentProductMedia[selectedGalleryIdx] || currentProductMedia[0];
  }, [currentProductMedia, selectedGalleryIdx]);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#28221e] font-sans antialiased selection:bg-[#965438] selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#965438] text-[#fbf9f5] text-[10px] sm:text-[11px] tracking-[0.24em] uppercase py-2 px-4 font-normal flex items-center justify-between border-b border-[#84472f]">
        <button 
          onClick={() => setAnnouncementIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
          className="opacity-75 hover:opacity-100 transition p-1 cursor-pointer"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>

        <div className="flex items-center justify-center gap-3 sm:gap-6 overflow-hidden whitespace-nowrap text-center text-xs sm:text-[11px]">
          <span>{announcements[announcementIndex]}</span>
        </div>

        <button 
          onClick={() => setAnnouncementIndex((prev) => (prev + 1) % announcements.length)}
          className="opacity-75 hover:opacity-100 transition p-1 cursor-pointer"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* 2. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#f7f4ee]/90 backdrop-blur-md border-b border-[#e6dfd5]/60 transition-all">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 sm:h-24 flex items-center justify-between">
          
          {/* Left Navigation */}
          <nav className="flex items-center gap-6 sm:gap-8 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium text-[#443c37]">
            <button 
              onClick={() => navigateTo('shop', 'All')}
              className={`flex items-center gap-1.5 transition cursor-pointer ${
                currentPage === 'shop' && selectedCategory === 'All'
                  ? 'text-[#965438] font-bold border-b-2 border-[#965438] pb-0.5' 
                  : 'hover:text-[#965438]'
              }`}
            >
              SHOP <ChevronDown className="w-3 h-3 opacity-60 stroke-[1.5]" />
            </button>
            
            <button 
              onClick={() => navigateTo('shop', 'Exclusive Collections')}
              className={`flex items-center gap-1.5 transition cursor-pointer ${
                currentPage === 'shop' && selectedCategory === 'Exclusive Collections'
                  ? 'text-[#965438] font-bold border-b-2 border-[#965438] pb-0.5' 
                  : 'hover:text-[#965438]'
              }`}
            >
              COLLECTIONS <ChevronDown className="w-3 h-3 opacity-60 stroke-[1.5]" />
            </button>
            
            <button 
              onClick={() => navigateTo('home')}
              className="hover:text-[#965438] transition cursor-pointer"
            >
              JOURNAL
            </button>
          </nav>

          {/* Centered Brand Logo */}
          <button 
            onClick={() => navigateTo('home')}
            className="flex flex-col items-center group cursor-pointer py-1"
            aria-label="Nauvaaya Home"
          >
            <img 
              src="/logo.png" 
              alt="Nauvaaya" 
              className="h-14 sm:h-18 md:h-20 w-auto object-contain hover:opacity-90 transition-opacity" 
            />
          </button>

          {/* Right Navigation & Icons */}
          <div className="flex items-center gap-5 sm:gap-7">
            <nav className="hidden lg:flex items-center gap-8 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium text-[#443c37]">
              <a href="#about" className="hover:text-[#965438] transition">OUR ABOUT</a>
              <a href="#contact" className="hover:text-[#965438] transition">CONTACT</a>
            </nav>
            
            <div className="flex items-center gap-3.5 sm:gap-4 text-[#28221e]">
              <button 
                onClick={() => navigateTo('shop')}
                aria-label="Search Catalog" 
                className="hover:text-[#965438] transition p-1 cursor-pointer"
              >
                <Search className="w-[19px] h-[19px] stroke-[1.5]" />
              </button>
              
              <button aria-label="Account" className="hover:text-[#965438] transition p-1 cursor-pointer">
                <User className="w-[19px] h-[19px] stroke-[1.5]" />
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                aria-label="Bag" 
                className="relative hover:text-[#965438] transition p-1 cursor-pointer"
              >
                <ShoppingBag className="w-[19px] h-[19px] stroke-[1.5]" />
                <span className="absolute -top-1 -right-1.5 bg-[#28221e] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-medium">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CONDITIONAL FULL SCREEN PAGES: HOME, SHOP, OR PRODUCT DETAIL PAGE */}
      {/* ========================================================================= */}

      {currentPage === 'home' && (
        <>
          {/* HERO SECTION */}
          <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden bg-[#eae3d9]">
            <div className="absolute inset-0 z-0">
              <img 
                src="http://127.0.0.1:8000/static/products/sun-and-script/1.png" 
                alt="Handcrafted Artisanal Embroidered Apparel" 
                className="w-full h-full object-cover object-center lg:object-[70%_35%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#eae3d9] via-[#eae3d9]/80 to-transparent lg:w-[65%]" />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full py-16 lg:py-24 flex flex-col justify-between min-h-[75vh]">
              <div className="max-w-xl">
                <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#736b63] block mb-4">
                  WEAR A NEW BEGINNING
                </span>
                
                <h1 className="font-serif text-6xl sm:text-7xl lg:text-[88px] leading-[1.02] tracking-tight font-normal text-[#28221e] mb-6">
                  Crafted <br />
                  <span className="italic font-normal">for your</span> <br />
                  story
                </h1>
                
                <p className="text-[#655d56] text-sm sm:text-base leading-relaxed max-w-sm mb-9 font-normal">
                  Thoughtfully designed shirts with handcrafted details, inspired by tradition and made for today.
                </p>
                
                <button 
                  onClick={() => navigateTo('shop')}
                  className="inline-flex items-center gap-4 bg-[#965438] hover:bg-[#80442c] text-white px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium transition-all group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    ————→
                  </span>
                </button>
              </div>

              {/* Bottom Indicators */}
              <div className="flex items-end justify-between pt-16">
                <div className="flex items-center gap-7 text-xs tracking-widest font-medium text-[#736b63]">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentSlide(num)}
                      className={`transition-all pb-1 cursor-pointer ${
                        currentSlide === num 
                          ? 'text-[#28221e] border-b-2 border-[#28221e] font-semibold' 
                          : 'text-[#8a8076] hover:text-[#28221e]'
                      }`}
                    >
                      0{num}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex relative items-center justify-center w-28 h-28 cursor-pointer select-none">
                  <div className="absolute inset-0 animate-spin-slow">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path
                        id="circlePathHero"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                      />
                      <text className="text-[9.2px] uppercase tracking-[0.24em] fill-[#504741] font-medium">
                        <textPath href="#circlePathHero" startOffset="0%">
                          SCROLL TO EXPLORE • SCROLL TO EXPLORE •
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-[#504741]/40 flex items-center justify-center text-[#504741]">
                    <ArrowDown className="w-4 h-4 stroke-[1.5]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SHOP BY CATEGORY SECTION */}
          <section className="py-20 lg:py-24 max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#736b63] block mb-1">
                  EXPLORE
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#28221e]">
                  Shop by Category
                </h2>
              </div>
              
              <button 
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition group cursor-pointer"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CATEGORIES.map((cat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigateTo('shop', cat.categoryKey)}
                  className="group relative h-64 sm:h-72 lg:h-80 overflow-hidden cursor-pointer bg-[#e9e2d8]"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                    <span className="text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium drop-shadow-sm">
                      {cat.title}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-white/70 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#28221e] transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NEW ARRIVALS SECTION (Displays live backend database shirts) */}
          <section id="arrivals" className="pb-24 max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#736b63] block mb-1">
                  FRESHLY CRAFTED
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#28221e]">
                  New Arrivals
                </h2>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-8">
                <p className="text-xs text-[#736b63] max-w-xs font-normal leading-relaxed hidden sm:block">
                  Contemporary shirts with handcrafted details, made for everyday stories and special moments.
                </p>
                <button 
                  onClick={() => navigateTo('shop')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition group cursor-pointer"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((shirt) => (
                <div 
                  key={shirt.id} 
                  className="group flex flex-col cursor-pointer"
                  onClick={() => openProductPage(shirt)}
                >
                  <div className="relative aspect-[3/4] bg-[#e9e2d8] overflow-hidden mb-3.5 border border-[#e2d8cc]">
                    <img 
                      src={shirt.primary_image_url || MOCK_PRODUCTS[0].primary_image_url} 
                      alt={shirt.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {shirt.tag && (
                      <span className="absolute top-3.5 left-3.5 bg-[#28221e]/85 backdrop-blur-md text-white text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5">
                        {shirt.tag}
                      </span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(shirt.id);
                      }}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:text-[#df8f9f] hover:bg-black/40 transition shadow-sm cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 stroke-[1.75] ${
                          wishlist.includes(shirt.id) 
                            ? 'fill-[#df8f9f] text-[#df8f9f]' 
                            : 'text-white'
                        }`} 
                      />
                    </button>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#8a7f76]">
                    {shirt.category || 'Handcrafted Pieces'}
                  </span>

                  <h3 className="font-serif text-lg text-[#28221e] font-normal group-hover:text-[#965438] transition-colors leading-snug mt-0.5">
                    {shirt.name}
                  </h3>
                  
                  <p className="text-sm font-normal text-[#28221e] mt-0.5">
                    ₹ {shirt.price.toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    {(shirt.colors || ['#e5973b', '#b8b5b0', '#d8caa8']).map((color, cIdx) => (
                      <span 
                        key={cIdx}
                        className="w-3 h-3 rounded-full border border-black/15 inline-block shadow-2xs"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-5 mt-16">
              <button 
                className="w-10 h-10 rounded-full border border-[#d2c7bd] flex items-center justify-center text-[#28221e] hover:bg-[#28221e] hover:text-white hover:border-[#28221e] transition cursor-pointer"
                aria-label="Previous Page"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
              </button>
              
              <span className="text-xs tracking-[0.2em] text-[#736b63] font-mono px-3">
                01 &nbsp;/&nbsp; 04
              </span>
              
              <button 
                className="w-10 h-10 rounded-full border border-[#d2c7bd] flex items-center justify-center text-[#28221e] hover:bg-[#28221e] hover:text-white hover:border-[#28221e] transition cursor-pointer"
                aria-label="Next Page"
              >
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </section>
        </>
      )}

      {/* SHOP PAGE (Full Catalog Archive) */}
      {currentPage === 'shop' && (
        <main className="py-8 sm:py-12 max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#736b63] mb-6">
            <button 
              onClick={() => navigateTo('home')}
              className="hover:text-[#965438] transition cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#28221e] font-semibold">
              {selectedCategory === 'All' ? 'SHOP ALL' : selectedCategory.toUpperCase()}
            </span>
          </div>

          {/* Shop Page Editorial Hero Banner */}
          <div className="border-b border-[#e6dfd5] pb-10 sm:pb-12 mb-10">
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#736b63] block mb-2">
              CONSCIOUS ARCHIVE • HANDCRAFTED COTTON
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#28221e] font-normal tracking-tight">
              Artisanal Shirts & Handcrafted Stories
            </h1>
            <p className="text-[#655d56] text-sm sm:text-base leading-relaxed max-w-2xl mt-4 font-normal">
              Every shirt is tailored from breathable natural fibers, detailed with intricate needlework, and produced in strictly limited, conscious batches inspired by regional Indian heritage.
            </p>
          </div>

          {/* Refinement & Filter Toolbar */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Shirts', 'Embroidered Pieces', 'Statement Shirts', 'Exclusive Collections'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs uppercase tracking-[0.18em] transition-all rounded-xs cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#28221e] text-[#fbf9f5] font-medium shadow-xs'
                      : 'bg-[#ede6dc] text-[#554b44] hover:bg-[#e4dbcf] hover:text-[#28221e]'
                  }`}
                >
                  {cat === 'All' ? 'All Pieces' : cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-[#e6dfd5]/60">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736b63]" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH SHIRTS & EMBROIDERY..."
                  className="w-full bg-[#fbf9f5] border border-[#d8cfc4] focus:border-[#965438] text-xs uppercase tracking-[0.16em] pl-10 pr-9 py-2.5 text-[#28221e] placeholder:text-[#9a8e83] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736b63] hover:text-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#736b63] uppercase tracking-wider text-[11px] mr-1">Size:</span>
                  {['All', 'S', 'M', 'L'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizeFilter(sz)}
                      className={`w-7 h-7 flex items-center justify-center text-xs uppercase font-medium border transition cursor-pointer ${
                        selectedSizeFilter === sz
                          ? 'border-[#965438] bg-[#965438] text-white'
                          : 'border-[#d2c7bd] bg-[#fbf9f5] text-[#443c37] hover:border-[#28221e]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#736b63]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#fbf9f5] border border-[#d2c7bd] text-xs uppercase tracking-[0.16em] text-[#443c37] px-3 py-1.5 focus:outline-none focus:border-[#965438] cursor-pointer"
                  >
                    <option value="featured">Featured Order</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-az">Name: A to Z</option>
                  </select>
                </div>

                <div className="text-xs text-[#736b63] font-mono tracking-wider ml-auto md:ml-0">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-[#ede6dc]/40 border border-[#e6dfd5] px-6 my-8">
              <p className="font-serif text-2xl text-[#28221e]">No handcrafted pieces found matching your criteria.</p>
              <p className="text-xs text-[#736b63] mt-2 max-w-sm mx-auto">
                Try selecting a different category, clearing search terms, or resetting sizes.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSizeFilter('All');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#965438] text-white text-xs uppercase tracking-[0.2em] font-medium px-6 py-3 hover:bg-[#80442c] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET ALL FILTERS</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((shirt) => (
                <div 
                  key={shirt.id} 
                  className="group flex flex-col cursor-pointer"
                  onClick={() => openProductPage(shirt)}
                >
                  <div className="relative aspect-[3/4] bg-[#e9e2d8] overflow-hidden mb-3.5 border border-[#e2d8cc]">
                    <img 
                      src={shirt.primary_image_url || MOCK_PRODUCTS[0].primary_image_url} 
                      alt={shirt.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {shirt.tag && (
                      <span className="absolute top-3.5 left-3.5 bg-[#28221e]/85 backdrop-blur-md text-white text-[9px] uppercase tracking-[0.22em] font-medium px-2.5 py-1">
                        {shirt.tag}
                      </span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(shirt.id);
                      }}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:text-[#df8f9f] hover:bg-black/40 transition shadow-sm cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 stroke-[1.75] ${
                          wishlist.includes(shirt.id) 
                            ? 'fill-[#df8f9f] text-[#df8f9f]' 
                            : 'text-white'
                        }`} 
                      />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 bg-[#28221e]/90 text-white text-[11px] uppercase tracking-[0.2em] font-medium py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm">
                      VIEW PRODUCT DETAILS
                    </div>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#8a7f76]">
                    {shirt.category || 'Handcrafted Apparel'}
                  </span>

                  <h3 className="font-serif text-lg text-[#28221e] font-normal group-hover:text-[#965438] transition-colors leading-snug mt-1">
                    {shirt.name}
                  </h3>
                  
                  <p className="text-sm font-normal text-[#28221e] mt-0.5">
                    ₹ {shirt.price.toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    {(shirt.colors || ['#e5973b', '#b8b5b0', '#d8caa8']).map((color, cIdx) => (
                      <span 
                        key={cIdx}
                        className="w-3 h-3 rounded-full border border-black/15 inline-block shadow-2xs"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Artisanal Craft Commitment Strip */}
          <div className="mt-24 pt-12 border-t border-[#e6dfd5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[#28221e]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">HAND-EMBROIDERED</h4>
                <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
                  Meticulous threadwork crafted by regional artisans honoring traditional needle art.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">100% PURE COTTON</h4>
                <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
                  Breathable, natural staple fibers that soften beautifully with every gentle wash.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">SMALL-BATCH ETHOS</h4>
                <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
                  Consciously manufactured in limited quantities to prevent overproduction and textile waste.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ede5dc] border border-[#dcd3c7] flex items-center justify-center shrink-0 text-[#965438]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#28221e]">RESPONSIBLE CARE</h4>
                <p className="text-xs text-[#736b63] mt-1.5 leading-relaxed font-light">
                  Carefully boxed in plastic-free recycled paper with domestic and worldwide shipping.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FULL-SCREEN PRODUCT DETAIL PAGE */}
      {currentPage === 'product' && selectedProduct && (
        <main className="py-8 sm:py-12 max-w-[1440px] mx-auto px-6 lg:px-12 animate-fadeIn">
          
          {/* Breadcrumb & Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#e6dfd5]/80">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#736b63]">
              <button 
                onClick={() => navigateTo('home')}
                className="hover:text-[#965438] transition cursor-pointer"
              >
                HOME
              </button>
              <span>/</span>
              <button 
                onClick={() => navigateTo('shop')}
                className="hover:text-[#965438] transition cursor-pointer"
              >
                SHOP
              </button>
              <span>/</span>
              <button 
                onClick={() => navigateTo('shop', selectedProduct.category)}
                className="hover:text-[#965438] transition cursor-pointer"
              >
                {selectedProduct.category?.toUpperCase() || 'COLLECTION'}
              </button>
              <span>/</span>
              <span className="text-[#28221e] font-semibold">{selectedProduct.name}</span>
            </div>

            <button 
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO ARCHIVE</span>
            </button>
          </div>

          {/* 2-Column Full Screen Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Gallery Showcase with Controlled Height & In-Viewer Controls */}
            <div className="lg:col-span-6 flex flex-col items-center gap-4">
              
              {/* Main Media Display (Reduced height so it fits within viewport without scrolling) */}
              <div className="relative w-full max-w-[500px] aspect-[4/5] max-h-[68vh] bg-[#ede5dc] overflow-hidden border border-[#e4dcce] shadow-xs flex items-center justify-center group select-none">
                {activeMediaItem?.media_type === 'video' ? (
                  <video 
                    key={activeMediaItem.image_url}
                    src={activeMediaItem.image_url} 
                    controls 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    key={activeMediaItem?.image_url}
                    src={activeMediaItem?.image_url || selectedProduct.primary_image_url} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-top transition-all duration-300"
                  />
                )}

                {/* Badge in top-left */}
                {selectedProduct.tag && (
                  <span className="absolute top-4 left-4 bg-[#28221e]/85 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.24em] font-medium px-3 py-1 shadow-sm pointer-events-none">
                    {selectedProduct.tag}
                  </span>
                )}

                {/* Wishlist Button */}
                <button 
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#e6dfd5] flex items-center justify-center text-[#28221e] hover:text-[#df8f9f] transition shadow-sm cursor-pointer z-20"
                  aria-label="Wishlist"
                >
                  <Heart 
                    className={`w-4 h-4 stroke-[1.75] ${
                      wishlist.includes(selectedProduct.id) 
                        ? 'fill-[#df8f9f] text-[#df8f9f]' 
                        : 'text-[#28221e]'
                    }`} 
                  />
                </button>

                {/* Left Navigation Arrow */}
                {currentProductMedia.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevMedia();
                    }}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#28221e] hover:text-[#965438] backdrop-blur-md border border-[#e2d8cc] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 z-20 group/btn"
                    aria-label="Previous image"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2] transition-transform group-hover/btn:-translate-x-0.5" />
                  </button>
                )}

                {/* Right Navigation Arrow */}
                {currentProductMedia.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMedia();
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#28221e] hover:text-[#965438] backdrop-blur-md border border-[#e2d8cc] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 z-20 group/btn"
                    aria-label="Next image"
                    title="Next image"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2] transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                )}

                {/* Media Index Pill (e.g. 1 / 5) */}
                {currentProductMedia.length > 1 && (
                  <div className="absolute bottom-3.5 right-3.5 bg-[#28221e]/75 backdrop-blur-md text-white text-[10px] tracking-[0.2em] font-medium px-2.5 py-1 rounded-full border border-white/20 select-none z-10 pointer-events-none">
                    {selectedGalleryIdx + 1} / {currentProductMedia.length}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails (Images & Videos) */}
              {currentProductMedia.length > 1 && (
                <div className="flex items-center justify-center gap-2.5 max-w-[500px] w-full pt-1 overflow-x-auto py-1">
                  {currentProductMedia.map((m: any, gIdx: number) => (
                    <button
                      key={gIdx}
                      onClick={() => setSelectedGalleryIdx(gIdx)}
                      className={`relative w-14 h-17 sm:w-16 sm:h-20 shrink-0 bg-[#e9e2d8] overflow-hidden border transition-all cursor-pointer ${
                        selectedGalleryIdx === gIdx 
                          ? 'border-[#965438] ring-2 ring-[#965438] scale-102 shadow-xs' 
                          : 'border-[#e0d6c8] hover:border-[#28221e] opacity-70 hover:opacity-100'
                      }`}
                    >
                      {m.media_type === 'video' ? (
                        <div className="w-full h-full bg-[#28221e] flex flex-col items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-white" />
                          <span className="text-[8px] uppercase tracking-wider mt-0.5 font-bold">REEL</span>
                        </div>
                      ) : (
                        <img src={m.image_url} alt={`View ${gIdx + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Details, Specifications, & Purchasing Suite */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-7 lg:sticky lg:top-24">
              
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-[#736b63] mb-2">
                  <span className="uppercase tracking-[0.25em] font-semibold text-[#965438]">
                    {selectedProduct.category || 'HANDCRAFTED APPAREL'}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#443c37]">
                    <div className="flex text-[#e5973b]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="ml-1">4.9 (42)</span>
                  </div>
                </div>

                {/* Product Name */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#28221e] tracking-tight leading-tight">
                  {selectedProduct.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl sm:text-3xl font-normal text-[#28221e]">
                    ₹ {selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#736b63] font-light">Inclusive of all taxes</span>
                </div>

                {/* Story Description */}
                <p className="text-sm text-[#554b44] mt-5 leading-relaxed font-light">
                  {selectedProduct.description || 'Thoughtfully cut from pure breathable cotton, elevated with handcrafted thread embroidery, inspired by age-old craft and tailored for modern silhouettes.'}
                </p>

                {/* Color Palette Display */}
                <div className="mt-6 pt-6 border-t border-[#e6dfd5]/80">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#443c37] block mb-2.5">
                    Artisan Colorway
                  </span>
                  <div className="flex items-center gap-2">
                    {(selectedProduct.colors || ['#e5973b', '#b8b5b0', '#d8caa8']).map((clr, cIdx) => (
                      <span 
                        key={cIdx}
                        className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-black/20 shadow-xs inline-block"
                        style={{ backgroundColor: clr }}
                      />
                    ))}
                    <span className="text-xs text-[#736b63] ml-2 font-mono">Natural Plant & Fiber Tones</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#443c37]">
                      Select Size: <span className="font-bold text-[#965438]">{selectedSize}</span>
                    </span>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs underline text-[#736b63] hover:text-[#965438] flex items-center gap-1 cursor-pointer transition"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {(selectedProduct.available_sizes.length > 0 ? selectedProduct.available_sizes : ['S', 'M', 'L']).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 text-xs font-medium uppercase border transition-all cursor-pointer ${
                          selectedSize === sz 
                            ? 'border-[#965438] bg-[#965438] text-white shadow-xs' 
                            : 'border-[#d2c7bd] text-[#28221e] hover:border-[#28221e] bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  {/* Scarcity / Small Batch note */}
                  <p className="text-[11px] text-[#965438] mt-2.5 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Conscious small batch: Limited pieces remain in size {selectedSize}.</span>
                  </p>
                </div>

                {/* Quantity Selector & Action Buttons */}
                <div className="mt-8 space-y-3.5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#d2c7bd] bg-white h-12 px-3">
                      <button 
                        onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                        className="p-1 hover:text-[#965438] transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-mono font-medium">{productQuantity}</span>
                      <button 
                        onClick={() => setProductQuantity(productQuantity + 1)}
                        className="p-1 hover:text-[#965438] transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => addToCart(selectedProduct, selectedSize, productQuantity)}
                      className="flex-1 bg-[#965438] hover:bg-[#80442c] text-white h-12 text-xs uppercase tracking-[0.22em] font-medium transition flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow"
                    >
                      <span>ADD TO BAG</span>
                      <span>•</span>
                      <span>₹ {(selectedProduct.price * productQuantity).toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, selectedSize, productQuantity);
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-[#28221e] hover:bg-black text-[#fbf9f5] h-12 text-xs uppercase tracking-[0.22em] font-medium transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                  >
                    <span>BUY IT NOW (EXPRESS CHECKOUT)</span>
                  </button>
                </div>

                {/* Fast Highlights */}
                <div className="mt-8 p-4 bg-[#ede5dc]/60 border border-[#e2d7cb] space-y-2.5 text-xs text-[#554b44]">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#965438] shrink-0" />
                    <span>Free shipping across India on orders over ₹ 5,000. Dispatched in 24–48 hours.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className="w-4 h-4 text-[#965438] shrink-0" />
                    <span>Easy 7-day hassle-free size exchange & returns.</span>
                  </div>
                </div>

                {/* Collapsible Accordion Tabs */}
                <div className="mt-8 border-t border-[#e6dfd5] divide-y divide-[#e6dfd5]">
                  <div className="py-4">
                    <button 
                      onClick={() => setActiveTab(activeTab === 'craft' ? ('' as any) : 'craft')}
                      className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                    >
                      <span>CRAFTSMANSHIP &amp; FABRIC</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'craft' ? 'rotate-180 text-[#965438]' : ''}`} />
                    </button>
                    {activeTab === 'craft' && (
                      <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                        <p><strong>Fabric:</strong> {selectedProduct.fabric || '100% Breathable Long-Staple Cotton'}.</p>
                        <p><strong>Artisan Technique:</strong> {selectedProduct.artisan_technique || 'Hand-embroidered threadwork executed with colorfast natural and cotton threads'}.</p>
                        <p><strong>Hardware:</strong> Hand-finished mother-of-pearl buttons with reinforced cross-stitching.</p>
                      </div>
                    )}
                  </div>

                  <div className="py-4">
                    <button 
                      onClick={() => setActiveTab(activeTab === 'fit' ? ('' as any) : 'fit')}
                      className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                    >
                      <span>FIT &amp; SILHOUETTE GUIDE</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'fit' ? 'rotate-180 text-[#965438]' : ''}`} />
                    </button>
                    {activeTab === 'fit' && (
                      <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                        <p>Designed for a relaxed contemporary unisex silhouette with gentle drape.</p>
                        <p>Model is 5'10" and wearing Size M (Chest 40", Shirt Length 28.5").</p>
                        <p>If you prefer an oversized street-style drape, we suggest ordering one size up.</p>
                      </div>
                    )}
                  </div>

                  <div className="py-4">
                    <button 
                      onClick={() => setActiveTab(activeTab === 'shipping' ? ('' as any) : 'shipping')}
                      className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                    >
                      <span>SHIPPING &amp; EASY EXCHANGES</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'shipping' ? 'rotate-180 text-[#965438]' : ''}`} />
                    </button>
                    {activeTab === 'shipping' && (
                      <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                        <p>Domestic orders are delivered within 3–5 business days via express courier.</p>
                        <p>Worldwide international shipping calculated at checkout (typically 7–10 days).</p>
                        <p>Complimentary 7-day exchanges if you need an alternative size.</p>
                      </div>
                    )}
                  </div>

                  <div className="py-4">
                    <button 
                      onClick={() => setActiveTab(activeTab === 'care' ? ('' as any) : 'care')}
                      className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] font-semibold text-[#28221e] cursor-pointer"
                    >
                      <span>GARMENT CARE INSTRUCTIONS</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'care' ? 'rotate-180 text-[#965438]' : ''}`} />
                    </button>
                    {activeTab === 'care' && (
                      <div className="pt-3 text-xs text-[#655d56] leading-relaxed space-y-2 animate-fadeIn font-light">
                        <p>Hand wash cold with similar light colors using a mild eco-friendly detergent.</p>
                        <p>Line dry inside out in shaded breeze to protect color vibrancy.</p>
                        <p>Warm iron on reverse side; avoid ironing directly on embroidery motifs.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RELATED PRODUCTS ("You May Also Admire") */}
          <section className="mt-28 pt-16 border-t border-[#e6dfd5]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#736b63] block mb-1">
                  CURATED DISCOVERIES
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#28221e] font-normal">
                  You May Also Admire
                </h2>
              </div>
              <button 
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#28221e] hover:text-[#965438] transition cursor-pointer"
              >
                <span>EXPLORE ALL PIECES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((shirt) => (
                <div 
                  key={shirt.id} 
                  className="group flex flex-col cursor-pointer"
                  onClick={() => openProductPage(shirt)}
                >
                  <div className="relative aspect-[3/4] bg-[#e9e2d8] overflow-hidden mb-3.5 border border-[#e2d8cc]">
                    <img 
                      src={shirt.primary_image_url} 
                      alt={shirt.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(shirt.id);
                      }}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:text-[#df8f9f] transition shadow-sm cursor-pointer"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 ${
                          wishlist.includes(shirt.id) ? 'fill-[#df8f9f] text-[#df8f9f]' : 'text-white'
                        }`} 
                      />
                    </button>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#8a7f76]">
                    {shirt.category}
                  </span>
                  <h3 className="font-serif text-lg text-[#28221e] font-normal group-hover:text-[#965438] transition-colors leading-snug mt-1">
                    {shirt.name}
                  </h3>
                  <p className="text-sm font-normal text-[#28221e] mt-0.5">
                    ₹ {shirt.price.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </main>
      )}

      {/* ========================================================================= */}
      {/* 4. NEWSLETTER SECTION */}
      {/* ========================================================================= */}
      <section className="relative bg-[#3e2417] text-[#fbf9f5] overflow-hidden py-16 lg:py-24">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-48 lg:w-64 opacity-25 pointer-events-none text-[#d6b79e]">
          <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 200 C40 180 80 120 120 40" />
            <path d="M50 160 C70 140 120 130 150 110 C140 140 100 165 70 170" />
            <path d="M75 130 C105 100 160 90 190 70 C170 105 130 130 95 138" />
            <path d="M90 95 C120 70 160 55 180 20 C160 50 120 75 100 85" />
            <path d="M30 220 C60 250 110 290 160 330 C130 310 90 280 45 235" />
            <path d="M60 260 C90 300 140 350 180 390 C150 360 110 320 75 275" />
            <path d="M20 190 C-10 160 -10 100 20 60 C30 90 25 140 15 180" />
          </svg>
        </div>

        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 lg:w-64 opacity-25 pointer-events-none text-[#d6b79e]">
          <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M190 200 C160 180 120 120 80 40" />
            <path d="M150 160 C130 140 80 130 50 110 C60 140 100 165 130 170" />
            <path d="M125 130 C95 100 40 90 10 70 C30 105 70 130 105 138" />
            <path d="M110 95 C80 70 40 55 20 20 C40 50 80 75 100 85" />
            <path d="M170 220 C140 250 90 290 40 330 C70 310 110 280 155 235" />
            <path d="M140 260 C110 300 60 350 20 390 C50 360 90 320 125 275" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#cbb8ad] block mb-2">
              STAY CONNECTED
            </span>
            <div className="w-8 h-[1px] bg-[#cbb8ad]/50 mb-5" />
            
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-normal text-[#fbf9f5] tracking-tight">
              Join Our <br />
              Newsletter
            </h2>
            
            <p className="text-[#cbb8ad] text-sm sm:text-base leading-relaxed mt-5 mb-8 font-light max-w-md">
              Be the first to know about new arrivals, exclusive drops, styling inspiration and stories from our world.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch gap-0 max-w-md">
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  className="bg-transparent border border-[#6b4737] focus:border-[#965438] text-xs uppercase tracking-[0.2em] px-5 py-3.5 text-[#fbf9f5] placeholder:text-[#9f8577] focus:outline-none flex-1 transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-[#965438] hover:bg-[#80442c] text-white text-xs uppercase tracking-[0.22em] font-medium px-7 py-3.5 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm sm:border-l-0"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div 
                onClick={() => setNewsletterAgreed(!newsletterAgreed)}
                className="flex items-start gap-2.5 pt-1 cursor-pointer select-none group"
              >
                <div className={`w-4 h-4 rounded-xs border flex items-center justify-center mt-0.5 transition-colors ${
                  newsletterAgreed 
                    ? 'bg-[#965438] border-[#965438] text-white' 
                    : 'border-[#8d6957] bg-transparent'
                }`}>
                  {newsletterAgreed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] sm:text-xs text-[#cbb8ad] leading-normal font-light">
                  I'd like to receive updates, styling ideas and exclusive offers from Nauvaaya.
                </span>
              </div>

              {newsletterSuccess && (
                <p className="text-xs text-[#d8b89d] font-medium pt-1">
                  ✓ Welcome to the Nauvaaya circle. Thank you for subscribing!
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-t-[180px] lg:rounded-t-[220px] overflow-hidden border border-[#5c3a2a] shadow-2xl bg-[#2e1a10]">
              <img 
                src="http://127.0.0.1:8000/static/products/paper-and-poppy/2.png" 
                alt="Artisanal Handcrafted Apparel Still Life"
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MAIN FOOTER */}
      {/* ========================================================================= */}
      <footer className="relative bg-[#f7f4ee] text-[#28221e] pt-16 lg:pt-20 pb-8 border-t border-[#e6dfd5]/80 overflow-hidden">
        <div className="absolute right-0 bottom-12 w-64 lg:w-80 opacity-20 pointer-events-none text-[#736b63]">
          <svg viewBox="0 0 240 320" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M220 300 C180 260 140 180 150 80" />
            <path d="M160 200 C130 190 90 195 70 215 C80 195 120 180 155 185" />
            <path d="M150 130 C120 115 80 120 60 140 C70 120 110 105 145 118" />
            <circle cx="150" cy="70" r="16" />
            <circle cx="150" cy="70" r="26" strokeDasharray="3 3" />
            <path d="M140 60 C135 45 145 35 155 35 C165 35 170 45 165 60" />
            <path d="M130 75 C115 70 110 80 115 90 C120 100 130 95 140 85" />
            <path d="M170 75 C185 70 190 80 185 90 C180 100 170 95 160 85" />
          </svg>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
            
            <div className="lg:col-span-4 flex flex-col items-start lg:pr-8">
              <button 
                onClick={() => navigateTo('home')}
                className="flex flex-col items-start cursor-pointer group text-left"
              >
                <img 
                  src="/logo.png" 
                  alt="Nauvaaya" 
                  className="h-20 sm:h-24 w-auto object-contain -ml-2 mb-2 group-hover:opacity-90 transition-opacity" 
                />
              </button>

              <div className="mt-4 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#736b63] font-medium leading-relaxed">
                <p>TRADITION IN EVERY THREAD</p>
                <p>A STORY IN EVERY WEAR</p>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a 
                  href="https://pinterest.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Pinterest"
                  className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a 
                  href="https://whatsapp.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full border border-[#8a8076]/40 flex items-center justify-center text-[#443c37] hover:text-[#965438] hover:border-[#965438] transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.42.09-.13.19-.49.61-.6.74-.11.13-.22.15-.41.06-.19-.09-.79-.29-1.51-.93-.56-.5-.94-1.11-1.06-1.31-.12-.2-.01-.31.08-.4.09-.09.19-.22.28-.33.1-.11.13-.19.19-.31.07-.13.03-.24-.02-.33-.05-.09-.42-1.01-.58-1.39-.15-.36-.31-.31-.42-.32h-.36c-.12 0-.32.05-.49.23-.17.19-.65.64-.65 1.56s.67 1.81.76 1.94c.09.13 1.32 2.01 3.2 2.82.45.19.8.31 1.07.4.45.14.86.12 1.18.07.36-.05 1.12-.46 1.28-.9.16-.45.16-.83.11-.91-.04-.08-.17-.13-.36-.23z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="hidden lg:block w-[1px] bg-[#e6dfd5] self-stretch -mr-4" />

            <div className="lg:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#28221e] block">
                SHOP
              </span>
              <div className="w-5 h-[1.5px] bg-[#28221e]/30 mt-1.5 mb-5" />
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#554b44]">
                <li>
                  <button onClick={() => navigateTo('shop', 'All')} className="hover:text-[#965438] transition cursor-pointer text-left">
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('shop', 'Shirts')} className="hover:text-[#965438] transition cursor-pointer text-left">
                    Shirts
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('shop', 'Embroidered Pieces')} className="hover:text-[#965438] transition cursor-pointer text-left">
                    Embroidered Pieces
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('shop', 'Statement Shirts')} className="hover:text-[#965438] transition cursor-pointer text-left">
                    Statement Shirts
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('shop', 'Exclusive Collections')} className="hover:text-[#965438] transition cursor-pointer text-left">
                    Exclusive Collections
                  </button>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#28221e] block">
                ABOUT
              </span>
              <div className="w-5 h-[1.5px] bg-[#28221e]/30 mt-1.5 mb-5" />
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#554b44]">
                <li><a href="#story" className="hover:text-[#965438] transition">Our Story</a></li>
                <li><a href="#journal" className="hover:text-[#965438] transition">Our Journal</a></li>
                <li><a href="#craft" className="hover:text-[#965438] transition">Craft & Culture</a></li>
                <li><a href="#sustainability" className="hover:text-[#965438] transition">Sustainability</a></li>
                <li><a href="#contact" className="hover:text-[#965438] transition">Contact Us</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#28221e] block">
                CUSTOMER CARE
              </span>
              <div className="w-5 h-[1.5px] bg-[#28221e]/30 mt-1.5 mb-5" />
              <ul className="space-y-3 text-xs sm:text-[13px] text-[#554b44]">
                <li><a href="#faqs" className="hover:text-[#965438] transition">FAQs</a></li>
                <li><a href="#shipping" className="hover:text-[#965438] transition">Shipping & Delivery</a></li>
                <li><a href="#returns" className="hover:text-[#965438] transition">Returns & Exchanges</a></li>
                <li><a href="#size-guide" className="hover:text-[#965438] transition">Size Guide</a></li>
                <li><a href="#care" className="hover:text-[#965438] transition">Care Instructions</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-[#e6dfd5] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#736b63] gap-4">
            <div>
              © 2026 Nauvaaya. All Rights Reserved.
            </div>

            <div className="flex items-center gap-3">
              <a href="#privacy" className="hover:text-[#28221e] transition">Privacy Policy</a>
              <span className="opacity-40">|</span>
              <a href="#terms" className="hover:text-[#28221e] transition">Terms & Conditions</a>
              <span className="opacity-40">|</span>
              <a href="#sitemap" className="hover:text-[#28221e] transition">Sitemap</a>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Designed with</span>
              <Heart className="w-3.5 h-3.5 text-[#965438] stroke-[1.5] inline-block" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 6. SIZE GUIDE MODAL */}
      {/* ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#fcfbf9] border border-[#e4dcce] max-w-lg w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#736b63] hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#965438] font-semibold">
              ACCURATE SIZING
            </span>
            <h3 className="font-serif text-2xl text-[#28221e] mt-1 mb-2">Shirt Measurements (Inches)</h3>
            <p className="text-xs text-[#736b63] mb-6 font-light">
              Measurements taken with garment lying flat. We recommend comparing with your favorite fitting shirt.
            </p>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6dfd5] text-[#28221e] uppercase tracking-wider text-[11px]">
                  <th className="py-2.5">Size</th>
                  <th className="py-2.5">Chest</th>
                  <th className="py-2.5">Length</th>
                  <th className="py-2.5">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee7de] text-[#554b44]">
                <tr>
                  <td className="py-2.5 font-bold text-[#28221e]">S (Small)</td>
                  <td className="py-2.5">38"</td>
                  <td className="py-2.5">27.5"</td>
                  <td className="py-2.5">17.5"</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-[#28221e]">M (Medium)</td>
                  <td className="py-2.5">40"</td>
                  <td className="py-2.5">28.5"</td>
                  <td className="py-2.5">18.5"</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-[#28221e]">L (Large)</td>
                  <td className="py-2.5">42"</td>
                  <td className="py-2.5">29.5"</td>
                  <td className="py-2.5">19.5"</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-[#28221e]">XL</td>
                  <td className="py-2.5">44"</td>
                  <td className="py-2.5">30.5"</td>
                  <td className="py-2.5">20.5"</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full bg-[#965438] text-white py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#80442c] transition cursor-pointer"
            >
              GOT IT, RETURN TO SHIRT
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SHOPPING BAG DRAWER */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fcfbf9] h-full shadow-2xl flex flex-col justify-between p-6 border-l border-[#e4dcce]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#e6dfd5]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#965438]" />
                <h3 className="font-serif text-xl tracking-tight">Your Bag ({cartItemCount})</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:text-[#965438] transition cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[#736b63]">
                  <p className="font-serif text-lg">Your bag is currently empty.</p>
                  <p className="text-xs mt-1">Explore our shirts and add your favorites.</p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('shop');
                    }}
                    className="mt-5 inline-block bg-[#965438] text-white text-xs uppercase tracking-[0.2em] font-medium px-5 py-2.5 hover:bg-[#80442c] transition cursor-pointer"
                  >
                    EXPLORE SHIRTS
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.variant_id} className="flex gap-4 pb-4 border-b border-[#f0eae1]">
                    <img src={item.image_url} alt={item.name} className="w-20 h-24 object-cover bg-[#e9e2d8]" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-[#736b63] mt-0.5">Size: <span className="font-semibold text-[#28221e]">{item.size}</span></p>
                        <p className="text-xs font-normal text-[#28221e] mt-1">₹ {item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.variant_id, -1)}
                          className="w-6 h-6 border border-[#d2c7bd] flex items-center justify-center hover:bg-black hover:text-white transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variant_id, 1)}
                          className="w-6 h-6 border border-[#d2c7bd] flex items-center justify-center hover:bg-black hover:text-white transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#e6dfd5] space-y-4">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-[#736b63] uppercase tracking-wider text-xs">Subtotal</span>
                  <span className="font-serif text-xl font-bold">₹ {cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-[#736b63]">Taxes and shipping calculated at checkout.</p>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[#965438] text-white py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#80442c] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CHECKOUT MODAL (WIRED TO POST /api/v1/orders/checkout) */}
      {/* ========================================================================= */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ========================================================================= */}
      {/* 9. ORDER CONFIRMATION SCREEN */}
      {/* ========================================================================= */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E0D5C7] max-w-lg w-full p-8 text-center shadow-2xl relative my-8">
            <div className="w-16 h-16 rounded-full bg-[#ede5dc] border border-[#dcd3c7] mx-auto flex items-center justify-center text-[#965438] mb-4">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.28em] text-[#965438] font-semibold block mb-1">
              ORDER CONFIRMED
            </span>
            <h3 className="font-serif text-3xl text-[#28221e]">Thank You for Your Order</h3>
            
            <p className="text-xs text-stone-600 mt-2 font-light max-w-sm mx-auto">
              Dear <strong className="font-semibold text-stone-800">{completedOrder.customer_name}</strong>, your order has been registered and inventory has been reserved.
            </p>

            <div className="mt-5 p-4 bg-white/80 border border-[#E0D5C7] text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#E0D5C7]/70 text-xs">
                <span className="text-stone-500 uppercase tracking-wider text-[10px]">Order Reference</span>
                <span className="font-mono text-[11px] font-semibold text-[#965438] bg-[#FAF7F2] px-2 py-0.5 border border-[#E0D5C7]">
                  {completedOrder.id}
                </span>
              </div>

              <div className="py-3 border-b border-[#E0D5C7]/70 space-y-2 text-xs">
                <span className="text-stone-500 uppercase tracking-wider text-[10px] block">Items Reserved</span>
                {completedOrder.items?.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-stone-800">
                    <span>
                      {it.product_name} <span className="text-stone-500">(Size {it.size} × {it.quantity})</span>
                    </span>
                    <span className="font-serif font-medium">₹ {(it.unit_price * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-between items-baseline text-sm">
                <span className="text-stone-700 font-medium text-xs uppercase tracking-wider">Total Paid</span>
                <span className="font-serif text-xl font-bold text-[#28221e]">
                  ₹ {completedOrder.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 mt-3 font-light">
              Confirmation receipt sent to <strong className="text-stone-700">{completedOrder.email}</strong>.
            </p>

            <button
              onClick={() => setCompletedOrder(null)}
              className="mt-6 w-full bg-[#28221e] text-white py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-black transition cursor-pointer shadow-sm"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}

    </div>
  );
}