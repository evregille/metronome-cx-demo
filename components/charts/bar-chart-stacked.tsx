"use client";

import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))","hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-6))","hsl(var(--chart-7))"]

export function BarChartStacked({chartData, group_values}) {
  let chartConfig = {};

  if(group_values && group_values.length > 0 && group_values[0] != null)
    group_values.forEach((group_value:string, i: number) => {
      chartConfig[group_value] = {
        label: group_value,
        color: COLORS[i] || COLORS[0]
      }
    });
  else chartConfig["value"] = {
    label: "total",
    color: COLORS[0],
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="starting_on"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            { Object.keys(chartConfig).map( (el: any, idx: number) => {
                return (
                  <Bar
                    key={idx}
                    dataKey={el}
                    type="natural"
                    fill={chartConfig[el].color}
                    fillOpacity={0.4}
                    stroke={chartConfig[el].color}
                    stackId="a"
                  />
                )
              })
            }
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
