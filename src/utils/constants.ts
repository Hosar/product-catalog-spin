/**
 * Application constants and configuration
 */

import type { SortOption } from '@/types/product';

// Sort options for product filtering
export const SORT_OPTIONS: SortOption[] = [
  { label: 'Precio: Menor a Mayor', value: 'price-asc' },
  { label: 'Precio: Mayor a Menor', value: 'price-desc' },
  { label: 'Calificación: Menor a Mayor', value: 'rating-asc' },
  { label: 'Calificación: Mayor a Menor', value: 'rating-desc' },
  { label: 'Nombre: A-Z', value: 'title-asc' },
  { label: 'Nombre: Z-A', value: 'title-desc' },
] as const;

// Chart colors for data visualization
export const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#0033cc',
  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
] as const;

// Pagination configuration
export const PRODUCTS_PER_PAGE = 12;

// Default sort option
export const DEFAULT_SORT = 'title-asc' as const;

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/products/categories',
} as const;
