/**
 * ProductChart component for displaying price analysis
 */

import React, { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import type { Product, ChartData, ChartOptions } from '@/types/product';
import { CHART_COLORS } from '@/utils/constants';

interface ProductChartProps {
  products: Product[];
  className?: string;
}

/**
 * ProductChart component displays average price per category
 * @param props - Component props
 * @returns JSX element representing a price analysis chart
 */
export const ProductChart: React.FC<ProductChartProps> = ({ 
  products, 
  className = '' 
}) => {
  // Calculate average price per category for chart
  const chartData: ChartData = useMemo(() => {
    const categoryPrices: { [key: string]: number[] } = {};
    
    products.forEach(product => {
      if (!categoryPrices[product.category]) {
        categoryPrices[product.category] = [];
      }
      categoryPrices[product.category]!.push(product.price);
    });

    const labels = Object.keys(categoryPrices);
    const data = labels.map(category => {
      const prices = categoryPrices[category]!;
      return prices.reduce((sum, price) => sum + price, 0) / prices.length;
    });

    return {
      labels,
      datasets: [{
        label: 'Precio Promedio por Categoría',
        data,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderColor: CHART_COLORS.slice(0, labels.length).map(color => color + '80'),
        borderWidth: 2
      }]
    };
  }, [products]);

  // Chart options
  const chartOptions: ChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `Precio promedio: $${context.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    }
  }), []);

  return (
    <Card className={className}>
      <section className="flex flex-column gap-3">
        <h2 
          className="text-xl font-semibold m-0" 
          aria-label="Gráfico de precios promedio por categoría"
        >
          Precio Promedio por Categoría
        </h2>
        <figure style={{ height: '300px' }}>
          <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
            aria-label="Gráfico de barras mostrando el precio promedio de cada categoría de productos"
          />
        </figure>
      </section>
    </Card>
  );
};
