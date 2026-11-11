import { useEffect, useMemo, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { AdminOrdersView } from './components/AdminOrdersView';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { DailyBazarSection } from './components/DailyBazarSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { NearbyShopsSection } from './components/NearbyShopsSection';
import { PostUsedAdModal } from './components/PostUsedAdModal';
import { ProductModal } from './components/ProductModal';
import { SellerBanner } from './components/SellerBanner';
import { SellerModal } from './components/SellerModal';
import { ShopModal } from './components/ShopModal';
import { UsedProductModal } from './components/UsedProductModal';
import { UsedProductsSection } from './components/UsedProductsSection';
import {
  DEFAULT_DELIVERY_CHARGES,
  INITIAL_DEMO_ORDERS,
} from './data/deliveryDemoData';
import {
  DAILY_BAZAR_ITEMS,
  MARKETPLACE_PRODUCTS,
} from './data/marketplaceData';
import { INITIAL_USED_LISTINGS } from './data/usedProductsData';
import { useLanguage } from './i18n/LanguageContext';
import {
  GROCERY_BN,
  PRODUCT_BN,
  USED_CONDITION_LABELS,
  USED_DEMO_BN,
  translateDistrict,
} from './i18n/translations';
import type {
  AreaName,
  AuthUser,
  CartItem,
  CategoryId,
  CourierOrderStatus,
  DeliveryChargeConfig,
  GroceryItem,
  LocalOrderStatus,
  MarketplaceOrder,
  ModerationStatus,
  NearbyShop,
  Product,
  SellerVerificationLevel,
  ShopAreaFilter,
  SortOption,
  UsedProductListing,
} from './types/marketplace';

const INITIAL_CART: CartItem[] = [
  {
    id: `${MARKETPLACE_PRODUCTS[0].id}__${MARKETPLACE_PRODUCTS[0].variants[0]}`,
    productId: MARKETPLACE_PRODUCTS[0].id,
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
    productId: DAILY_BAZAR_ITEMS[0].id,
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
  const { lang, t } = useLanguage();

  const [activeView, setActiveView] = useState<'storefront' | 'admin'>('storefront');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedDeliveryArea, setSelectedDeliveryArea] =
    useState<AreaName>('Cumilla Sadar');
  const [selectedShopArea, setSelectedShopArea] =
    useState<ShopAreaFilter>('All Cumilla');

  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryChargeConfig>(
    DEFAULT_DELIVERY_CHARGES,
  );
  const [orders, setOrders] = useState<MarketplaceOrder[]>(INITIAL_DEMO_ORDERS);

  // Second-Hand Classifieds State
  const [usedListings, setUsedListings] =
    useState<UsedProductListing[]>(INITIAL_USED_LISTINGS);
  const [activeUsedListingId, setActiveUsedListingId] = useState<string | null>(
    null,
  );
  const [usedSellerFilter, setUsedSellerFilter] = useState<{
    sellerId: string;
    sellerName: string;
  } | null>(null);
  const [postAdModalState, setPostAdModalState] = useState<{
    open: boolean;
    editing: UsedProductListing | null;
  }>({ open: false, editing: null });

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
        setActiveUsedListingId(null);
        setPostAdModalState((prev) => ({ ...prev, open: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeUsedListing = useMemo(
    () => usedListings.find((item) => item.id === activeUsedListingId) ?? null,
    [usedListings, activeUsedListingId],
  );

  const inCartItemIds = useMemo(
    () => new Set(cartItems.map((c) => c.productId ?? c.id)),
    [cartItems],
  );

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

      const pBn = PRODUCT_BN[product.id];
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.vendorName.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.vendorDistrict.toLowerCase().includes(q) ||
        (pBn?.name.toLowerCase().includes(q) ?? false) ||
        (pBn?.vendorName.toLowerCase().includes(q) ?? false);

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
          productId: product.id,
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
    const displayName =
      lang === 'bn' && PRODUCT_BN[product.id]
        ? PRODUCT_BN[product.id].name
        : product.name;
    setToastMessage(`${t.toasts.addedToCart} ${displayName}`);
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
          productId: grocery.id,
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
    const displayName =
      lang === 'bn' && GROCERY_BN[grocery.id]
        ? GROCERY_BN[grocery.id].name
        : grocery.name;
    setToastMessage(`${t.toasts.addedToBasket} ${displayName}`);
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

  const handleNavigateStorefront = (targetId?: string) => {
    setActiveView('storefront');
    if (targetId) {
      window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    }
  };

  const handleSearchSubmit = () => {
    handleNavigateStorefront('catalog');
  };

  const handlePlaceOrder = (order: MarketplaceOrder) => {
    setOrders((prev) => [order, ...prev]);
    setToastMessage(`${t.toasts.orderAdded} #${order.id}`);
  };

  const handleAssignLocalStaff = (orderId: string, staffId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus: LocalOrderStatus =
          staffId && order.status === 'Pending Assignment'
            ? 'Assigned to Rider'
            : !staffId
              ? 'Pending Assignment'
              : (order.status as LocalOrderStatus);
        return {
          ...order,
          assignedStaffId: staffId || undefined,
          status: nextStatus,
        };
      }),
    );
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: LocalOrderStatus | CourierOrderStatus,
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const handleUpdateCourierInfo = (
    orderId: string,
    courierPartner: string,
    trackingCode: string,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus: CourierOrderStatus =
          trackingCode.trim() && order.status === 'Awaiting Courier Handover'
            ? 'Handed to Courier'
            : (order.status as CourierOrderStatus);
        return {
          ...order,
          courierPartner,
          courierTrackingCode: trackingCode,
          status: nextStatus,
        };
      }),
    );
  };

  /* Second-Hand Marketplace Handlers */
  const handleSaveUsedListing = (
    listing: UsedProductListing,
    isEdit: boolean,
  ) => {
    if (isEdit) {
      setUsedListings((prev) =>
        prev.map((item) => (item.id === listing.id ? listing : item)),
      );
      setToastMessage(t.toasts.adUpdated);
    } else {
      setUsedListings((prev) => [listing, ...prev]);
      setToastMessage(t.toasts.adPublished);
    }
  };

  const handleToggleListingStatus = (listingId: string) => {
    let becameSold = false;
    setUsedListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const nextStatus = item.listingStatus === 'Active' ? 'Sold' : 'Active';
        becameSold = nextStatus === 'Sold';
        return { ...item, listingStatus: nextStatus };
      }),
    );
    setToastMessage(becameSold ? t.toasts.adMarkedSold : t.toasts.adRelisted);
  };

  const handleToggleFeaturedAd = (listingId: string) => {
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? {
              ...item,
              isFeatured: !item.isFeatured,
              promotionTier: !item.isFeatured ? 'Featured' : 'None',
            }
          : item,
      ),
    );
    setToastMessage(t.toasts.modUpdated);
  };

  const handleUpdateSellerVerification = (
    listingId: string,
    level: SellerVerificationLevel,
  ) => {
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, sellerVerification: level } : item,
      ),
    );
    setToastMessage(t.toasts.modUpdated);
  };

  const handleSubmitOffer = (
    listingId: string,
    offeredPrice: number,
    note: string,
  ) => {
    const offer = {
      id: `off-${Date.now().toString().slice(-6)}`,
      buyerName: currentUser?.name ?? (lang === 'bn' ? 'ক্রেতা (ডেমো)' : 'Buyer (You)'),
      offeredPrice,
      note: note || undefined,
      status: 'Pending' as const,
      createdAt: lang === 'bn' ? 'এইমাত্র' : 'Just now',
    };
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, offers: [offer, ...item.offers] } : item,
      ),
    );
    setToastMessage(t.toasts.offerSubmitted);
  };

  const handleRespondOffer = (
    listingId: string,
    offerId: string,
    action: 'Accepted' | 'Declined',
  ) => {
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? {
              ...item,
              offers: item.offers.map((o) =>
                o.id === offerId ? { ...o, status: action } : o,
              ),
            }
          : item,
      ),
    );
    setToastMessage(t.toasts.offerUpdated);
  };

  const handleSendListingMessage = (
    listingId: string,
    text: string,
    asSender: 'buyer' | 'seller',
  ) => {
    setUsedListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const msg = {
          id: `msg-${Date.now().toString().slice(-6)}`,
          sender: asSender,
          senderName:
            asSender === 'seller'
              ? item.sellerName
              : currentUser?.name ?? (lang === 'bn' ? 'আপনি' : 'You'),
          text,
          sentAt: lang === 'bn' ? 'এইমাত্র' : 'Just now',
        };
        return { ...item, messages: [...item.messages, msg] };
      }),
    );
    setToastMessage(t.toasts.msgSent);
  };

  const handleBuyUsedItem = (listing: UsedProductListing, unitPrice?: number) => {
    const finalPrice = unitPrice ?? listing.price;
    const bn = USED_DEMO_BN[listing.id];
    const displayName = lang === 'bn' && bn ? bn.title : listing.title;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.id === listing.id ? { ...item, price: finalPrice } : item,
        );
      }
      return [
        ...prev,
        {
          id: listing.id,
          productId: listing.id,
          isUsed: true,
          name: listing.title,
          vendorName: listing.sellerName,
          price: finalPrice,
          image: listing.images[0],
          variantOrUnit: `${USED_CONDITION_LABELS[listing.condition][lang]} · ${translateDistrict(listing.district, lang)}`,
          quantity: 1,
          isGrocery: false,
        },
      ];
    });
    setToastMessage(`${t.toasts.addedUsedToCart} ${displayName}`);
  };

  const handleDeleteUsedListing = (listingId: string) => {
    setUsedListings((prev) => prev.filter((item) => item.id !== listingId));
    if (activeUsedListingId === listingId) {
      setActiveUsedListingId(null);
    }
    setToastMessage(t.toasts.adDeleted);
  };

  const handleReportUsedListing = (
    listingId: string,
    reason: string,
    details: string,
  ) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      reason,
      details,
      reportedAt: lang === 'bn' ? 'এইমাত্র' : 'Just now',
    };
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? { ...item, reports: [...item.reports, newReport] }
          : item,
      ),
    );
    setToastMessage(t.toasts.adReported);
  };

  const handleUpdateModerationStatus = (
    listingId: string,
    status: ModerationStatus,
  ) => {
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, moderationStatus: status } : item,
      ),
    );
    setToastMessage(t.toasts.modUpdated);
  };

  const handleDismissListingReports = (listingId: string) => {
    setUsedListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, reports: [] } : item,
      ),
    );
    setToastMessage(t.toasts.reportsCleared);
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
        onOpenPostAd={() =>
          setPostAdModalState({ open: true, editing: null })
        }
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setToastMessage(t.toasts.signedOut);
        }}
        onResetFilters={handleResetFilters}
        activeView={activeView}
        onOpenAdminView={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateStorefront={handleNavigateStorefront}
      />

      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminOrdersView
            orders={orders}
            deliveryCharges={deliveryCharges}
            usedListings={usedListings}
            onUpdateDeliveryCharges={(nextConfig) => {
              setDeliveryCharges(nextConfig);
              setToastMessage(t.toasts.updatedCharges);
            }}
            onAssignLocalStaff={handleAssignLocalStaff}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateCourierInfo={handleUpdateCourierInfo}
            onUpdateModerationStatus={handleUpdateModerationStatus}
            onToggleFeaturedAd={handleToggleFeaturedAd}
            onToggleListingStatus={handleToggleListingStatus}
            onUpdateSellerVerification={handleUpdateSellerVerification}
            onDismissListingReports={handleDismissListingReports}
            onDeleteUsedListing={handleDeleteUsedListing}
            onBackToStorefront={() => handleNavigateStorefront()}
          />
        ) : (
          <>
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

            <UsedProductsSection
              listings={usedListings}
              globalSearchQuery={searchQuery}
              sellerFilter={usedSellerFilter}
              onClearSellerFilter={() => setUsedSellerFilter(null)}
              onOpenPostAd={() =>
                setPostAdModalState({ open: true, editing: null })
              }
              onEditListing={(listing) =>
                setPostAdModalState({ open: true, editing: listing })
              }
              onToggleListingStatus={handleToggleListingStatus}
              onDeleteListing={handleDeleteUsedListing}
              onSelectListing={(listing) => setActiveUsedListingId(listing.id)}
            />

            <DailyBazarSection
              selectedArea={selectedDeliveryArea}
              onAreaChange={setSelectedDeliveryArea}
              cartItems={cartItems}
              onAddGrocery={handleAddGroceryToCart}
              onUpdateQuantity={handleUpdateCartQuantity}
              searchQuery={searchQuery}
            />

            <NearbyShopsSection
              selectedArea={selectedShopArea}
              onAreaChange={setSelectedShopArea}
              onOpenShop={(shop) => setActiveShop(shop)}
            />

            <SellerBanner onOpenSellerModal={() => setIsSellerModalOpen(true)} />
          </>
        )}
      </main>

      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigateStorefront('catalog');
        }}
        onNavigateSection={(id) => handleNavigateStorefront(id)}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenPostAd={() =>
          setPostAdModalState({ open: true, editing: null })
        }
        onOpenAuth={(mode) => setAuthModalState({ open: true, mode })}
        onOpenAdminOrders={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        deliveryCharges={deliveryCharges}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onPlaceOrder={handlePlaceOrder}
        onOpenAdminOrders={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AuthModal
        isOpen={authModalState.open}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState((prev) => ({ ...prev, open: false }))}
        onSuccess={(user) => {
          setCurrentUser(user);
          setToastMessage(`${t.toasts.welcome} ${user.name}`);
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

      <UsedProductModal
        listing={activeUsedListing}
        inCartItemIds={inCartItemIds}
        onClose={() => setActiveUsedListingId(null)}
        onEdit={(listing) =>
          setPostAdModalState({ open: true, editing: listing })
        }
        onToggleStatus={handleToggleListingStatus}
        onToggleFeatured={handleToggleFeaturedAd}
        onDelete={handleDeleteUsedListing}
        onSubmitOffer={handleSubmitOffer}
        onRespondOffer={handleRespondOffer}
        onSendMessage={handleSendListingMessage}
        onBuyUsedItem={handleBuyUsedItem}
        onViewSellerAds={(sellerId, sellerName) => {
          setUsedSellerFilter({ sellerId, sellerName });
          handleNavigateStorefront('used-products');
        }}
        onReport={handleReportUsedListing}
      />

      <PostUsedAdModal
        isOpen={postAdModalState.open}
        editingListing={postAdModalState.editing}
        onClose={() =>
          setPostAdModalState({ open: false, editing: null })
        }
        onSaveListing={handleSaveUsedListing}
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
            <span>{t.toasts.viewCart}</span>
          </button>
        </div>
      )}
    </div>
  );
}
