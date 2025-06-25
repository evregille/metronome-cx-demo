"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { useMetronome } from "@/hooks/use-metronome-config";

export function Invoices() {
  const { config, embeddableUrls, getDashboard } = useMetronome();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    (async () => {
      console.log("Invoices component - Theme changed to:", resolvedTheme);
      await getDashboard("invoices", resolvedTheme);
    })();
  }, [config, resolvedTheme, getDashboard]);

  console.log("Invoices component - Current theme:", resolvedTheme);
  console.log("Invoices component - Embeddable URL:", embeddableUrls.invoices);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border shadow-sm">
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Invoices
        </p>
        {embeddableUrls.invoices && embeddableUrls.invoices.length > 0 && (
          <iframe
            id="invoices"
            title={"Metronome Invoices"}
            src={embeddableUrls.invoices}
            width={"100%"}
            height={"500px"}
          />
        )}
      </div>
    </div>
  );
}
