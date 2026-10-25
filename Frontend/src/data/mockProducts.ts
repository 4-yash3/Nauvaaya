import type { Product } from '../types';

export const SUPABASE_STORAGE_URL = 'https://vujpzldubtgaikeawidk.supabase.co/storage/v1/object/public/Products';

// Curated artisan metadata mapping for the database products
export const PRODUCT_METADATA: Record<string, Partial<Product>> = {
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
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'f8896d77-2604-4066-b76d-aac9d9e2bd74',
    name: 'Sun and Script',
    slug: 'sun-and-script',
    price: 1499,
    primary_image_url: `${SUPABASE_STORAGE_URL}/sun-and-script/1.png`,
    gallery_urls: [
      `${SUPABASE_STORAGE_URL}/sun-and-script/1.png`,
      `${SUPABASE_STORAGE_URL}/sun-and-script/2.png`,
      `${SUPABASE_STORAGE_URL}/sun-and-script/3.png`,
      `${SUPABASE_STORAGE_URL}/sun-and-script/4.png`
    ],
    media: [
      { image_url: `${SUPABASE_STORAGE_URL}/sun-and-script/1.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/sun-and-script/2.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/sun-and-script/3.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/sun-and-script/4.png`, media_type: 'image' }
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
    primary_image_url: `${SUPABASE_STORAGE_URL}/paper-and-poppy/1.png`,
    gallery_urls: [
      `${SUPABASE_STORAGE_URL}/paper-and-poppy/1.png`,
      `${SUPABASE_STORAGE_URL}/paper-and-poppy/2.png`,
      `${SUPABASE_STORAGE_URL}/paper-and-poppy/3.png`,
      `${SUPABASE_STORAGE_URL}/paper-and-poppy/4.png`,
      `${SUPABASE_STORAGE_URL}/paper-and-poppy/video.mp4`
    ],
    media: [
      { image_url: `${SUPABASE_STORAGE_URL}/paper-and-poppy/1.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/paper-and-poppy/2.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/paper-and-poppy/3.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/paper-and-poppy/4.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/paper-and-poppy/video.mp4`, media_type: 'video' }
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
    primary_image_url: `${SUPABASE_STORAGE_URL}/the-back-story-edit/1.png`,
    gallery_urls: [
      `${SUPABASE_STORAGE_URL}/the-back-story-edit/1.png`,
      `${SUPABASE_STORAGE_URL}/the-back-story-edit/2.png`,
      `${SUPABASE_STORAGE_URL}/the-back-story-edit/3.png`,
      `${SUPABASE_STORAGE_URL}/the-back-story-edit/4.png`,
      `${SUPABASE_STORAGE_URL}/the-back-story-edit/video.mp4`
    ],
    media: [
      { image_url: `${SUPABASE_STORAGE_URL}/the-back-story-edit/1.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-back-story-edit/2.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-back-story-edit/3.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-back-story-edit/4.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-back-story-edit/video.mp4`, media_type: 'video' }
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
    primary_image_url: `${SUPABASE_STORAGE_URL}/the-statement-spine/1.png`,
    gallery_urls: [
      `${SUPABASE_STORAGE_URL}/the-statement-spine/1.png`,
      `${SUPABASE_STORAGE_URL}/the-statement-spine/2.png`,
      `${SUPABASE_STORAGE_URL}/the-statement-spine/3.png`,
      `${SUPABASE_STORAGE_URL}/the-statement-spine/4.png`,
      `${SUPABASE_STORAGE_URL}/the-statement-spine/video.mp4`
    ],
    media: [
      { image_url: `${SUPABASE_STORAGE_URL}/the-statement-spine/1.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-statement-spine/2.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-statement-spine/3.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-statement-spine/4.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/the-statement-spine/video.mp4`, media_type: 'video' }
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
    primary_image_url: `${SUPABASE_STORAGE_URL}/threaded-banter/1.png`,
    gallery_urls: [
      `${SUPABASE_STORAGE_URL}/threaded-banter/1.png`,
      `${SUPABASE_STORAGE_URL}/threaded-banter/2.png`,
      `${SUPABASE_STORAGE_URL}/threaded-banter/3.png`,
      `${SUPABASE_STORAGE_URL}/threaded-banter/4.png`
    ],
    media: [
      { image_url: `${SUPABASE_STORAGE_URL}/threaded-banter/1.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/threaded-banter/2.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/threaded-banter/3.png`, media_type: 'image' },
      { image_url: `${SUPABASE_STORAGE_URL}/threaded-banter/4.png`, media_type: 'image' }
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

export const CATEGORIES = [
  {
    title: 'SHIRTS',
    image: `${SUPABASE_STORAGE_URL}/paper-and-poppy/1.png`,
    categoryKey: 'Shirts'
  },
  {
    title: 'EMBROIDERED PIECES',
    image: `${SUPABASE_STORAGE_URL}/threaded-banter/1.png`,
    categoryKey: 'Embroidered Pieces'
  },
  {
    title: 'EXCLUSIVE COLLECTIONS',
    image: `${SUPABASE_STORAGE_URL}/sun-and-script/1.png`,
    categoryKey: 'Exclusive Collections'
  },
  {
    title: 'STATEMENT SHIRTS',
    image: `${SUPABASE_STORAGE_URL}/the-statement-spine/1.png`,
    categoryKey: 'Statement Shirts'
  }
];

export const ANNOUNCEMENTS = [
  "✧ LIMITED PIECES   |   CRAFTED IN SMALL BATCHES   |   WORLDWIDE SHIPPING",
  "✧ HANDCRAFTED EMBROIDERY   |   PURE ARTISANAL COTTON   |   SHIPS IN 48 HOURS",
  "✧ COMPLIMENTARY SHIPPING ON ORDERS OVER ₹ 5,000   |   EASY EXCHANGES"
];

