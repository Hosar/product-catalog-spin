/**
 * Custom hook for synchronizing Zustand store state with URL parameters
 */

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductsStore } from '@/lib/stores/productsStore';

interface UrlSyncOptions {
  debounceMs?: number;
}

export const useUrlSync = (options: UrlSyncOptions = {}) => {
  const { debounceMs = 300 } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    skip,
    limit,
    selectedCategory,
    sortBy,
    isInitialized,
    setSkip,
    setLimit,
    setSelectedCategory,
    setSortBy,
    fetchProducts,
  } = useProductsStore();

  // Update URL when store state changes
  const updateUrl = useCallback(() => {
    // Only update URL after store is initialized
    if (!isInitialized) return;
    
    const params = new URLSearchParams();
    
    if (skip > 0) params.set('skip', skip.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'title-asc') params.set('sort', sortBy);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl, { scroll: false });
  }, [skip, limit, selectedCategory, sortBy, router, isInitialized]);

  // Debounced URL update
  useEffect(() => {
    const timeoutId = setTimeout(updateUrl, debounceMs);
    return () => clearTimeout(timeoutId);
  }, [updateUrl, debounceMs]);

  // Initialize store from URL on mount (only once)
  useEffect(() => {
    const urlSkip = searchParams.get('skip');
    const urlLimit = searchParams.get('limit');
    const urlCategory = searchParams.get('category');
    const urlSort = searchParams.get('sort');

    // Only initialize if we have URL parameters and store is not initialized yet
    if (!isInitialized && (urlSkip || urlLimit || urlCategory || urlSort)) {
      let hasChanges = false;

      if (urlSkip && parseInt(urlSkip) !== skip) {
        setSkip(parseInt(urlSkip));
        hasChanges = true;
      }

      if (urlLimit && parseInt(urlLimit) !== limit) {
        setLimit(parseInt(urlLimit));
        hasChanges = true;
      }

      if (urlCategory !== selectedCategory) {
        setSelectedCategory(urlCategory || '');
        hasChanges = true;
      }

      if (urlSort && urlSort !== sortBy) {
        setSortBy(urlSort);
        hasChanges = true;
      }

      // Fetch products if URL parameters changed
      if (hasChanges) {
        const finalSkip = urlSkip ? parseInt(urlSkip) : skip;
        const finalLimit = urlLimit ? parseInt(urlLimit) : limit;
        const finalCategory = urlCategory || selectedCategory;
        const finalSort = urlSort || sortBy;
        
        fetchProducts(finalSkip, finalLimit, finalCategory, finalSort);
      }
    }
  }, [isInitialized]); // Only run when initialization state changes

  // Fetch products when store state changes (but not on initial load)
  useEffect(() => {
    // Only fetch if store is initialized and we have changes from user interaction
    if (!isInitialized) return;

    fetchProducts();
  }, [skip, limit, selectedCategory, sortBy, fetchProducts, isInitialized]);

  return {
    updateUrl,
  };
};
