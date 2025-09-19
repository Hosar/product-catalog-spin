import Link from 'next/link';
import { Button } from 'primereact/button';

/**
 * Not found page for product details
 * Displays when a product ID doesn't exist or is invalid
 */
export default function ProductNotFound() {
  return (
    <main className="px-4 py-6">
      <section className="flex flex-column align-items-center justify-content-center min-h-screen">
        <article className="text-center">
          <i className="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4" aria-hidden="true"></i>
          <h1 className="text-4xl font-bold text-900 mb-3">
            Producto no encontrado
          </h1>
          <p className="text-xl text-600 mb-4 max-w-md">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <nav className="flex gap-3 justify-content-center" aria-label="Opciones de navegación">
            <Link href="/products">
              <Button 
                label="Ver todos los productos" 
                icon="pi pi-list"
                size="large"
                aria-label="Ir a la lista de todos los productos"
              />
            </Link>
            <Link href="/">
              <Button 
                label="Ir al inicio" 
                icon="pi pi-home"
                severity="secondary"
                size="large"
                aria-label="Volver a la página de inicio"
              />
            </Link>
          </nav>
        </article>
      </section>
    </main>
  );
}
