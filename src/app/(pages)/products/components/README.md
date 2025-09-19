# Product Search Component

## Overview
The `ProductSearch` component provides a search functionality for products with the following features:

- **Manual Search**: Search is triggered only when the search button is clicked or Enter key is pressed
- **AbortController**: Cancels previous requests when new ones are made
- **URL State Management**: Search query is synchronized with URL parameters
- **Clear Functionality**: Easy way to clear the search
- **Cancel Functionality**: Cancel ongoing search requests

## API Integration
The component calls the local API endpoint:
```
/api/products/search?q={query}&limit={limit}&skip={skip}
```

## Usage
```tsx
import { ProductSearch } from './components/ProductSearch';

// In your component
<ProductSearch />
```

## UI Components
- **Search Input**: Text input with search icon and clear button
- **Search Button**: Triggers the search (disabled when input is empty or loading)
- **Cancel Button**: Appears during search to cancel ongoing requests
- **Loading State**: Search button shows loading spinner during search

## Features

### Manual Search Trigger
- Search is only triggered when the user clicks the "Buscar" button
- Also triggered when the user presses Enter in the search input
- No automatic search while typing to give users full control

### Request Cancellation
- Uses `AbortController` to cancel previous requests
- Cancel button appears during search to allow users to stop ongoing requests
- Prevents race conditions when user starts new searches
- Automatically cleans up on component unmount

### URL Synchronization
- Search query is stored in URL as `?q=searchterm`
- Browser back/forward buttons work correctly
- Direct links with search queries work
- Integrates with existing URL state management

### State Management
- Uses Zustand store for global state
- Search state is persisted in localStorage
- Integrates with existing pagination and filtering

## Implementation Details

### Store Integration
The component integrates with the products store:
- `searchQuery`: Current search term
- `setSearchQuery`: Updates search term
- `searchProducts`: Performs the search API call
- `resetPagination`: Resets pagination when searching
- `resetSearch`: Clears search state

### URL Sync
The search query is automatically synchronized with URL parameters through the `useUrlSync` hook:
- Updates URL when search query changes
- Initializes search from URL on page load
- Handles browser navigation correctly

### Error Handling
- Network errors are handled gracefully
- Aborted requests don't cause errors
- User-friendly error messages displayed

## Example API Call
```javascript
// When user searches for "phone"
GET /api/products/search?q=phone&limit=10&skip=0

// Response
{
  "products": [...],
  "total": 25,
  "skip": 0,
  "limit": 10
}
```

## Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Clear button with proper focus management
