// Hook générique de récupération de données.
// useFetch(fetchFn, deps) → { data, loading, error, refetch }.
import { useState, useEffect, useCallback, useRef } from 'react';

export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Suit l'état de montage pour éviter les updates après démontage.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Exécute la requête ; ignore le résultat si le composant est démonté.
  const runFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Au montage et à chaque changement de deps.
  useEffect(() => {
    runFetch();
  }, [runFetch]);

  return { data, loading, error, refetch: runFetch };
};

export default useFetch;
