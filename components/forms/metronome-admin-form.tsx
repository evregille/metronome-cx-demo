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
  const { config, customers, setConfig, fetchCustomers } = useMetronome();

  const [metronomeApiKey, setMetronomeApiKey] = useState(config.api_key);
  const [metronomeCustomerID, setMetronomeCustomerID] = useState(
    config.customer_id,
  );
  const [metronomeChartType, setMetronomeChartType] = useState<
    "BarChart" | "LineChart" | "PieChart"
  >(config.chart_type);

  useEffect(() => {
    (async () => {
      await fetchCustomers(undefined);
    })();
  }, [config.api_key, fetchCustomers]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setConfig({
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

  const handleSelectChartTypeChange = function (
    value: "BarChart" | "LineChart" | "PieChart",
  ) {
    setMetronomeChartType(value);
  };

  const handleSelectCustomerName = function (value: string) {
    if (value) setMetronomeCustomerID(value);
  };

  console.log("cust", metronomeCustomerID);

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
                <SelectItem value={"LineChart"}>{"Line Chart"}</SelectItem>
                <SelectItem value={"BarChart"}>{"Bar Chart"}</SelectItem>
                <SelectItem value={"PieChart"}>{"Pie Chart"}</SelectItem>
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
