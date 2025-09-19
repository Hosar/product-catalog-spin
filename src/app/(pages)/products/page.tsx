import React from 'react';
import { ProductsServerContainer } from './ProductsServerContainer';

/**
 * Products page - Server Component that fetches initial data
 * This page uses the Container/Presenter pattern with Server Actions
 * Data is fetched on the server for optimal performance
 */
export default async function ProductsPage() {
  return <ProductsServerContainer />;
}