"use client";

import { useEffect, useState } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MetronomeAdminForm() {
  const { metronome_config, customers, setMetronome, fetchCustomers } =
    useMetronome();

  const [metronomeApiKey, setMetronomeApiKey] = useState(
    metronome_config.api_key,
  );
  const [metronomeCustomerID, setMetronomeCustomerID] = useState(
    metronome_config.customer_id,
  );
  const [metronomeChartType, setMetronomeChartType] = useState(
    metronome_config.chart_type,
  );

  useEffect(() => {
    (async () => {
      await fetchCustomers(undefined);
    })();
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setMetronome({
      api_key: metronomeApiKey,
      customer_id: metronomeCustomerID,
      chart_type: metronomeChartType,
    });
  };

  const handleInputChange = async function (e: any) {
    switch (e.target.id) {
      case "api_key":
        setMetronomeApiKey(e.target.value);
        await fetchCustomers(e.target.value);
        break;
      case "customer_id":
        setMetronomeCustomerID(e.target.value);
        break;
    }
  };

  const handleSelectChartTypeChange = function (value: string) {
    setMetronomeChartType(value);
  };

  const handleSelectCustomerName = function (value: string) {
    if (value) setMetronomeCustomerID(value);
  };
  return (
    <div className={"grid gap-6"}>
      <form onSubmit={handleOnSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Label className="" htmlFor="api_key">
              Metronone API Token
            </Label>
            <Input
              id="api_key"
              className="flex-8"
              size={32}
              value={metronomeApiKey}
              onChange={handleInputChange}
            />

            <Label className="" htmlFor="id">
              Metronone Customer ID
            </Label>
            <Input
              id="customer_id"
              className="flex-8"
              size={32}
              value={metronomeCustomerID}
              onChange={handleInputChange}
            />

            <Label className="" htmlFor="name">
              Metronone Customer Name
            </Label>
            <Select
              value={
                metronomeCustomerID &&
                customers.filter((el) => el.id === metronomeCustomerID).length >
                  0
                  ? customers.filter((el) => el.id === metronomeCustomerID)[0]
                      .id
                  : undefined
              }
              onValueChange={handleSelectCustomerName}
            >
              <SelectTrigger aria-label="name">
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="customer_id">
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="" htmlFor="usage_chart">
              Chart Type
            </Label>
            <Select
              value={metronomeChartType}
              onValueChange={handleSelectChartTypeChange}
            >
              <SelectTrigger aria-label="chart">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"AreaChart"}>{"AreaChart"}</SelectItem>
                <SelectItem value={"BarChart"}>{"BarChart"}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              variant={true ? "default" : "disable"}
              disabled={false}
              className="w-[67px] shrink-0 px-0 sm:w-[130px]"
            >
              Configure
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
