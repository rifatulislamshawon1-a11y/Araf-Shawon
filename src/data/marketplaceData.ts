import heroMarketplaceShowcase from '@/src/assets/images/hero_marketplace_showcase_1794326190613.jpg';
import prodEarbudsPro from '@/src/assets/images/prod_earbuds_pro_1794326190541.jpg';
import prodSmartwatchSlate from '@/src/assets/images/prod_smartwatch_slate_1794326191293.jpg';
import prodJamdaniPanjabi from '@/src/assets/images/prod_jamdani_panjabi_1794326191717.jpg';
import prodLeatherBackpack from '@/src/assets/images/prod_leather_backpack_1794326192285.jpg';
import prodMechanicalKeyboard from '@/src/assets/images/prod_mechanical_keyboard_1794326192336.jpg';
import prodCeramicTeaSet from '@/src/assets/images/prod_ceramic_tea_set_1794326191582.jpg';
import prodSkincareSerum from '@/src/assets/images/prod_skincare_serum_1794326192644.jpg';
import prodDeskLamp from '@/src/assets/images/prod_desk_lamp_1794326192608.jpg';
import groceryMiniketRice from '@/src/assets/images/grocery_miniket_rice_1794326193322.jpg';
import groceryFreshVegetables from '@/src/assets/images/grocery_fresh_vegetables_1794326193277.jpg';
import groceryRiverFish from '@/src/assets/images/grocery_river_fish_1794326194404.jpg';
import groceryMustardOilSpices from '@/src/assets/images/grocery_mustard_oil_spices_1794326194063.jpg';
import groceryMangoesBasket from '@/src/assets/images/grocery_mangoes_basket_1794326194825.jpg';
import shopElectronicsHub from '@/src/assets/images/shop_electronics_hub_1794326195734.jpg';
import shopArtisanCraft from '@/src/assets/images/shop_artisan_craft_1794326195912.jpg';
import shopFreshMart from '@/src/assets/images/shop_fresh_mart_1794326195723.jpg';

import type {
  AreaName,
  Category,
  GroceryAisleId,
  GroceryItem,
  NearbyShop,
  Product,
  ShopAreaFilter,
} from '../types/marketplace';

export const HERO_SHOWCASE_IMAGE = heroMarketplaceShowcase;

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Marketplace',
    countLabel: '14 curated items',
    description: 'Browse verified products across all categories',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    countLabel: 'Audio, watches & desk gear',
    description: 'Authentic consumer tech with local warranty',
  },
  {
    id: 'fashion',
    name: 'Fashion & Loom',
    countLabel: 'Handloom & apparel',
    description: 'Bangladeshi heritage Jamdani and everyday wear',
  },
  {
    id: 'home',
    name: 'Home & Living',
    countLabel: 'Lighting & ceramics',
    description: 'Stoneware dining and minimalist workspace lights',
  },
  {
    id: 'accessories',
    name: 'Bags & Carry',
    countLabel: 'Leather & waxed canvas',
    description: 'Weather-ready commuter bags crafted for daily travel',
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    countLabel: 'Botanical skincare',
    description: 'Gentle formulations curated for humid climates',
  },
  {
    id: 'grocery',
    name: 'Daily Bazar',
    countLabel: 'Same-day fresh kitchen',
    description: 'Rice, seasonal fruit, river fish, and pantry oils',
  },
];

