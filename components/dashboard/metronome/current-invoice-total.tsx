import { useEffect } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";

export function CurrentInvoiceTotal() {
  const { current_spend, fetchCurrentSpend } = useMetronome();

  useEffect(() => {
    (async () => {
      await fetchCurrentSpend();
    })();
  }, []);

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-full items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Total Current Invoice
        </p>

        <div className="w-full text-3xl font-semibold leading-6">
          ${" "}
          {current_spend === undefined
            ? 0
            : (current_spend / 100)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
    </div>
  );
}
