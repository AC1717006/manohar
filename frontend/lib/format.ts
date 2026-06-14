export function formatPrice(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function productImage(images: string[]): string {
  return images[0] ?? "/images/placeholder.svg";
}
