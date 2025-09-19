import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css'
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catálogo de Productos",
  description: "Explora nuestro catálogo de productos con filtros, ordenamiento y análisis de precios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
            <Providers>
                {children}
            </Providers>
          </main>
      </body>
    </html>
  );
}
