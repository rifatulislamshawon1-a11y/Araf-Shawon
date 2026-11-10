export type CategoryId =
  | 'all'
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'grocery'
  | 'beauty'
  | 'accessories';

export type GroceryAisleId =
  | 'all'
  | 'staples'
  | 'produce'
  | 'protein'
  | 'oils-spices'
  | 'fruits';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export type AreaName =
  | 'All Areas'
  | 'Gulshan & Banani'
  | 'Dhanmondi'
  | 'Uttara'
  | 'Mirpur'
  | 'Chattogram';

export interface Category {
  id: CategoryId;
  name: string;
  countLabel: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  vendorId: string;
  vendorName: string;
  vendorDistrict: string;
  price: number;
  originalPrice?: number;
  rating: number;
  soldCount: number;
  image: string;
  variants: string[];
  stockNote: string;
  description: string;
  deliveryEstimate: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  aisle: Exclude<GroceryAisleId, 'all'>;
  aisleLabel: string;
  unit: string;
  origin: string;
  vendorId: string;
  vendorName: string;
  price: number;
  originalPrice?: number;
  image: string;
  stockNote: string;
  description: string;
}

export interface NearbyShop {
  id: string;
  name: string;
  area: Exclude<AreaName, 'All Areas'>;
  address: string;
  distanceKm: number;
  openUntil: string;
  specialty: string;
  rating: number;
  ordersCompleted: string;
  deliveryEta: string;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  vendorName: string;
  price: number;
  image: string;
  variantOrUnit: string;
  quantity: number;
  isGrocery?: boolean;
}

export interface AuthUser {
  name: string;
  phoneOrEmail: string;
  district: string;
}
