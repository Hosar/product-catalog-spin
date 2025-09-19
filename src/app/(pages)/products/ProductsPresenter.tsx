'use client';
// import React, { useCallback, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProductFilters } from './components/ProductFilters';
import { ProductSearch } from './components/ProductSearch';
import { ProductsSkeleton } from './components/ProductsSkeleton';
import { MainErrorMessage } from './components/MainErrorMessage';
import { Chart } from 'primereact/chart';
import {
  ProductImageTemplate,
  ProductTitleTemplate,
  ProductPriceTemplate,
  ProductCategoryTemplate,
  ProductRatingTemplate,
  ProductStockTemplate,
} from './components/templates';
// import { ProductChart } from './components/ProductChart';
import { capitalize } from '@/utils/formatters';
import type { Product } from '@/types/product';
import type { DataTableStateEvent, DataTableSelectEvent } from 'primereact/datatable';
import { Category } from '@/types/category';
import { useProductsStore } from '@/lib/stores/productsStore';
import { useUrlSync } from '@/hooks/useUrlSync';

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

const chartBodyTemplate = (rowData: any) => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: rowData.name,
        data: rowData.rating,
        fill: false,
        borderColor: "#42A5F5",
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } }, // hide legend for compactness
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "150px", height: "80px" }}>
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
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
  // Zustand store
  const {
    products,
    categories,
    total,
    skip,
    limit,
    loading,
    error,
    selectedCategory,
    sortBy,
    sortField,
    sortOrder,
    isInitialized,
    setSkip,
    setLimit,
    setSelectedCategory,
    setSortBy,
    setSortField,
    setSortOrder,
    resetPagination,
    initializeWithData,
  } = useProductsStore();

  // URL synchronization
  useUrlSync();

  // Initialize store with initial data (only once)
  // useEffect(() => {
  //   if (!isInitialized && initialProducts.length > 0 && initialCategories.length > 0) {
  //     initializeWithData({
  //       products: initialProducts,
  //       categories: initialCategories,
  //       total: initialTotal,
  //       skip: initialSkip,
  //       limit: initialLimit,
  //     });
  //   }
  // }, [isInitialized, initialProducts, initialCategories, initialTotal, initialSkip, initialLimit, initializeWithData]);

  console.log('products ....:', products);
  console.log('total ....:', total);
  console.log('skip ....:', skip);
  console.log('limit ....:', limit);
  console.log('categories ....:', categories);

  // Create category options for dropdown
  const categoryOptions = [
    { label: 'Todas las categorías', value: '' },
    ...categories.map((category: Category) => ({
      label: capitalize(category.name),
      value: category.name
    }))
  ];

  // Handle pagination
  // const onPageChange = useCallback((event: { first: number; rows: number; page: number }) => {
  //   setSkip(event.first);
  //   setLimit(event.rows);
  // }, [setSkip, setLimit]);

  // // Handle filter changes with pagination reset
  // const handleCategoryChangeWithReset = useCallback((e: { value: string }) => {
  //   setSelectedCategory(e.value);
  //   resetPagination();
  // }, [setSelectedCategory, resetPagination]);

  // const handleSortChangeWithReset = useCallback((e: { value: string }) => {
  //   setSortBy(e.value);
  //   resetPagination();
  // }, [setSortBy, resetPagination]);

  // // Handle DataTable sorting
  // const onSort = useCallback((event: DataTableStateEvent) => {
  //   setSortField(event.sortField || '');
  //   setSortOrder(event.sortOrder);
  //   // Reset to first page when sorting
  //   resetPagination();
  // }, [setSortField, setSortOrder, resetPagination]);

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

  // Handle product selection (for future functionality)
  // const handleProductSelect = useCallback((event: DataTableSelectEvent) => {
  //   // TODO: Implement product detail view or modal
  //   console.log('Product selected:', event.data);
  // }, []);

  const handleCategoryChangeWithReset = (e: { value: string }) => {
    console.log('handleCategoryChangeWithReset ...:', e);
  };

  const onPageChange = () => {
    console.log('onPageChange ...:');
  }

  const onSort = (e: DataTableStateEvent) => {
    console.log('onSort ...:', e);
  };

  const handleProductSelect = (e: DataTableSelectEvent) => {
  console.log('handleProductSelect ...:', e);
  };

  return (
    <main className={`grid ${className}`}>
      <div className="col-12">
        <div className="flex flex-column gap-4 px-4 py-6">
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
              header="Sales Trend" body={chartBodyTemplate}
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
        </div>
      </div>
    </main>
  );
};
