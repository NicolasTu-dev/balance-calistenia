"use client";

import { useEffect } from "react";

export default function CodeRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    const next = url.searchParams.get("next") || "/app";
    window.location.replace(
      `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`
    );
  }, []);

  return null;
}
