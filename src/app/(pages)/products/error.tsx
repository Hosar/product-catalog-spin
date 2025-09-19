'use client';
import { useEffect } from "react";
import { MainErrorMessage } from "./components/MainErrorMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught error:", error);
  }, [error]);

  return (
    <MainErrorMessage error={error.message}  />
  );
}
