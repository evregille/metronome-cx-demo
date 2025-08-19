import { useEffect, useState } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";
import { Button } from "@/components/ui/button";

export function Balance() {
  const { config, balance, fetchBalance } = useMetronome();

  useEffect(() => {
    (async () => {
      await fetchBalance();
    })();
  }, [config, fetchBalance]);

  // Format currency with proper thousand separators and 2 decimal places
  const formatCurrency = (amount: number): string => {
    return (amount / 100)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate percentage of balance used
  const calculateUsagePercentage = () => {
    if (!balance) return 0;

    const percentage = (balance.total_used / balance.total_granted) * 100;
    return Math.min(100, Math.max(0, percentage)); // Ensure between 0-100
  };

  const usagePercentage = calculateUsagePercentage();
  const isApproachingLimit = usagePercentage > 75;
  const isAtLimit = usagePercentage >= 90;

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-full items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Your Balance
        </p>

        <div className="mb-4 w-full text-3xl font-semibold leading-6">
          ${" "}
          {!balance
            ? "N/A"
            : formatCurrency(balance.total_granted - balance.total_used)}
        </div>

        {/* Progress bar showing usage */}
        {balance && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              {/* <span className="text-muted-foreground">
                ${formatCurrency(balance.total_used)} used
              </span>
              <span className="text-muted-foreground">
                ${formatCurrency(balance.total_granted)} granted
              </span> */}
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${
                  isAtLimit
                    ? "bg-red-500"
                    : isApproachingLimit
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${usagePercentage}%` }}
                aria-label={`${usagePercentage.toFixed(1)}% used`}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              {/* <span>{formatCurrency(balance.total_used)} / {formatCurrency(balance.total_granted)}</span> */}
              <span>{usagePercentage.toFixed(1)}% used</span>
            </div>
          </div>
        )}
        <Button
          type="submit"
          variant={true ? "default" : "disable"}
          disabled={false}
          className="w-[67px] shrink-0 px-0 sm:w-[130px]"
        >
          Set Notifications
        </Button>
      </div>
    </div>
  );
}
