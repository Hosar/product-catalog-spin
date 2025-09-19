/**
 * ProductChartTemplate component for displaying product review charts in DataTable
 */

import React from 'react';
import { Chart } from 'primereact/chart';
import { countReviewRatings } from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';
import type { Product, Review } from '@/types/product';

interface ProductChartTemplateProps {
  product: Product;
}

/**
 * ProductChartTemplate component displays a bar chart of product review ratings
 * @param props - Component props containing the product data
 * @returns JSX element representing product review chart
 */
export const ProductChartTemplate: React.FC<ProductChartTemplateProps> = ({ product }) => {
  const reviews = countReviewRatings(product.reviews as Review[]);
  
  const data = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: reviews || [],
        backgroundColor: CHART_COLORS,
        hoverBackgroundColor: CHART_COLORS
      }
    ]
  };

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
