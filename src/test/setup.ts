import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => '/products',
}));

// Mock PrimeReact components to avoid complex rendering issues in tests
vi.mock('primereact/datatable', () => ({
  DataTable: vi.fn(({ children, value, ...props }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'data-table', ...props }, [
      // Render column headers
      React.createElement('div', { key: 'headers' }, [
        React.createElement('div', { key: 'header-image' }, 'Imagen'),
        React.createElement('div', { key: 'header-product' }, 'Producto'),
        React.createElement('div', { key: 'header-price' }, 'Precio'),
        React.createElement('div', { key: 'header-category' }, 'Categoría'),
        React.createElement('div', { key: 'header-rating' }, 'Calificación'),
        React.createElement('div', { key: 'header-stock' }, 'Stock'),
        React.createElement('div', { key: 'header-reviews' }, 'Reviews'),
      ]),
      // Render product data
      React.createElement('div', { key: 'data' }, 
        value && value.map((product: any) => 
          React.createElement('div', { key: product.id }, [
            React.createElement('div', { key: 'title' }, product.title),
            React.createElement('div', { key: 'price' }, `$${product.price}`),
            React.createElement('div', { key: 'category' }, product.category),
            React.createElement('div', { key: 'rating' }, product.rating),
            React.createElement('div', { key: 'stock' }, product.stock),
          ])
        )
      ),
      children
    ]);
  }),
  Column: vi.fn(({ children, header, body, ...props }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'column', ...props }, [
      header && React.createElement('div', { key: 'header' }, header),
      children
    ]);
  }),
}));

vi.mock('primereact/paginator', () => ({
  Paginator: vi.fn((props: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'paginator', ...props });
  }),
}));

vi.mock('primereact/dropdown', () => ({
  Dropdown: vi.fn((props: any) => {
    const React = require('react');
    return React.createElement('select', { 'data-testid': 'dropdown', ...props });
  }),
}));

vi.mock('primereact/inputtext', () => ({
  InputText: vi.fn((props: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'input-text', ...props });
  }),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
