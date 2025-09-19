import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

/**
 * Loading page for product details
 * Shows skeleton placeholders while product data is being fetched
 */
export default function ProductLoading() {
  return (
    <main className="px-4 py-6">
      <Card className="max-w-4xl mx-auto">
        <header className="flex flex-column gap-4">
          {/* Header skeleton */}
          <nav className="flex align-items-center gap-2" aria-label="Cargando navegación">
            <Skeleton width="2rem" height="2rem" borderRadius="50%" />
            <Skeleton width="20rem" height="2rem" />
          </nav>
          
          {/* Image skeleton */}
          <figure className="flex justify-content-center">
            <Skeleton width="400px" height="400px" borderRadius="8px" />
          </figure>
          
          {/* Thumbnail skeletons */}
          <nav className="flex flex-wrap gap-2 justify-content-center" aria-label="Cargando galería de imágenes">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} width="60px" height="60px" borderRadius="8px" />
            ))}
          </nav>
        </header>
        
        <article className="grid mt-4">
          {/* Product Information */}
          <section className="col-12 md:col-8">
            <div className="flex flex-column gap-4">
              {/* Rating skeleton */}
              <section className="flex align-items-center gap-3" aria-label="Cargando calificación">
                <Skeleton width="8rem" height="1.5rem" />
                <Skeleton width="6rem" height="1rem" />
              </section>

              {/* Description skeleton */}
              <section>
                <Skeleton width="6rem" height="1.5rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="90%" height="1rem" className="mb-2" />
                <Skeleton width="80%" height="1rem" />
              </section>

              {/* Category and SKU skeleton */}
              <section className="grid">
                <div className="col-12 md:col-6">
                  <Skeleton width="5rem" height="1.25rem" className="mb-2" />
                  <Skeleton width="4rem" height="1.5rem" borderRadius="16px" />
                </div>
                <div className="col-12 md:col-6">
                  <Skeleton width="3rem" height="1.25rem" className="mb-2" />
                  <Skeleton width="6rem" height="1rem" />
                </div>
              </section>

              {/* Tags skeleton */}
              <section>
                <Skeleton width="5rem" height="1.25rem" className="mb-2" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} width="4rem" height="1.5rem" borderRadius="16px" />
                  ))}
                </div>
              </section>
            </div>
          </section>

          {/* Product Specifications */}
          <aside className="col-12 md:col-4">
            <div className="flex flex-column gap-4">
              <Skeleton width="8rem" height="1.5rem" />
              
              {Array.from({ length: 6 }).map((_, index) => (
                <dl key={index}>
                  <dt><Skeleton width="6rem" height="1rem" className="mb-1" /></dt>
                  <dd><Skeleton width="8rem" height="1rem" /></dd>
                </dl>
              ))}
            </div>
          </aside>
        </article>
        
        {/* Footer skeleton */}
        <footer className="mt-4 pt-4 border-top-1 surface-border">
          <section className="flex justify-content-between align-items-center mb-3" aria-label="Cargando información de precio y disponibilidad">
            <div className="flex flex-column gap-1">
              <Skeleton width="8rem" height="2rem" />
              <Skeleton width="6rem" height="1rem" />
            </div>
            <div className="flex flex-column align-items-end gap-2">
              <Skeleton width="4rem" height="1.5rem" borderRadius="16px" />
              <Skeleton width="8rem" height="1rem" />
            </div>
          </section>
          <Skeleton width="100%" height="3rem" borderRadius="6px" />
        </footer>
      </Card>
    </main>
  );
}
