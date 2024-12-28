import { useEffect, useState } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MetronomeAlertForm } from "@/components/forms/metronome-alert-form";

export function SpendAlerts() {
  const { fetchAlerts, createAlert } = useMetronome();
  const [isSpendAlertOn, setIsSpendAlertOn] = useState<boolean>(false);
  const [currentThreshold, setCurrentThreshold] = useState<number>(1000);

  useEffect(() => {
    (async () => {
      const response = await fetchAlerts();
      if (response && response.length > 0) {
        setIsSpendAlertOn(true);
        setCurrentThreshold(0);
      }
      console.log(response);
    })();
  }, []);

  const handleToggle = () => {
    setIsSpendAlertOn(!isSpendAlertOn);
  };

  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
      }
    >
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Spend Limits
        </p>

        {/* Switch */}
        <div className="flex pt-[5%] text-left text-3xl font-semibold leading-6">
          <Switch checked={isSpendAlertOn} onCheckedChange={handleToggle} />
          <Label className="indent-1.5 align-middle" htmlFor="name">
            Turn {isSpendAlertOn === true ? "OFF" : "ON"} Spend Alerts
          </Label>
        </div>

        {/* Spend Threshold Input */}
        {isSpendAlertOn === true && (
          <div className="flex text-left align-middle text-3xl font-semibold leading-6">
            <MetronomeAlertForm />
          </div>
        )}
      </div>
      {/* </div> */}
    </div>
  );
}