export const MARKETPLACE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aethel ANC Wireless Earbuds Pro',
    category: 'electronics',
    categoryLabel: 'Electronics',
    vendorId: 'shop-1',
    vendorName: 'TechNova Cumilla',
    vendorDistrict: 'Kandirpar, Cumilla',
    price: 3850,
    originalPrice: 4500,
    rating: 4.9,
    soldCount: 412,
    image: prodEarbudsPro,
    variants: ['Matte Charcoal', 'Warm Stone'],
    stockNote: 'In Stock · 1-Year Official Warranty',
    description:
      'Active noise cancellation up to 42dB, 34-hour pocket charging case, and dual-mic voice clarity tuned for busy Cumilla commutes.',
    deliveryEstimate: 'Same-day in Cumilla · 2–3 days nationwide',
  },
  {
    id: 'prod-2',
    name: 'Heritage Handloom Cotton Jamdani Panjabi',
    category: 'fashion',
    categoryLabel: 'Fashion & Loom',
    vendorId: 'shop-2',
    vendorName: 'Mainamati Khadi & Loom',
    vendorDistrict: 'Cumilla Sadar',
    price: 2950,
    originalPrice: 3400,
    rating: 4.8,
    soldCount: 286,
    image: prodJamdaniPanjabi,
    variants: ['Size M', 'Size L', 'Size XL'],
    stockNote: 'Small Batch · Handwoven Heritage',
    description:
      'Breathable 80-count handloom cotton with geometric emerald Jamdani motifs along the placket and collar, tailored for tropical weather.',
    deliveryEstimate: 'Same-day in Cumilla · 2–4 days nationwide',
  },
  {
    id: 'prod-3',
    name: 'Krono Slate Fitness & Health Watch',
    category: 'electronics',
    categoryLabel: 'Electronics',
    vendorId: 'shop-4',
    vendorName: 'Kotbari Audio & Tech',
    vendorDistrict: 'Kotbari, Cumilla',
    price: 6490,
    originalPrice: 7200,
    rating: 4.7,
    soldCount: 194,
    image: prodSmartwatchSlate,
    variants: ['Forest Woven Strap', 'Obsidian Silicone'],
    stockNote: 'In Stock · 5ATM Water Resistant',
    description:
      'Anodized aluminum bezel with always-on AMOLED display, heart rate and SpO2 tracking, plus 10-day battery life on a single charge.',
    deliveryEstimate: 'Same-day in Cumilla · 2–3 days nationwide',
  },
  {
    id: 'prod-4',
    name: 'Wayfarer Waxed Canvas & Leather Backpack',
    category: 'accessories',
    categoryLabel: 'Bags & Carry',
    vendorId: 'shop-5',
    vendorName: 'Chouddagram Craft & Carry',
    vendorDistrict: 'Chouddagram, Cumilla',
    price: 4200,
    originalPrice: 4950,
    rating: 4.9,
    soldCount: 318,
    image: prodLeatherBackpack,
    variants: ['Olive & Tan (22L)', 'Charcoal & Espresso (22L)'],
    stockNote: 'In Stock · Fits 16-inch Laptop',
    description:
      'Water-repellent heavy waxed canvas paired with full-grain vegetable-tanned leather straps and padded laptop protection.',
    deliveryEstimate: '1–2 days in Cumilla · 3–4 days nationwide',
  },
  {
    id: 'prod-5',
    name: 'Keycraft 75% Aluminum Mechanical Keyboard',
    category: 'electronics',
    categoryLabel: 'Electronics',
    vendorId: 'shop-1',
    vendorName: 'TechNova Cumilla',
    vendorDistrict: 'Kandirpar, Cumilla',
    price: 7800,
    originalPrice: 8600,
    rating: 4.9,
    soldCount: 165,
    image: prodMechanicalKeyboard,
    variants: ['Tactile Brown Switches', 'Linear Red Switches'],
    stockNote: 'In Stock · Tri-Mode Wireless + USB-C',
    description:
      'CNC-machined aluminum frame with hot-swappable PBT keycaps in slate and forest green, gasket-mounted for quiet, crisp acoustics.',
    deliveryEstimate: 'Same-day in Cumilla · 2–3 days nationwide',
  },
  {
    id: 'prod-6',
    name: 'Rattan-Handle Matte Stoneware Tea Set',
    category: 'home',
    categoryLabel: 'Home & Living',
    vendorId: 'shop-2',
    vendorName: 'Mainamati Khadi & Loom',
    vendorDistrict: 'Cumilla Sadar',
    price: 2150,
    rating: 4.8,
    soldCount: 229,
    image: prodCeramicTeaSet,
    variants: ['Teapot + 2 Cups', 'Teapot + 4 Cups'],
    stockNote: 'In Stock · Hand-Glazed Ceramic',
    description:
      'Kiln-fired matte white stoneware teapot with woven cane handle and matching handleless tasting cups, ideal for Sylheti green or black tea.',
    deliveryEstimate: 'Same-day in Cumilla · Safe double-boxed shipping',
  },
  {
    id: 'prod-7',
    name: 'Botanica Brightening Vitamin C Facial Serum',
    category: 'beauty',
    categoryLabel: 'Beauty & Care',
    vendorId: 'shop-3',
    vendorName: 'Gomti Daily Harvest Bazar',
    vendorDistrict: 'Tomsom Bridge, Cumilla',
    price: 1450,
    originalPrice: 1750,
    rating: 4.7,
    soldCount: 508,
    image: prodSkincareSerum,
    variants: ['30 ml Dropper', '50 ml Value Bottle'],
    stockNote: 'In Stock · Dermatologist Tested',
    description:
      'Lightweight water-based botanical serum with stabilized 15% Vitamin C, hyaluronic acid, and green tea extract for non-greasy daily hydration.',
    deliveryEstimate: '45-min in Cumilla Sadar · 2–3 days nationwide',
  },
  {
    id: 'prod-8',
    name: 'Studio Articulated Matte LED Architect Lamp',
    category: 'home',
    categoryLabel: 'Home & Living',
    vendorId: 'shop-4',
    vendorName: 'Kotbari Audio & Tech',
    vendorDistrict: 'Kotbari, Cumilla',
    price: 3350,
    originalPrice: 3900,
    rating: 4.8,
    soldCount: 142,
    image: prodDeskLamp,
    variants: ['Matte Black', 'Brushed Slate'],
    stockNote: 'In Stock · Stepless Warm-to-Daylight Dimming',
    description:
      'Precision-balanced aluminum study and desk lamp with flicker-free CRI 95 LED bar and weighted desktop base.',
    deliveryEstimate: 'Same-day in Cumilla · 2–3 days nationwide',
  },
];

