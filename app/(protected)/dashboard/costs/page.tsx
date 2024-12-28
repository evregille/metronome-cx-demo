"use client";

import { useEffect, useState } from "react";

import { useMetronome } from "@/hooks/use-metronome-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { BarChartStacked } from "@/components/charts/bar-chart-stacked";
import { DashboardHeader } from "@/components/dashboard/header";
import { CurrentInvoiceTotal } from "@/components/dashboard/metronome/current-invoice-total";
import { PaymentMethods } from "@/components/dashboard/metronome/payment-methods";
import { SpendAlerts } from "@/components/dashboard/metronome/spend-alerts";

export default function Costs() {
  const { costs, metronome_config, fetchCosts } = useMetronome();
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [groupValues, setGroupValues] = useState<Array<string>>(
    Object.keys(costs.products),
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  useEffect(() => {
    (async () => {
      const result = await fetchCosts();
      setGroupValues(Object.keys(result.products));
    })();
  }, []);

  const handleSelectProduct = (value: string) => {
    setSelectedProduct(value);
    setSelectedFilter("none");

    if (value === "all") {
      // all products so we group by product
      setGroupValues(Object.keys(costs.products));
    } else {
      // single product
      setGroupValues([value]);
    }
  };

  const handleSelectFilter = (value: string) => {
    setSelectedFilter(value);
    if (value === "none") {
      setGroupValues([selectedProduct]);
    } else {
      setGroupValues(costs.products[selectedProduct][value]);
    }
  };

  return (
    <>
      <DashboardHeader
        heading="Costs"
        text="Understand your costs and how you can control it."
      />
      <div className="grid grid-cols-3 gap-4 align-middle">
        <CurrentInvoiceTotal />

        <SpendAlerts />

        <PaymentMethods />
      </div>

      <div
        className={
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
        }
      >
        <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
          <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Daily Breakdown Costs
          </p>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
              <div className="text-base text-muted-foreground">
                Filter By Product
              </div>
              <div className="text-base text-muted-foreground">Group By</div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
              <Select
                value={selectedProduct}
                onValueChange={handleSelectProduct}
              >
                <SelectTrigger aria-label="Product">
                  <SelectValue placeholder={"All"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>{"All"}</SelectItem>
                  {costs.products &&
                    Object.keys(costs.products).length > 0 &&
                    Object.keys(costs.products).map((k: string) => {
                      return (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>

              <Select value={selectedFilter} onValueChange={handleSelectFilter}>
                <SelectTrigger aria-label="Filter">
                  <SelectValue placeholder={"None"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"none"}>{"None"}</SelectItem>
                  {selectedProduct !== "all" &&
                    Object.keys(costs.products[selectedProduct]).length > 0 &&
                    Object.keys(costs.products[selectedProduct]).map(
                      (k: string) => {
                        return (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        );
                      },
                    )}
                </SelectContent>
              </Select>
            </div>

            <>
              {metronome_config.chart_type === "AreaChart" && (
                <AreaChartStacked
                  chartData={costs.items}
                  group_values={groupValues}
                />
              )}

              {metronome_config.chart_type === "BarChart" && (
                <BarChartStacked
                  chartData={costs.items}
                  group_values={groupValues}
                />
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}
