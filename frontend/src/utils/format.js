/**
 * Helper to format currency numbers into Indian Rupees (₹ INR)
 */
export function formatINR(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  });
}
