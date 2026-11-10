export function formatBDT(amount: number): string {
  return `৳ ${amount.toLocaleString('en-BD')}`;
}

export function calculateDeliveryFee(subtotal: number, itemCount: number): number {
  if (itemCount === 0) return 0;
  if (subtotal >= 1500) return 0;
  return 60;
}
