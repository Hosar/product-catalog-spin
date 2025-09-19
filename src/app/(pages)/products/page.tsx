import React from 'react';
import { ProductsServerContainer } from './ProductsServerContainer';

interface ProductsPageProps {
  searchParams: {
    skip?: string;
    limit?: string;
    category?: string;
    sort?: string;
    sortField?: string;
    sortOrder?: string;
    q?: string;
  };
}

/**
 * Products page - Server Component that fetches initial data
 * This page uses the Container/Presenter pattern with Server Actions
 * Data is fetched on the server for optimal performance
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  return <ProductsServerContainer searchParams={searchParams} />;
}