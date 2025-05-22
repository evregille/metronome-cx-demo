import { useEffect } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";

interface CurrentSpend {
  total: number;
  productTotals: Record<string, number>;
}

export function CurrentInvoiceTotal() {
  const { currentSpend, fetchCurrentSpend } = useMetronome();

  useEffect(() => {
    (async () => {
      await fetchCurrentSpend();
    })();
  }, []);

  // Format currency with proper thousand separators and 2 decimal places
  const formatCurrency = (amount: number): string => {
    return (amount / 100)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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

        <div className="mb-4 w-full text-3xl font-semibold leading-6">
          $ {!currentSpend ? 0 : formatCurrency(currentSpend.total)}
        </div>

        {/* Product breakdown section */}
        {currentSpend?.productTotals &&
          Object.keys(currentSpend.productTotals).length > 0 && (
            <div className="border-t border-muted pt-4">
              <p className="mb-3 font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Breakdown by Product
              </p>

              <div className="space-y-2">
                {Object.entries(currentSpend.productTotals).map(
                  ([productName, total], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {productName}
                      </span>
                      <span className="text-sm font-medium">
                        $ {formatCurrency(total)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
