/**
 * ProductSearch component for searching products with search button and cancel functionality
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useProductsStore } from '@/lib/stores/productsStore';

interface ProductSearchProps {
  className?: string;
}

/**
 * ProductSearch component provides search functionality with search button and cancel functionality
 * @param props - Component props
 * @returns JSX element representing search input with buttons
 */
export const ProductSearch: React.FC<ProductSearchProps> = ({
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const {
    searchQuery,
    loading,
    setSearchQuery,
    searchProducts,
    resetPagination,
    resetSearch,
  } = useProductsStore();

  // Initialize input value from store
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Handle search button click
  const handleSearch = useCallback(async () => {
    if (!inputValue.trim()) {
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    setSearchQuery(inputValue.trim());
    resetPagination();
    await searchProducts(inputValue.trim());
  }, [inputValue, setSearchQuery, resetPagination, searchProducts]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    resetSearch();
    setInputValue('');
  }, [resetSearch]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setInputValue('');
    resetSearch();
  }, [resetSearch]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('e.key ....:', e.key);
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className={`flex flex-column gap-2 ${className}`}>
      <label htmlFor="product-search" className="font-semibold">
        Buscar productos:
      </label>
      <div className="flex gap-2">
        <div className="p-input-icon-left p-input-icon-right flex-1">
          <i className="pi pi-search" />
          <InputText
            id="product-search"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Buscar productos..."
            className="w-full"
            aria-label="Buscar productos"
            disabled={loading}
          />
          {inputValue && (
            <i 
              className="pi pi-times cursor-pointer" 
              onClick={handleClearSearch}
              aria-label="Limpiar búsqueda"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClearSearch();
                }
              }}
            />
          )}
        </div>
        <Button
          label="Buscar"
          icon="pi pi-search"
          onClick={handleSearch}
          disabled={!inputValue.trim() || loading}
          loading={loading}
          aria-label="Ejecutar búsqueda"
        />
        {loading && (
          <Button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            onClick={handleCancel}
            aria-label="Cancelar búsqueda"
          />
        )}
      </div>
    </div>
  );
};
