export function getBaseUrl() {
    const vercel = 'product-catalog-spin.vercel.app'; // e.g. my-app-abc123.vercel.app
    if (vercel) return `https://${vercel}`;
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}