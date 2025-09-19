export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Review {
  // Define review properties based on your actual review structure
  [key: string]: any;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface CategoryOption {
  label: string;
  value: string;
}

export interface PaginationEvent {
  first: number;
  page: number;
  pageCount: number;
  rows: number;
}


export interface DropdownChangeEvent {
  value: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: 'bottom';
      labels: {
        usePointStyle: boolean;
        padding: number;
      };
    };
    tooltip: {
      callbacks: {
        label: (context: { parsed: { y: number } }) => string;
      };
    };
  };
  scales: {
    y: {
      beginAtZero: boolean;
      ticks: {
        callback: (value: number) => string;
      };
    };
  };
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
