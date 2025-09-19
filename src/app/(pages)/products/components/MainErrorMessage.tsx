'use client';
import React from 'react';
import { Message } from 'primereact/message';

interface MainErrorMessageProps {
  error: string;
  className?: string;
}

/**
 * Component for displaying main error messages in the application
 * Provides consistent error UI with proper accessibility attributes
 */
export const MainErrorMessage: React.FC<MainErrorMessageProps> = ({
  error,
  className = ''
}) => {
  return (
    <main className={`grid ${className}`}>
      <div className="col-12">
        <section className="px-4 py-6" aria-label="Mensaje de error">
          <Message
            severity="error"
            text={error}
            aria-label={`Error: ${error}`}
          />
        </section>
      </div>
    </main>
  );
};
