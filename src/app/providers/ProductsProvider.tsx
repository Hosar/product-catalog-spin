/**
 * ProductsProvider - Provider component for Zustand store
 * This ensures the store is available throughout the component tree
 */

'use client';

import React from 'react';

interface ProductsProviderProps {
  children: React.ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  return <>{children}</>;
};
