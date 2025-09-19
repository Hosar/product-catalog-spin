# Testing Setup

This directory contains the testing configuration and utilities for the Product Catalog application.

## Testing Framework

- **Vitest**: Fast unit test framework with excellent TypeScript support
- **React Testing Library**: For testing React components with a focus on user behavior
- **MSW (Mock Service Worker)**: For mocking API calls in tests
- **jsdom**: DOM environment for testing browser APIs

## Test Structure

```
src/test/
├── setup.ts                 # Global test setup and mocks
├── mocks/
│   ├── handlers.ts          # MSW request handlers for API mocking
│   └── server.ts            # MSW server configuration
└── README.md               # This file

src/
├── utils/__tests__/         # Utility function tests
├── hooks/__tests__/         # Custom hook tests
└── app/
    └── api/__tests__/       # API route tests
    └── (pages)/__tests__/   # Component and integration tests
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Categories

### 1. Unit Tests
- **Utility Functions** (`src/utils/__tests__/`): Test pure functions like formatters and constants
- **Custom Hooks** (`src/hooks/__tests__/`): Test React hooks in isolation
- **API Routes** (`src/app/api/__tests__/`): Test API endpoints with mocked external calls

### 2. Component Tests
- **React Components** (`src/app/(pages)/__tests__/`): Test component rendering and user interactions
- **Integration Tests**: Test component integration with API calls and state management

## Mocking Strategy

### API Mocking
- **MSW**: Intercepts HTTP requests and returns mock responses
- **External APIs**: DummyJSON API calls are mocked to avoid network dependencies
- **Error Scenarios**: Network errors, API errors, and invalid responses are tested

### Component Mocking
- **PrimeReact Components**: Mocked to avoid complex rendering issues in tests
- **Next.js Navigation**: Router and navigation hooks are mocked
- **External Dependencies**: Chart.js and other external libraries are mocked

## Test Data

Mock data is defined in `src/test/mocks/handlers.ts` and includes:
- Sample products with realistic data
- Product categories
- API response structures matching DummyJSON format

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Mock External Dependencies**: Don't make real API calls in tests
3. **Test Error Scenarios**: Ensure graceful error handling
4. **Use Descriptive Test Names**: Make it clear what each test verifies
5. **Keep Tests Independent**: Each test should be able to run in isolation

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## Debugging Tests

1. **Use `test:ui`**: Visual interface for running and debugging tests
2. **Add `console.log`**: Temporary debugging in test files
3. **Use `screen.debug()`**: Print current DOM state in component tests
4. **Check MSW Handlers**: Verify mock responses are correct

## Adding New Tests

1. **Create test file**: Use `.test.ts` or `.test.tsx` extension
2. **Import dependencies**: Use the same imports as the source file
3. **Mock external dependencies**: Use the existing mock setup
4. **Write descriptive tests**: Follow the existing patterns
5. **Update this README**: Document any new testing patterns or utilities
