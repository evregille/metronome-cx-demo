import { useEffect } from "react";

import { MetronomeTopUpForm } from "@/components/forms/metronome-topup-form";

export function Topup() {
  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Recharge your credits
        </p>
        <div className="flex flex-row">
          {/* <div className="flex items-end">
                <div className="flex text-left text-3xl font-semibold leading-6"> */}
          <MetronomeTopUpForm />
          {/* </div> */}
          {/* <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
                    <div>/month</div>
                </div> */}
          {/* </div> */}
        </div>

        <div className="text-left text-sm text-muted-foreground"></div>
      </div>
    </div>
  );
}
