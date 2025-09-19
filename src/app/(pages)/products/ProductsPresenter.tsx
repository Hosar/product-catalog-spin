'use client';
import React, { useCallback, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProductFilters } from './components/ProductFilters';
import { ProductSearch } from './components/ProductSearch';
import { Chart } from 'primereact/chart';
import {
  ProductImageTemplate,
  ProductTitleTemplate,
  ProductPriceTemplate,
  ProductCategoryTemplate,
  ProductRatingTemplate,
  ProductStockTemplate,
} from './components/templates';
import { capitalize, countReviewRatings } from '@/utils/formatters';
import type { Product, Review } from '@/types/product';
import type { DataTableStateEvent, DataTableSelectEvent } from 'primereact/datatable';
import { Category } from '@/types/category';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { CHART_COLORS } from '@/utils/constants';

interface ProductsPresenterProps {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  categories: Category[];
  error: string | null;
  onRefetch?: () => Promise<void>;
  className?: string;
}

const chartBodyTemplate = (rowData: Product) => {
  const reviews = countReviewRatings(rowData.reviews as Review[]);
  const data = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: reviews || [],
        backgroundColor: CHART_COLORS,
        hoverBackgroundColor: CHART_COLORS
      }
    ]
  }
  const options = {
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Chart type="bar" data={data} options={options} />
  );
};

/**
 * Presenter component that handles only UI rendering and user interactions
 * All data and business logic comes from the container component
 */
export const ProductsPresenter: React.FC<ProductsPresenterProps> = ({
  products: initialProducts,
  total: initialTotal,
  skip: initialSkip,
  limit: initialLimit,
  categories: initialCategories,
  error: initialError,
  className = ''
}) => {
  // Next.js URL hooks
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Local state for UI
  const [loading, setLoading] = useState(false);

  // Get current URL parameters
  const currentSkip = parseInt(searchParams.get('skip') || initialSkip.toString());
  const currentLimit = parseInt(searchParams.get('limit') || initialLimit.toString());
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'title-asc';
  const currentSortField = searchParams.get('sortField') || '';
  const currentSortOrder = parseInt(searchParams.get('sortOrder') || '1') as 0 | 1 | -1;
  const currentSearchQuery = searchParams.get('q') || '';

  // Use initial data or current URL state
  const products = initialProducts;
  const total = initialTotal;
  const skip = currentSkip;
  const limit = currentLimit;
  const categories = initialCategories;
  const error = initialError;
  const selectedCategory = currentCategory;
  const sortBy = currentSort;
  const sortField = currentSortField;
  const sortOrder = currentSortOrder;
  const searchQuery = currentSearchQuery;

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

  // Create category options for dropdown
  const categoryOptions = [
    { label: 'Todas las categorías', value: '' },
    ...categories.map((category: Category) => ({
      label: capitalize(category.name),
      value: category.name
    }))
  ];

  // Handle pagination
  const onPageChange = useCallback((event: { first: number; rows: number; page: number }) => {
    updateUrlParams({
      skip: event.first,
      limit: event.rows,
    });
  }, [updateUrlParams]);

  // Handle filter changes with pagination reset
  const handleCategoryChangeWithReset = useCallback((e: { value: string }) => {
    updateUrlParams({
      category: e.value,
      skip: 0, // Reset to first page
    });
  }, [updateUrlParams]);

  const handleSortChangeWithReset = useCallback((e: { value: string }) => {
    updateUrlParams({
      sort: e.value,
      skip: 0, // Reset to first page
    });
  }, [updateUrlParams]);

  // Handle DataTable sorting
  const onSort = useCallback((event: DataTableStateEvent) => {
    updateUrlParams({
      sortField: event.sortField || '',
      sortOrder: event.sortOrder || 1,
      skip: 0, // Reset to first page when sorting
    });
  }, [updateUrlParams]);

  // Column templates using separate components
  const imageBodyTemplate = (product: Product) => <ProductImageTemplate product={product} />;
  const titleBodyTemplate = (product: Product) => <ProductTitleTemplate product={product} />;
  const priceBodyTemplate = (product: Product) => <ProductPriceTemplate product={product} />;
  const categoryBodyTemplate = (product: Product) => <ProductCategoryTemplate product={product} />;
  const ratingBodyTemplate = (product: Product) => <ProductRatingTemplate product={product} />;
  const stockBodyTemplate = (product: Product) => <ProductStockTemplate product={product} />;

  const brandBodyTemplate = (product: Product) => {
    return <span className="font-medium">{product.sku}</span>;
  };

  // Handle product selection - navigate to product details
  const handleProductSelect = useCallback((event: DataTableSelectEvent) => {
    if (event.data && event.data.id) {
      router.push(`/product/${event.data.id}`);
    }
  }, [router]);

  return (
    <main className={`grid ${className}`}>
      <div className="col-12">
        <section className="flex flex-column gap-4 px-4 py-6">
          {/* Header */}
          <header className="flex flex-column gap-3">
            <h1
              className="text-3xl font-bold m-0"
              aria-label="Página de productos"
            >
              Catálogo de Productos
            </h1>

            {/* Search */}
            <ProductSearch />

            {/* Filters and Sort */}
            <ProductFilters
              selectedCategory={selectedCategory}
              categoryOptions={categoryOptions}
              onCategoryChange={handleCategoryChangeWithReset}
            />
          </header>

          {/* Results count */}
          <section className="flex align-items-center justify-content-between" aria-label="Información de resultados">
            <p
              className="text-600 m-0"
              aria-label={`Mostrando ${products.length} de ${total} productos`}
            >
              Mostrando {products.length} de {total} productos
            </p>
          </section>

          {/* Products DataTable */}
          <section className="border-round surface-card" aria-label="Tabla de productos">
            <DataTable
              value={products}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
              onRowSelect={handleProductSelect}
              selectionMode="single"
              dataKey="id"
              emptyMessage="No se encontraron productos"
              className="p-datatable-sm"
              paginator={false}
              aria-label="Tabla de productos"
            >
              <Column
                field="thumbnail"
                header="Imagen"
                body={imageBodyTemplate}
                style={{ width: '80px' }}
                sortable={false}
              />
              <Column
                field="title"
                header="Producto"
                body={titleBodyTemplate}
                sortable
                style={{ minWidth: '150px' }}
              />
              <Column
                field="price"
                header="Precio"
                body={priceBodyTemplate}
                sortable
                style={{ width: '120px' }}
              />
              <Column
                field="category"
                header="Categoría"
                body={categoryBodyTemplate}
                sortable
                style={{ width: '120px' }}
              />
              <Column
                field="rating"
                header="Calificación"
                body={ratingBodyTemplate}
                sortable
                style={{ width: '120px' }}
              />
              <Column
                field="stock"
                header="Stock"
                body={stockBodyTemplate}
                sortable
                style={{ width: '100px' }}
              />
              <Column
                header="Reviews" body={chartBodyTemplate}
                style={{ width: '150px' }}
              />
            </DataTable>

            {/* Pagination */}
            <nav className="flex justify-content-center p-3" aria-label="Navegación de páginas">
              <Paginator
                first={skip}
                rows={limit}
                totalRecords={total}
                onPageChange={onPageChange}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                aria-label="Navegación de páginas de productos"
              />
            </nav>
          </section>
        </section>
      </div>
    </main>
  );
};
