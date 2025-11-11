"use client";

import { useEffect, useState } from "react";
import { Role } from "@prisma/client";

interface User {
  id: string;
  name: string;
  role: Role;
  validUntil?: string | null;
}

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) return setUser(null);

        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { user, loading, isViewer: user?.role === "VIEWER", isAdmin: user?.role === "ADMIN" };
}
