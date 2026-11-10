import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import type { CartItem } from '../types/marketplace';
import { calculateDeliveryFee, formatBDT } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [viewMode, setViewMode] = useState<'cart' | 'preview' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setViewMode('cart');
      setFormError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(subtotal, totalCount);
  const totalAmount = subtotal + deliveryFee;
  const amountForFreeDelivery = Math.max(0, 1500 - subtotal);

  const handleConfirmPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill in your name, mobile number, and delivery address.');
      return;
    }
    setFormError('');
    setViewMode('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {viewMode === 'preview' && (
              <button
                type="button"
                onClick={() => setViewMode('cart')}
                aria-label="Back to cart"
                className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-lg font-bold text-slate-900">
              {viewMode === 'cart' && `Shopping Cart (${totalCount})`}
              {viewMode === 'preview' && 'Order & COD Delivery Preview'}
              {viewMode === 'confirmed' && 'Order Preview Ready'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {viewMode === 'confirmed' ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-slate-900">
                Order #KK-1042 Preview Confirmed
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
                UI prototype preview only — no database record or payment was charged.
              </p>

              <div className="mt-6 text-left bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Recipient</span>
                  <span className="font-semibold text-slate-900">{customerName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium text-slate-900 tabular-nums">{phone}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Address</span>
                  <span className="font-medium text-slate-900 text-right">
                    {address}, {district}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between gap-2">
                  <span className="text-slate-600 font-medium">Cash on Delivery Total</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formatBDT(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  onClose();
                }}
                className="mt-6 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done & Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-slate-900">
                Your shopping cart is empty
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
                Add electronics, handloom fashion, or Daily Bazar groceries to test
                the cart experience.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : viewMode === 'preview' ? (
            <form id="cod-preview-form" onSubmit={handleConfirmPreview} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
                This is a frontend checkout preview showing Cash on Delivery (COD)
                address fields. Real payment integration will be connected later.
              </div>

              {formError && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bangladesh Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XX-XXXXXX"
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  District / City
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                >
                  <option value="Dhaka">Dhaka Metro</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Cumilla">Cumilla</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street / House / Road Address
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 14, Road 6, Dhanmondi, Dhaka"
                  className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-none"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {amountForFreeDelivery > 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                  Add{' '}
                  <span className="font-bold tabular-nums">
                    {formatBDT(amountForFreeDelivery)}
                  </span>{' '}
                  more to unlock free Dhaka delivery.
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-900">
                  Your order qualifies for free standard delivery in Dhaka.
                </div>
              )}

              <ul className="divide-y divide-slate-200">
                {items.map((item) => (
                  <li key={item.id} className="py-4 flex gap-3.5">
                    <div className="w-20 h-16 rounded-lg bg-zinc-100 border border-slate-200 overflow-hidden shrink-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        fallbackLabel={item.name}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500 truncate">
                        {item.vendorName} · {item.variantOrUnit}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {formatBDT(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && viewMode !== 'confirmed' && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {formatBDT(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Delivery</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {deliveryFee === 0 ? 'Free' : formatBDT(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total (BDT)</span>
                <span className="tabular-nums">{formatBDT(totalAmount)}</span>
              </div>
            </div>

            {viewMode === 'cart' ? (
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Continue to Delivery Preview
              </button>
            ) : (
              <button
                type="submit"
                form="cod-preview-form"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Preview COD Order Summary
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
