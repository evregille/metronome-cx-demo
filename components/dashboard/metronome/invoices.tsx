"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { useMetronome } from "@/hooks/use-metronome-config";

export function Invoices() {
  const { metronome_config, embeddable_url, getDashboard } = useMetronome();
  const { resolvedTheme } = useTheme();


  useEffect( () => {
    
  }, [resolvedTheme]);

  useEffect(() => {
    (async () => {
      await getDashboard("invoices", resolvedTheme);
    })();
    const x = document.getElementById("invoices");
    // if( x && resolvedTheme === "dark"){
      if (x) x.style.backgroundColor = "black";
    // } else if (x) x.style.backgroundColor = "white"
  }, [metronome_config, resolvedTheme]);

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Invoices
        </p>
        {embeddable_url.invoices && embeddable_url.invoices.length > 0 && (
          <iframe
            id="invoices"
            title={"Metronome Invoices"}
            src={embeddable_url.invoices}
            width={"100%"}
            height={"500px"}
          />
        )}
      </div>

      <div>
      </div>
    </div>
  );
}
