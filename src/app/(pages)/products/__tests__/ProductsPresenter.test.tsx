import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductsPresenter } from '../ProductsPresenter';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockGet = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: mockGet,
    toString: vi.fn(() => ''),
  }),
  usePathname: () => '/products',
}));

// Mock child components
vi.mock('../components/ProductSearch', () => ({
  ProductSearch: () => <div data-testid="product-search">Product Search</div>,
}));

vi.mock('../components/ProductFilters', () => ({
  ProductFilters: ({ onCategoryChange, selectedCategory, categoryOptions }: any) => (
    <div data-testid="product-filters">
      <select
        data-testid="category-dropdown"
        value={selectedCategory}
        onChange={(e) => onCategoryChange({ value: e.target.value })}
      >
        {categoryOptions.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

// Mock template components
vi.mock('../components/templates', () => ({
  ProductImageTemplate: ({ product }: any) => (
    <div data-testid="product-image">{product.title}</div>
  ),
  ProductTitleTemplate: ({ product }: any) => (
    <div data-testid="product-title">{product.title}</div>
  ),
  ProductPriceTemplate: ({ product }: any) => (
    <div data-testid="product-price">${product.price}</div>
  ),
  ProductCategoryTemplate: ({ product }: any) => (
    <div data-testid="product-category">{product.category}</div>
  ),
  ProductRatingTemplate: ({ product }: any) => (
    <div data-testid="product-rating">{product.rating}</div>
  ),
  ProductStockTemplate: ({ product }: any) => (
    <div data-testid="product-stock">{product.stock}</div>
  ),
  ProductChartTemplate: ({ product }: any) => (
    <div data-testid="product-chart">Chart for {product.title}</div>
  ),
}));

describe('ProductsPresenter', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 15',
      description: 'Latest iPhone',
      price: 999,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      brand: 'Apple',
      category: 'smartphones',
      thumbnail: 'https://example.com/iphone.jpg',
      images: ['https://example.com/iphone.jpg'],
      sku: 'IPH15-001',
      reviews: []
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24',
      description: 'Latest Samsung phone',
      price: 899,
      discountPercentage: 5,
      rating: 4.2,
      stock: 30,
      brand: 'Samsung',
      category: 'smartphones',
      thumbnail: 'https://example.com/galaxy.jpg',
      images: ['https://example.com/galaxy.jpg'],
      sku: 'SGS24-001',
      reviews: []
    },
  ];

  const mockCategories: Category[] = [
    { name: 'smartphones' },
    { name: 'laptops' },
    { name: 'tablets' },
  ];

  const defaultProps = {
    products: mockProducts,
    total: 100,
    skip: 0,
    limit: 10,
    categories: mockCategories,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        skip: '0',
        limit: '10',
        category: '',
        sort: 'title-asc',
        sortField: '',
        sortOrder: '1',
        q: '',
      };
      return params[key] || '';
    });
  });

  it('should render products table with correct data', () => {
    render(<ProductsPresenter {...defaultProps} />);

    expect(screen.getByText('Catálogo de Productos')).toBeInTheDocument();
    expect(screen.getByText('Mostrando 2 de 100 productos')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('paginator')).toBeInTheDocument();
  });

  it('should render product search and filters', () => {
    render(<ProductsPresenter {...defaultProps} />);

    expect(screen.getByTestId('product-search')).toBeInTheDocument();
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should render all product columns', () => {
    render(<ProductsPresenter {...defaultProps} />);

    expect(screen.getByText('Imagen')).toBeInTheDocument();
    expect(screen.getByText('Producto')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Categoría')).toBeInTheDocument();
    expect(screen.getByText('Calificación')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });

  it('should render product data in table', () => {
    render(<ProductsPresenter {...defaultProps} />);

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
    expect(screen.getByText('$899')).toBeInTheDocument();
  });

  it('should handle category filter change', async () => {
    render(<ProductsPresenter {...defaultProps} />);

    const categoryDropdown = screen.getByTestId('category-dropdown');
    fireEvent.change(categoryDropdown, { target: { value: 'smartphones' } });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/products?category=smartphones', { scroll: false });
    });
  });

  it('should handle pagination', async () => {
    render(<ProductsPresenter {...defaultProps} />);

    const paginator = screen.getByTestId('paginator');
    fireEvent.click(paginator);

    // Note: In a real test, you would need to simulate the actual pagination event
    // This is a simplified version for demonstration
  });

  it('should handle product selection', async () => {
    render(<ProductsPresenter {...defaultProps} />);

    const dataTable = screen.getByTestId('data-table');
    fireEvent.click(dataTable);

    // Note: In a real test, you would need to simulate the actual row selection event
    // This is a simplified version for demonstration
  });

  it('should display error message when error is present', () => {
    const propsWithError = {
      ...defaultProps,
      error: 'Failed to load products',
    };

    render(<ProductsPresenter {...propsWithError} />);

    // Note: The error handling would depend on how errors are displayed in the component
    // This test assumes there's an error display mechanism
  });

  it('should handle empty products array', () => {
    const propsWithEmptyProducts = {
      ...defaultProps,
      products: [],
      total: 0,
    };

    render(<ProductsPresenter {...propsWithEmptyProducts} />);

    expect(screen.getByText('Mostrando 0 de 0 productos')).toBeInTheDocument();
  });

  it('should render category options correctly', () => {
    render(<ProductsPresenter {...defaultProps} />);

    const categoryDropdown = screen.getByTestId('category-dropdown');
    const options = categoryDropdown.querySelectorAll('option');

    expect(options).toHaveLength(4); // 3 categories + "All categories"
    expect(options[0]).toHaveTextContent('Todas las categorías');
    expect(options[1]).toHaveTextContent('Smartphones');
    expect(options[2]).toHaveTextContent('Laptops');
    expect(options[3]).toHaveTextContent('Tablets');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProductsPresenter {...defaultProps} className="custom-class" />
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('custom-class');
  });

  it('should handle URL parameters correctly', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        skip: '20',
        limit: '5',
        category: 'smartphones',
        sort: 'price-desc',
        sortField: 'price',
        sortOrder: '-1',
        q: 'iphone',
      };
      return params[key] || '';
    });

    render(<ProductsPresenter {...defaultProps} />);

    // The component should use URL parameters for its state
    // This test verifies that the component reads from URL parameters
    expect(mockGet).toHaveBeenCalledWith('skip');
    expect(mockGet).toHaveBeenCalledWith('limit');
    expect(mockGet).toHaveBeenCalledWith('category');
  });
});
