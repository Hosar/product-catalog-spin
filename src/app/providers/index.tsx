'use client'
import React from "react";
import { PrimeReactProvider } from 'primereact/api';

export function Providers({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <PrimeReactProvider>{children}</PrimeReactProvider>
  );
}