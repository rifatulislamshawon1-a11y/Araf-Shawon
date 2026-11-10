import { useEffect, useMemo, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { DailyBazarSection } from './components/DailyBazarSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { NearbyShopsSection } from './components/NearbyShopsSection';
import { ProductModal } from './components/ProductModal';
import { SellerBanner } from './components/SellerBanner';
import { SellerModal } from './components/SellerModal';
import { ShopModal } from './components/ShopModal';
import {
  DAILY_BAZAR_ITEMS,
  MARKETPLACE_PRODUCTS,
} from './data/marketplaceData';
import type {
  AreaName,
  AuthUser,
  CartItem,
  CategoryId,
  GroceryItem,
  NearbyShop,
  Product,
  SortOption,
} from './types/marketplace';

const INITIAL_CART: CartItem[] = [
  {
    id: `${MARKETPLACE_PRODUCTS[0].id}__${MARKETPLACE_PRODUCTS[0].variants[0]}`,
    name: MARKETPLACE_PRODUCTS[0].name,
    vendorName: MARKETPLACE_PRODUCTS[0].vendorName,
    price: MARKETPLACE_PRODUCTS[0].price,
    image: MARKETPLACE_PRODUCTS[0].image,
    variantOrUnit: MARKETPLACE_PRODUCTS[0].variants[0],
    quantity: 1,
    isGrocery: false,
  },
  {
    id: DAILY_BAZAR_ITEMS[0].id,
    name: DAILY_BAZAR_ITEMS[0].name,
    vendorName: DAILY_BAZAR_ITEMS[0].vendorName,
    price: DAILY_BAZAR_ITEMS[0].price,
    image: DAILY_BAZAR_ITEMS[0].image,
    variantOrUnit: DAILY_BAZAR_ITEMS[0].unit,
    quantity: 1,
    isGrocery: true,
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedArea, setSelectedArea] = useState<AreaName>('All Areas');

  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [authModalState, setAuthModalState] = useState<{
    open: boolean;
    mode: 'login' | 'signup';
  }>({ open: false, mode: 'login' });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeShop, setActiveShop] = useState<NearbyShop | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setAuthModalState((prev) => ({ ...prev, open: false }));
        setIsSellerModalOpen(false);
        setActiveProduct(null);
        setActiveShop(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = MARKETPLACE_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === 'grocery' ||
        product.category === selectedCategory;

      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.vendorName.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.vendorDistrict.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const handleAddProductToCart = (
    product: Product,
    variant = product.variants[0] ?? 'Standard',
    qty = 1,
  ) => {
    const cartKey = `${product.id}__${variant}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.id === cartKey
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: cartKey,
          name: product.name,
          vendorName: product.vendorName,
          price: product.price,
          image: product.image,
          variantOrUnit: variant,
          quantity: qty,
          isGrocery: false,
        },
      ];
    });
    setToastMessage(`Added ${product.name} to cart`);
  };

  const handleAddGroceryToCart = (grocery: GroceryItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === grocery.id);
      if (existing) {
        return prev.map((item) =>
          item.id === grocery.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: grocery.id,
          name: grocery.name,
          vendorName: grocery.vendorName,
          price: grocery.price,
          image: grocery.image,
          variantOrUnit: grocery.unit,
          quantity: 1,
          isGrocery: true,
        },
      ];
    });
    setToastMessage(`Added ${grocery.name} to basket`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const handleSearchSubmit = () => {
    const catalog = document.getElementById('catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(mode) => setAuthModalState({ open: true, mode })}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setToastMessage('Signed out of KenaKata');
        }}
        onResetFilters={handleResetFilters}
      />

      <main className="flex-1">
        <HeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenSellerModal={() => setIsSellerModalOpen(true)}
        />

        <MarketplaceGrid
          products={filteredProducts}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          onAddToCart={handleAddProductToCart}
          onOpenProduct={(product) => setActiveProduct(product)}
        />

        <DailyBazarSection
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          cartItems={cartItems}
          onAddGrocery={handleAddGroceryToCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          searchQuery={searchQuery}
        />

        <NearbyShopsSection
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          onOpenShop={(shop) => setActiveShop(shop)}
        />

        <SellerBanner onOpenSellerModal={() => setIsSellerModalOpen(true)} />
      </main>

      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenAuth={(mode) => setAuthModalState({ open: true, mode })}
      />

      {/* Interactive Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

      <AuthModal
        isOpen={authModalState.open}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState((prev) => ({ ...prev, open: false }))}
        onSuccess={(user) => {
          setCurrentUser(user);
          setToastMessage(`Welcome to KenaKata, ${user.name}`);
        }}
      />

      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddProductToCart}
      />

      <ShopModal
        shop={activeShop}
        onClose={() => setActiveShop(null)}
        onAddProduct={(product) => handleAddProductToCart(product)}
        onAddGrocery={handleAddGroceryToCart}
      />

      {/* Action Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-40 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>View Cart</span>
          </button>
        </div>
      )}
    </div>
  );
}
