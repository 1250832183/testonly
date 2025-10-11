"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化 Microsoft Clarity
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (clarityId) {
      Clarity.init(clarityId);
    }
  }, []);

  return <>{children}</>;
}

