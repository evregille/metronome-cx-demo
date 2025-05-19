import { useEffect } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";

interface CurrentSpend {
  total: number;
  productTotals: Record<string, number>;
}

export function CurrentInvoiceTotal() {
  const { current_spend, fetchCurrentSpend } = useMetronome() as { 
    current_spend: CurrentSpend | undefined; 
    fetchCurrentSpend: () => Promise<void>; 
  };

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

        <div className="w-full text-3xl font-semibold leading-6 mb-4">
          ${" "}
          {current_spend === undefined || current_spend.total === undefined
            ? 0
            : formatCurrency(current_spend.total)}
        </div>
        
        {/* Product breakdown section */}
        {current_spend?.productTotals && Object.keys(current_spend.productTotals).length > 0 && (
          <div className="pt-4 border-t border-muted">
            <p className="font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Breakdown by Product
            </p>
            
            <div className="space-y-2">
              {Object.entries(current_spend.productTotals).map(([productName, total], index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{productName}</span>
                  <span className="text-sm font-medium">
                    $ {formatCurrency(total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
