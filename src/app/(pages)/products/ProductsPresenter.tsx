'use client';
import React, { useCallback, useState, useEffect } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { ProductFilters } from './components/ProductFilters';
import { Chart } from 'primereact/chart';
// import { ProductChart } from './components/ProductChart';
import { formatPrice, capitalize, truncateText } from '@/utils/formatters';
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
  loading: boolean;
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
  loading: initialLoading,
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
    isInitialized,
    setSkip,
    setLimit,
    setSelectedCategory,
    setSortBy,
    resetPagination,
    initializeWithData,
  } = useProductsStore();

  // URL synchronization
  useUrlSync();

  // DataTable sorting state
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null | undefined>(1);

  // Initialize store with initial data (only once)
  useEffect(() => {
    if (!isInitialized && initialProducts.length > 0 && initialCategories.length > 0) {
      initializeWithData({
        products: initialProducts,
        categories: initialCategories,
        total: initialTotal,
        skip: initialSkip,
        limit: initialLimit,
      });
    }
  }, [isInitialized, initialProducts, initialCategories, initialTotal, initialSkip, initialLimit, initializeWithData]);

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

  // Sort options
  const sortOptions = [
    { label: 'Nombre (A-Z)', value: 'title-asc' },
    { label: 'Nombre (Z-A)', value: 'title-desc' },
    { label: 'Precio (Menor a Mayor)', value: 'price-asc' },
    { label: 'Precio (Mayor a Menor)', value: 'price-desc' },
    { label: 'Calificación (Mayor a Menor)', value: 'rating-desc' },
    { label: 'Calificación (Menor a Mayor)', value: 'rating-asc' },
  ];

  // Handle pagination
  const onPageChange = useCallback((event: { first: number; rows: number; page: number }) => {
    setSkip(event.first);
    setLimit(event.rows);
  }, [setSkip, setLimit]);

  // Handle filter changes with pagination reset
  const handleCategoryChangeWithReset = useCallback((e: { value: string }) => {
    setSelectedCategory(e.value);
    resetPagination();
  }, [setSelectedCategory, resetPagination]);

  const handleSortChangeWithReset = useCallback((e: { value: string }) => {
    setSortBy(e.value);
    resetPagination();
  }, [setSortBy, resetPagination]);

  // Handle DataTable sorting
  const onSort = useCallback((event: DataTableStateEvent) => {
    setSortField(event.sortField || '');
    setSortOrder(event.sortOrder);
    // Reset to first page when sorting
    resetPagination();
  }, [resetPagination]);

  // Column templates
  const imageBodyTemplate = (product: Product) => {
    return (
      <Image
        src={product.thumbnail}
        alt={product.title}
        width="60"
        height="60"
        className="border-round"
        preview
      />
    );
  };

  const titleBodyTemplate = (product: Product) => {
    return (
      <div className="flex flex-column">
        <span className="font-semibold text-900">{product.title}</span>
        <span className="text-600 text-sm">{truncateText(product.description, 50)}</span>
      </div>
    );
  };

  const priceBodyTemplate = (product: Product) => {
    const discountPrice = product.price * (1 - product.discountPercentage / 100);
    return (
      <div className="flex flex-column">
        <span className="font-semibold text-900">{formatPrice(discountPrice)}</span>
        {product.discountPercentage > 0 && (
          <span className="text-500 text-sm line-through">{formatPrice(product.price)}</span>
        )}
      </div>
    );
  };

  const categoryBodyTemplate = (product: Product) => {
    return (
      <Tag value={capitalize(product.category)} severity="info" />
    );
  };

  const ratingBodyTemplate = (product: Product) => {
    return (
      <div className="flex align-items-center gap-2">
        <span className="font-semibold">{product.rating}</span>
        <i className="pi pi-star-fill text-yellow-500"></i>
      </div>
    );
  };

  const stockBodyTemplate = (product: Product) => {
    const severity = product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger';
    return (
      <Tag value={product.stock.toString()} severity={severity} />
    );
  };

  const brandBodyTemplate = (product: Product) => {
    return <span className="font-medium">{product.sku}</span>;
  };

  // Handle product selection (for future functionality)
  const handleProductSelect = useCallback((event: DataTableSelectEvent) => {
    // TODO: Implement product detail view or modal
    console.log('Product selected:', event.data);
  }, []);

  // Loading state
  if (loading) {
    return (
      <main className={`grid ${className}`}>
        <div className="col-12">
          <div className="flex flex-column gap-4 px-4 py-6">
          {/* Header skeleton */}
          <header className="flex flex-column gap-3">
            <Skeleton width="300px" height="2rem" />
            <div className="flex gap-3">
              <Skeleton width="200px" height="3rem" />
              <Skeleton width="200px" height="3rem" />
            </div>
          </header>

          {/* Chart skeleton */}
          <section className="border-round surface-card p-4" aria-label="Cargando gráfico">
            <Skeleton width="100%" height="300px" />
          </section>

          {/* DataTable skeleton */}
          <section className="border-round surface-card" aria-label="Cargando tabla de productos">
            <div className="p-4">
              <Skeleton width="100%" height="3rem" className="mb-3" />
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex align-items-center gap-3 py-3 border-bottom-1 surface-border">
                  <Skeleton width="60px" height="60px" />
                  <div className="flex-1">
                    <Skeleton width="80%" height="1.5rem" className="mb-2" />
                    <Skeleton width="60%" height="1rem" />
                  </div>
                  <Skeleton width="100px" height="1.5rem" />
                  <Skeleton width="80px" height="1.5rem" />
                  <Skeleton width="60px" height="1.5rem" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className={`grid ${className}`}>
        <div className="col-12">
          <section className="px-4 py-6" aria-label="Mensaje de error">
            <Message
              severity="error"
              text={error}
              aria-label={`Error: ${error}`}
            />
          </section>
        </div>
      </main>
    );
  }

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
          
          {/* Filters and Sort */}
          <ProductFilters
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            categoryOptions={categoryOptions}
            sortOptions={sortOptions}
            onCategoryChange={handleCategoryChangeWithReset}
            onSortChange={handleSortChangeWithReset}
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