export const GROCERY_AISLES: { id: GroceryAisleId; label: string }[] = [
  { id: 'all', label: 'All Daily Bazar' },
  { id: 'staples', label: 'Rice & Staples' },
  { id: 'produce', label: 'Fresh Produce' },
  { id: 'protein', label: 'Fish & River Catch' },
  { id: 'oils-spices', label: 'Oils & Whole Spices' },
  { id: 'fruits', label: 'Seasonal Fruit' },
];

export const DAILY_BAZAR_ITEMS: GroceryItem[] = [
  {
    id: 'groc-1',
    name: 'Dinajpur Aged Premium Miniket Rice',
    aisle: 'staples',
    aisleLabel: 'Rice & Staples',
    unit: '5 kg Jute Pack',
    origin: 'Dinajpur Mill Direct',
    vendorId: 'shop-3',
    vendorName: 'Gomti Daily Harvest Bazar',
    price: 425,
    originalPrice: 460,
    image: groceryMiniketRice,
    stockNote: 'Harvested This Season · Stone-Cleaned',
    description:
      'Slender, polished long-grain Dinajpur Miniket rice milled in small batches for fluffy everyday meals.',
  },
  {
    id: 'groc-2',
    name: 'Morning-Harvest Fresh Vegetable Basket',
    aisle: 'produce',
    aisleLabel: 'Fresh Produce',
    unit: '2.5 kg Assorted Box',
    origin: 'Chandina & Burichang Farms',
    vendorId: 'shop-3',
    vendorName: 'Gomti Daily Harvest Bazar',
    price: 290,
    originalPrice: 340,
    image: groceryFreshVegetables,
    stockNote: 'Picked 5:30 AM Today',
    description:
      'Curated daily kitchen crate containing vine tomatoes, green chilies, fresh coriander bunches, tender okra, and purple brinjal.',
  },
  {
    id: 'groc-3',
    name: 'Fresh Padma & Gomti River Fish Steaks',
    aisle: 'protein',
    aisleLabel: 'Fish & River Catch',
    unit: '1 kg Cleaned & Cut',
    origin: 'Chandpur & Gomti Landing',
    vendorId: 'shop-6',
    vendorName: 'Laksam Fresh & Spice Mart',
    price: 890,
    originalPrice: 980,
    image: groceryRiverFish,
    stockNote: 'Chilled Cold-Chain · Ready to Cook',
    description:
      'Freshly dressed river fish steaks packed hygienically on food-grade crushed ice with scales removed and cleaned.',
  },
  {
    id: 'groc-4',
    name: 'Ghani Cold-Pressed Mustard Oil & Spice Pack',
    aisle: 'oils-spices',
    aisleLabel: 'Oils & Whole Spices',
    unit: '1 Litre + 250g Spices',
    origin: 'Cumilla & Sirajganj Press',
    vendorId: 'shop-6',
    vendorName: 'Laksam Fresh & Spice Mart',
    price: 540,
    image: groceryMustardOilSpices,
    stockNote: '100% Pure First-Press',
    description:
      'Pungent wooden-ghani pressed mustard oil paired with green cardamom, Ceylon cinnamon bark, whole turmeric, and sun-dried red chilies.',
  },
  {
    id: 'groc-5',
    name: 'Rajshahi Tree-Ripened Himsagar Mangoes',
    aisle: 'fruits',
    aisleLabel: 'Seasonal Fruit',
    unit: '3 kg Bamboo Crate',
    origin: 'Chapainawabganj Orchard',
    vendorId: 'shop-3',
    vendorName: 'Gomti Daily Harvest Bazar',
    price: 480,
    originalPrice: 550,
    image: groceryMangoesBasket,
    stockNote: 'Carbide-Free · Delivered in Cumilla',
    description:
      'Naturally ripened, fiberless golden Himsagar mangoes packed in breathable woven bamboo baskets and dispatched fresh across Cumilla.',
  },
  {
    id: 'groc-6',
    name: 'Organic Farm Pantry Trio (Rice, Veg & Oil)',
    aisle: 'staples',
    aisleLabel: 'Rice & Staples',
    unit: 'Weekly Family Bundle',
    origin: 'Cumilla Local Farm Network',
    vendorId: 'shop-3',
    vendorName: 'Gomti Daily Harvest Bazar',
    price: 1180,
    originalPrice: 1320,
    image: groceryMiniketRice,
    stockNote: 'Same-Day Cumilla Express Slot',
    description:
      'Essential weekly kitchen restock bundle combining 5 kg Miniket rice, 2.5 kg morning harvest vegetables, and 1L pure cold-pressed mustard oil.',
  },
];

