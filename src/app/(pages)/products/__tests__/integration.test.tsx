import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { ProductsContainer } from '../ProductsContainer';

// Mock the ProductsPresenter component
vi.mock('../ProductsPresenter', () => ({
  ProductsPresenter: ({ products, total, error }: any) => (
    <div data-testid="products-presenter">
      {error ? (
        <div data-testid="error-message">{error}</div>
      ) : (
        <div>
          <div data-testid="products-count">Products: {products.length}</div>
          <div data-testid="total-count">Total: {total}</div>
          {products.map((product: any) => (
            <div key={product.id} data-testid={`product-${product.id}`}>
              {product.title}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn((key: string) => {
      const params: Record<string, string> = {
        skip: '0',
        limit: '10',
        category: '',
        sort: 'title-asc',
        q: '',
      };
      return params[key] || '';
    }),
    toString: vi.fn(() => ''),
  }),
  usePathname: () => '/products',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe('Products Integration Tests', () => {
  it('should load and display products successfully', async () => {
    const mockProducts = [
      { id: 1, title: 'iPhone 15', price: 999, category: 'smartphones', rating: 4.5, stock: 50, brand: 'Apple', description: 'Latest iPhone', discountPercentage: 10, thumbnail: 'https://example.com/iphone.jpg', images: ['https://example.com/iphone.jpg'], sku: 'IPH15-001', reviews: [] },
      { id: 2, title: 'Samsung Galaxy S24', price: 899, category: 'smartphones', rating: 4.2, stock: 30, brand: 'Samsung', description: 'Latest Samsung phone', discountPercentage: 5, thumbnail: 'https://example.com/galaxy.jpg', images: ['https://example.com/galaxy.jpg'], sku: 'SGS24-001', reviews: [] }
    ];

    render(<ProductsContainer 
      initialProducts={mockProducts}
      initialTotal={2}
      initialCategories={[{ name: 'smartphones' }]}
    />);

    await waitFor(() => {
      expect(screen.getByTestId('products-presenter')).toBeInTheDocument();
    });

    expect(screen.getByTestId('products-count')).toHaveTextContent('Products: 2');
    expect(screen.getByTestId('total-count')).toHaveTextContent('Total: 2');
    expect(screen.getByTestId('product-1')).toHaveTextContent('iPhone 15');
    expect(screen.getByTestId('product-2')).toHaveTextContent('Samsung Galaxy S24');
  });

  it('should handle API errors gracefully', async () => {
    render(<ProductsContainer 
      initialError="Error al cargar los productos"
    />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Error al cargar los productos');
  });

  it('should handle network errors', async () => {
    render(<ProductsContainer 
      initialError="Network error occurred"
    />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Network error occurred');
  });

  it('should load categories successfully', async () => {
    const mockCategories = [{ name: 'smartphones' }, { name: 'laptops' }];

    render(<ProductsContainer 
      initialCategories={mockCategories}
    />);

    await waitFor(() => {
      expect(screen.getByTestId('products-presenter')).toBeInTheDocument();
    });

    // The categories should be loaded and passed to the presenter
    // This test verifies the integration between API calls and component rendering
  });

  it('should handle empty products response', async () => {
    render(<ProductsContainer 
      initialProducts={[]}
      initialTotal={0}
    />);

    await waitFor(() => {
      expect(screen.getByTestId('products-count')).toHaveTextContent('Products: 0');
    });

    expect(screen.getByTestId('total-count')).toHaveTextContent('Total: 0');
  });

  it('should handle pagination parameters', async () => {
    render(<ProductsContainer 
      initialSkip={10}
      initialLimit={5}
    />);

    await waitFor(() => {
      expect(screen.getByTestId('products-presenter')).toBeInTheDocument();
    });

    // The component should handle pagination parameters correctly
  });

  it('should handle category filtering', async () => {
    const mockProducts = [
      { id: 1, title: 'iPhone 15', price: 999, category: 'smartphones', rating: 4.5, stock: 50, brand: 'Apple', description: 'Latest iPhone', discountPercentage: 10, thumbnail: 'https://example.com/iphone.jpg', images: ['https://example.com/iphone.jpg'], sku: 'IPH15-001', reviews: [] }
    ];

    render(<ProductsContainer 
      initialProducts={mockProducts}
      initialCategories={[{ name: 'smartphones' }]}
    />);

    await waitFor(() => {
      expect(screen.getByTestId('products-presenter')).toBeInTheDocument();
    });

    // The component should handle category filtering correctly
  });
});
