/**
 * ProductSearch component for searching products with search button and cancel functionality
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

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
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Next.js URL hooks
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get current search query from URL
  const currentSearchQuery = searchParams.get('q') || '';

  // Initialize input value from URL
  useEffect(() => {
    setInputValue(currentSearchQuery);
  }, [currentSearchQuery]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Function to update URL parameters
  const updateUrlParams = useCallback((newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 0) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${pathname}${newUrl}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Handle search button click
  const handleSearch = useCallback(() => {
    if (!inputValue.trim()) {
      return;
    }

    // Update URL with search query and reset pagination
    updateUrlParams({
      q: inputValue.trim(),
      skip: 0, // Reset to first page
    });
  }, [inputValue, updateUrlParams]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setInputValue('');
    updateUrlParams({
      q: null, // Remove search query
      skip: 0, // Reset to first page
    });
  }, [updateUrlParams]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setInputValue('');
    updateUrlParams({
      q: null, // Remove search query
      skip: 0, // Reset to first page
    });
  }, [updateUrlParams]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
