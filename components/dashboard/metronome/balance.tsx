import { useEffect, useState } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";

export function Balance() {
  const { metronome_config, balance, fetchBalance } = useMetronome();

  useEffect(() => {
    (async () => {
      await fetchBalance();
    })();
  }, [metronome_config, ]);

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-full items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Balance
        </p>

        <div className="w-full text-3xl font-semibold leading-6">
          ${" "}
          {balance.total_granted === undefined ||
          balance.total_used === undefined
            ? "N/A"
            : ((balance.total_granted - balance.total_used) / 100)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
    </div>
  );
}
