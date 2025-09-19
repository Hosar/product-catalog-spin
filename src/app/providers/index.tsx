'use client'
import React from "react";
import { PrimeReactProvider } from 'primereact/api';
import { ProductsProvider } from './ProductsProvider';

export function Providers({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <PrimeReactProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </PrimeReactProvider>
  );
}