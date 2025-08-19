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
          Manage Payment Methods
        </p>
        
        <div className="flex flex-col gap-4">
        
          
          {/* Card Details */}
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Visa ending in 4242</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>John Doe</div>
              <div>Expires 12/25</div>
            </div>
          </div>
          
          {/* Add New Card Button */}
          <button className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
