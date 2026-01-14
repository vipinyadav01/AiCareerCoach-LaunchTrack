import { useState } from "react";
import { toast } from "sonner";

export default function useFetch(fn) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const wrappedFn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      
      // If the result contains an error, throw it
      if (result?.error && !result?.success) {
        const err = new Error(result.error);
        setError(err);
        toast.error(result.error);
        return result;
      }
      
      return result;
    } catch (err) {
      console.error("useFetch error:", err);
      const errorMessage = err?.message || "An error occurred while processing your request.";
      toast.error(errorMessage);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, fn: wrappedFn };
}
