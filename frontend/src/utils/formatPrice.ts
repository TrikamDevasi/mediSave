/**
 * Price formatting utilities for Indian Rupee display.
 */

/**
 * Format a number as Indian Rupee string: ₹1,23,456
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return '₹--';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculate savings between brand price and generic price.
 */
export function calculateSavings(
  brandPrice: number,
  genericPrice: number
): { saved: number; percent: number; label: string } {
  const saved = brandPrice - genericPrice;
  const percent = brandPrice > 0 ? Math.round((saved / brandPrice) * 100) : 0;
  return {
    saved,
    percent,
    label: formatSavingsBadge(percent),
  };
}

/**
 * Format savings as a badge label: "Save 87%"
 */
export function formatSavingsBadge(percent: number): string {
  return `Save ${percent}%`;
}

/**
 * Format a price with strikethrough notation for display.
 * Returns { original, discounted, savings }
 */
export function formatPriceComparison(mrp: number, price: number) {
  const { saved, percent } = calculateSavings(mrp, price);
  return {
    original: formatINR(mrp),
    discounted: formatINR(price),
    saved: formatINR(saved),
    percent,
    badge: formatSavingsBadge(percent),
  };
}
