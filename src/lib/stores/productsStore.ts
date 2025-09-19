import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Product } from '@/types/product';
import { Category } from '@/types/category';

interface ProductsState {
  // Data state
  products: Product[];
  categories: Category[];
  total: number;
  loading: boolean;
  error: string | null;
  
  // Pagination state
  skip: number;
  limit: number;
  
  // Filter state
  selectedCategory: string;
  sortBy: string;
  
  // DataTable sorting state
  sortField: string;
  sortOrder: 0 | 1 | -1 | null | undefined;
  
  // Initialization state
  isInitialized: boolean;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Pagination actions
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  setPagination: (skip: number, limit: number) => void;
  
  // Filter actions
  setSelectedCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
  setFilters: (category: string, sortBy: string) => void;
  
  // DataTable sorting actions
  setSortField: (sortField: string) => void;
  setSortOrder: (sortOrder: 0 | 1 | -1 | null | undefined) => void;
  setDataTableSort: (sortField: string, sortOrder: 0 | 1 | -1 | null | undefined) => void;
  
  // Combined actions
  resetFilters: () => void;
  resetPagination: () => void;
  resetAll: () => void;
  
  // Initialization actions
  initializeWithData: (data: {
    products: Product[];
    categories: Category[];
    total: number;
    skip: number;
    limit: number;
  }) => void;
  
  // API actions
  fetchProducts: (skip?: number, limit?: number, category?: string, sortBy?: string) => Promise<void>;
}

const DEFAULT_SORT = 'title-asc';
const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 0;

export const useProductsStore = create<ProductsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        products: [],
        categories: [],
        total: 0,
        loading: false,
        error: null,
        skip: DEFAULT_SKIP,
        limit: DEFAULT_LIMIT,
        selectedCategory: '',
        sortBy: DEFAULT_SORT,
        sortField: '',
        sortOrder: 1,
        isInitialized: false,
        
        // Data setters
        setProducts: (products) => set({ products }),
        setCategories: (categories) => set({ categories }),
        setTotal: (total) => set({ total }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        
        // Pagination setters
        setSkip: (skip) => set({ skip }),
        setLimit: (limit) => set({ limit }),
        setPagination: (skip, limit) => set({ skip, limit }),
        
        // Filter setters
        setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
        setSortBy: (sortBy) => set({ sortBy }),
        setFilters: (selectedCategory, sortBy) => set({ selectedCategory, sortBy }),
        
        // DataTable sorting setters
        setSortField: (sortField) => set({ sortField }),
        setSortOrder: (sortOrder) => set({ sortOrder }),
        setDataTableSort: (sortField, sortOrder) => set({ sortField, sortOrder }),
        
        // Reset actions
        resetFilters: () => set({ 
          selectedCategory: '', 
          sortBy: DEFAULT_SORT,
          sortField: '',
          sortOrder: 1,
        }),
        resetPagination: () => set({ 
          skip: DEFAULT_SKIP, 
          limit: DEFAULT_LIMIT 
        }),
        resetAll: () => set({
          products: [],
          categories: [],
          total: 0,
          loading: false,
          error: null,
          skip: DEFAULT_SKIP,
          limit: DEFAULT_LIMIT,
          selectedCategory: '',
          sortBy: DEFAULT_SORT,
          sortField: '',
          sortOrder: 1,
          isInitialized: false,
        }),
        
        // Initialization method
        initializeWithData: (data) => set({
          products: data.products,
          categories: data.categories,
          total: data.total,
          skip: data.skip,
          limit: data.limit,
          isInitialized: true,
        }),
        
        // API action
        fetchProducts: async (skip, limit, category, sortBy) => {
          const state = get();
          const currentSkip = skip ?? state.skip;
          const currentLimit = limit ?? state.limit;
          const currentCategory = category ?? state.selectedCategory;
          const currentSortBy = sortBy ?? state.sortBy;
          
          set({ loading: true, error: null });
          
          try {
            // Build query parameters
            const params = new URLSearchParams({
              skip: currentSkip.toString(),
              pagesize: currentLimit.toString(),
            });
            
            // Add category filter if selected
            if (currentCategory) {
              params.append('category', currentCategory);
            }
            
            // Add sort parameters if different from default
            if (currentSortBy !== DEFAULT_SORT) {
              const [sortField, sortOrder] = currentSortBy.split('-');
              if (sortField && sortOrder) {
                params.append('sort', sortField);
                params.append('order', sortOrder);
              }
            }
            
            const response = await fetch(`/api/products?${params.toString()}`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            set({
              products: data.products,
              total: data.total,
              skip: data.skip,
              limit: data.limit,
              loading: false,
              error: null,
            });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar los productos';
            set({
              loading: false,
              error: errorMessage,
            });
            console.error('Error fetching products:', err);
          }
        },
      }),
      {
        name: 'products-store',
        // Only persist certain state, not the API data
        partialize: (state) => ({
          skip: state.skip,
          limit: state.limit,
          selectedCategory: state.selectedCategory,
          sortBy: state.sortBy,
          sortField: state.sortField,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    {
      name: 'products-store',
    }
  )
);
