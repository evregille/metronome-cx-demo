import { useEffect, useState } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";

export function PaymentMethods() {
  const { balance, fetchBalance } = useMetronome();

  useEffect(() => {}, []);

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-full items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Payment Methods
        </p>

        <div className="w-full text-3xl font-semibold leading-6"></div>
      </div>
    </div>
  );
}