export const NEARBY_SHOPS: NearbyShop[] = [
  {
    id: 'shop-1',
    name: 'TechNova Cumilla',
    area: 'Kandirpar',
    address: 'Sattar Khan Complex, Kandirpar, Cumilla',
    distanceKm: 0.8,
    openUntil: '10:00 PM',
    specialty: 'Official laptops, wireless audio, mechanical keyboards & accessories',
    rating: 4.9,
    ordersCompleted: '3,420 orders',
    deliveryEta: '40–55 min courier',
    image: shopElectronicsHub,
  },
  {
    id: 'shop-2',
    name: 'Mainamati Khadi & Loom',
    area: 'Cumilla Sadar',
    address: 'Rajgonj Road, Cumilla Sadar, Cumilla',
    distanceKm: 1.3,
    openUntil: '9:30 PM',
    specialty: 'Authentic Cumilla Khadi, Jamdani textiles & stoneware dining',
    rating: 4.8,
    ordersCompleted: '2,150 orders',
    deliveryEta: '60–90 min local',
    image: shopArtisanCraft,
  },
  {
    id: 'shop-3',
    name: 'Gomti Daily Harvest Bazar',
    area: 'Tomsom Bridge',
    address: 'EPZ Road, Tomsom Bridge, Cumilla',
    distanceKm: 1.1,
    openUntil: '11:00 PM',
    specialty: 'Daily morning produce, Dinajpur rice, orchard fruit & skincare',
    rating: 4.9,
    ordersCompleted: '6,840 orders',
    deliveryEta: '35–50 min express',
    image: shopFreshMart,
  },
  {
    id: 'shop-4',
    name: 'Kotbari Audio & Tech',
    area: 'Kotbari & Cantonment',
    address: 'University Road, Kotbari, Cumilla',
    distanceKm: 3.4,
    openUntil: '9:30 PM',
    specialty: 'Smartwatches, architectural desk lighting & workspace gear',
    rating: 4.8,
    ordersCompleted: '1,680 orders',
    deliveryEta: '60 min local rider',
    image: shopElectronicsHub,
  },
  {
    id: 'shop-5',
    name: 'Chouddagram Craft & Carry',
    area: 'Chouddagram',
    address: 'Station Road, Chouddagram, Cumilla',
    distanceKm: 2.1,
    openUntil: '9:00 PM',
    specialty: 'Waxed canvas backpacks, Bangladeshi leather goods & everyday travel',
    rating: 4.9,
    ordersCompleted: '1,910 orders',
    deliveryEta: 'Same-day Cumilla',
    image: shopArtisanCraft,
  },
  {
    id: 'shop-6',
    name: 'Laksam Fresh & Spice Mart',
    area: 'Laksam',
    address: 'Bypass Bazar Road, Laksam, Cumilla',
    distanceKm: 1.9,
    openUntil: '10:30 PM',
    specialty: 'Chilled river fish cuts, ghani mustard oil & whole spices',
    rating: 4.8,
    ordersCompleted: '2,730 orders',
    deliveryEta: '45 min in Laksam',
    image: shopFreshMart,
  },
];

export const AREAS: AreaName[] = [
  'Cumilla Sadar',
  'Kandirpar',
  'Kotbari & Cantonment',
  'Tomsom Bridge',
  'Laksam',
  'Chouddagram',
];

export const SHOP_AREA_FILTERS: ShopAreaFilter[] = [
  'All Cumilla',
  ...AREAS,
];

export const AREA_DELIVERY_SLOTS: Record<AreaName, string> = {
  'Cumilla Sadar': 'Express 40-min rider slot in Cumilla Sadar',
  Kandirpar: 'Next slot: Today within 35 mins (Kandirpar & Rajgonj)',
  'Kotbari & Cantonment': 'Next slot: Today 4:00 PM – 5:30 PM',
  'Tomsom Bridge': 'Next slot: Today within 45 mins (Tomsom Bridge & Housing)',
  Laksam: 'Next slot: Today 5:00 PM – 6:30 PM (Laksam)',
  Chouddagram: 'Next slot: Today 5:30 PM – 7:00 PM (Chouddagram)',
};
