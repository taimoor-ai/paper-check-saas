import { useEffect, useState } from "react";
import api from "../lib/api";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api.get("/auth/me")
      .then((response) => {
        if (!cancelled) {
          setUser(response.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.detail || "Unable to load account data.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error };
}
