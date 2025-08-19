"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { useMetronome } from "@/hooks/use-metronome-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface WebServiceTier {
  name: string;
  value: string;
  description: string;
  cpu: string;
  memory: string;
}

const WEB_SERVICE_TIERS: WebServiceTier[] = [
  {
    name: "Starter",
    value: "Starter",
    description: "Basic web service for small applications",
    cpu: "0.1",
    memory: "1gb"
  },
  {
    name: "Standard",
    value: "Standard", 
    description: "Standard web service for medium applications",
    cpu: "0.3",
    memory: "4gb"
  },
  {
    name: "Pro",
    value: "Pro",
    description: "Professional web service for production applications",
    cpu: "0.5",
    memory: "8gb"
  },
  {
    name: "Pro Max",
    value: "Pro Max",
    description: "High-performance web service for large applications",
    cpu: "1.0",
    memory: "16gb"
  },
  {
    name: "Pro Ultra",
    value: "Pro Ultra",
    description: "Ultra-high performance for enterprise applications",
    cpu: "2.0",
    memory: "32gb"
  }
];

interface PredictedCost {
  total: number;
  lineItems: Array<{
    name: string;
    total: number;
  }>;
}

export function WebServicePrediction() {
  const { config, predictCost } = useMetronome();
  const { resolvedTheme } = useTheme();
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [predictedCost, setPredictedCost] = useState<PredictedCost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return (amount / 100)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getSecondsUntilEndOfMonth = (): number => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return Math.floor((endOfMonth.getTime() - now.getTime()) / 1000);
  };

  const handlePredictCost = async () => {
    
    if (!selectedTier) {
      setError("Please select a service tier");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedTierData = WEB_SERVICE_TIERS.find(tier => tier.value === selectedTier);
      if (!selectedTierData) {
        throw new Error("Invalid service tier selected");
      }

      const secondsUntilEndOfMonth = getSecondsUntilEndOfMonth();
      const now = new Date().toISOString();

      const events = [
        {
          event_type: "instance_heartbeat",
          timestamp: now,
          properties: {
            count_seconds: secondsUntilEndOfMonth,
            cpu: selectedTierData.cpu,
            instance_type: selectedTier,
            memory: selectedTierData.memory,
            type: "Web Services",
            workspace: "EMPTY"
          }
        }
      ];

      const result = await predictCost(events);
      setPredictedCost(result);
    } catch (err) {
      console.log("Error in handlePredictCost:", err);
      setError(err instanceof Error ? err.message : "Failed to predict cost");
      setPredictedCost(null);
    } finally {
      setLoading(false);
    }
  };

  const selectedTierData = WEB_SERVICE_TIERS.find(tier => tier.value === selectedTier);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border shadow-sm">
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Service Cost Prediction
        </p>

        <div className="space-y-4">
          {/* Service Tier Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Select Web Service Tier
            </label>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service tier" />
              </SelectTrigger>
              <SelectContent>
                {WEB_SERVICE_TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tier.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {tier.cpu} CPU, {tier.memory} RAM
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Tier Details */}
          {selectedTierData && (
            <Card className="bg-background/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{selectedTierData.name}</CardTitle>
                <CardDescription>{selectedTierData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="secondary">CPU: {selectedTierData.cpu}</Badge>
                  <Badge variant="secondary">Memory: {selectedTierData.memory}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Predict Button */}
          <Button 
            onClick={handlePredictCost} 
            disabled={!selectedTier || loading}
            className="w-full"
          >
            {loading ? "Predicting..." : "Predict Cost for Rest of Month"}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Predicted Cost Display */}
          {predictedCost && (
            <Card className="bg-background/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Predicted Cost</CardTitle>
                <CardDescription>
                  Estimated cost for the rest of this calendar month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-primary">
                  ${formatCurrency(predictedCost.total)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 