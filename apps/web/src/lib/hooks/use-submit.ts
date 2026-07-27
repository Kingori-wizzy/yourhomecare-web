import { useState } from "react";

export function useSubmit() {
  const [loading, setLoading] = useState(false);

  async function submit(
    url: string,
    data: unknown
  ) {
    try {
      setLoading(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    submit,
  };
}