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

export default function Usage() {
  const { metronome_config, usage, fetchCosts } = useMetronome();
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [groupValues, setGroupValues] = useState<Array<string>>(
    Object.keys(usage.products),
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  useEffect(() => {
    (async () => {
      const result = await fetchCosts();
      setGroupValues(Object.keys(result.products));
    })();
  }, [metronome_config, ]);

  const handleSelectProduct = (value: string) => {
    setSelectedProduct(value);
    setSelectedFilter("none");

    if (value === "all") {
      // all products so we group by product
      setGroupValues(Object.keys(usage.products));
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
      setGroupValues(usage.products[selectedProduct][value]);
    }
  };

  return (
    <>
      <DashboardHeader heading="Usage" text="Track your usage in real time" />
      <div
        className={
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"
        }
      >
        <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
          <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Track Usage in Real Time
          </p>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
              <div className="text-base text-muted-foreground">Granularity</div>
              <div className="text-base text-muted-foreground">
                Filter By Product
              </div>
              <div className="text-base text-muted-foreground">Group By</div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
              <Select value={"Day"} onValueChange={() => {}}>
                <SelectTrigger aria-label="WindowSize">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Day"}>{"Day"}</SelectItem>
                  <SelectItem value={"Hour"}>{"Hour"}</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedProduct}
                onValueChange={handleSelectProduct}
              >
                <SelectTrigger aria-label="Product">
                  <SelectValue placeholder={"All"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>{"All"}</SelectItem>
                  {usage.products &&
                    Object.keys(usage.products).length > 0 &&
                    Object.keys(usage.products).map((k: string) => {
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
                    Object.keys(usage.products[selectedProduct]).length > 0 &&
                    Object.keys(usage.products[selectedProduct]).map(
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
                  chartData={usage.items}
                  group_values={groupValues}
                />
              )}

              {metronome_config.chart_type === "BarChart" && (
                <BarChartStacked
                  chartData={usage.items}
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
