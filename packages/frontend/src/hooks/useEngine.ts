import { useState, useEffect } from "react";

interface EngineHealth {
  status: string;
  service: string;
  version?: string;
  timestamp: string;
}

interface EngineReady {
  ready: boolean;
  checks: Record<string, { status: string; latencyMs?: number; detail?: string }>;
}

export function useEngineHealth() {
  const [health, setHealth] = useState<EngineHealth | null>(null);
  const [ready, setReady] = useState<EngineReady | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) { setLoading(false); return; }

        const [hResp, rResp] = await Promise.all([
          fetch(`${apiUrl}/health`, { headers: { Origin: "https://buildsignal.net" } }),
          fetch(`${apiUrl}/ready`, { headers: { Origin: "https://buildsignal.net" } }),
        ]);

        if (hResp.ok) setHealth(await hResp.json());
        if (rResp.ok) setReady(await rResp.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  return { health, ready, loading, error };
}
