"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createCustomerSpendAlert,
  createMetronomeEmbeddableLink,
  fetchCurrentSpendDraftInvoice,
  fetchCustomerSpendAlerts,
  fetchMetronomeCustomerBalance,
  fetchMetronomeCustomers,
  fetchMetronomeInvoiceBreakdown,
} from "@/actions/metronome";

// Types based on the backend API
interface MetronomeConfig {
  api_key: string;
  customer_id: string;
  chart_type: "BarChart" | "LineChart" | "PieChart";
}

interface Balance {
  total_granted: number;
  total_used: number;
  processed_grants: Array<{
    id: string;
    type: string;
    product_name: string;
    granted: number;
    used: number;
    remaining: number;
  }>;
}

interface BreakdownData {
  items: Array<any>;
  products: Record<string, any>;
}

interface EmbeddableUrls {
  invoices: string;
  usage: string;
  credits: string;
}

interface CurrentSpend {
  total: number;
  productTotals: Record<string, number>;
}

interface Customer {
  id: string;
  name: string;
}

interface LoadingStates {
  balance: boolean;
  costs: boolean;
  usage: boolean;
  currentSpend: boolean;
  customers: boolean;
  embeddableUrls: boolean;
  alerts: boolean;
}

interface ErrorStates {
  balance: string | null;
  costs: string | null;
  usage: string | null;
  currentSpend: string | null;
  customers: string | null;
  embeddableUrls: string | null;
  alerts: string | null;
}

interface MetronomeContextType {
  // Config and state
  config: MetronomeConfig;
  balance: Balance | null;
  currentSpend: CurrentSpend | null;
  embeddableUrls: EmbeddableUrls;
  usage: BreakdownData;
  costs: BreakdownData;
  customers: Customer[];
  loading: LoadingStates;
  errors: ErrorStates;

  // Actions
  setConfig: (config: MetronomeConfig) => void;
  getDashboard: (
    type: "invoices" | "usage" | "credits",
    theme?: string,
  ) => Promise<void>;
  fetchBalance: () => Promise<void>;
  fetchCosts: (windowSize?: "HOUR" | "DAY") => Promise<BreakdownData>;
  fetchUsage: (windowSize?: "HOUR" | "DAY") => Promise<BreakdownData>;
  fetchAlerts: () => Promise<any>;
  createAlert: (threshold: number) => Promise<boolean>;
  fetchCurrentSpend: () => Promise<void>;
  fetchCustomers: (apiKey?: string) => Promise<void>;
  reset: () => void;
  loadAllData: () => Promise<void>;
}

const initialLoadingStates: LoadingStates = {
  balance: false,
  costs: false,
  usage: false,
  currentSpend: false,
  customers: false,
  embeddableUrls: false,
  alerts: false,
};

const initialErrorStates: ErrorStates = {
  balance: null,
  costs: null,
  usage: null,
  currentSpend: null,
  customers: null,
  embeddableUrls: null,
  alerts: null,
};

const defaultContext: MetronomeContextType = {
  config: { api_key: "", customer_id: "", chart_type: "BarChart" },
  balance: null,
  currentSpend: null,
  embeddableUrls: { invoices: "", usage: "", credits: "" },
  usage: { items: [], products: {} },
  costs: { items: [], products: {} },
  customers: [],
  loading: initialLoadingStates,
  errors: initialErrorStates,
  setConfig: () => {},
  getDashboard: async () => {},
  fetchBalance: async () => {},
  fetchCosts: async () => ({ items: [], products: {} }),
  fetchUsage: async () => ({ items: [], products: {} }),
  fetchAlerts: async () => null,
  createAlert: async () => false,
  fetchCurrentSpend: async () => {},
  fetchCustomers: async () => {},
  reset: () => {},
  loadAllData: async () => {},
};

const MetronomeContext = createContext<MetronomeContextType>(defaultContext);

export const MetronomeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State
  const [config, setConfigState] = useState<MetronomeConfig>(
    defaultContext.config,
  );
  const [balance, setBalance] = useState<Balance | null>(null);
  const [embeddableUrls, setEmbeddableUrls] = useState<EmbeddableUrls>(
    defaultContext.embeddableUrls,
  );
  const [usage, setUsage] = useState<BreakdownData>(defaultContext.usage);
  const [costs, setCosts] = useState<BreakdownData>(defaultContext.costs);
  const [currentSpend, setCurrentSpend] = useState<CurrentSpend | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<LoadingStates>(initialLoadingStates);
  const [errors, setErrors] = useState<ErrorStates>(initialErrorStates);

  // Helper function to update loading state
  const setLoadingState = useCallback(
    (key: keyof LoadingStates, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Helper function to update error state
  const setErrorState = useCallback(
    (key: keyof ErrorStates, value: string | null) => {
      setErrors((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Reset all data
  const reset = useCallback(() => {
    setBalance(null);
    setEmbeddableUrls({ invoices: "", usage: "", credits: "" });
    setUsage({ items: [], products: {} });
    setCosts({ items: [], products: {} });
    setCurrentSpend(null);
    setCustomers([]);
    setErrors(initialErrorStates);
  }, []);

  // Set configuration and reset data
  const setConfig = useCallback(
    (newConfig: MetronomeConfig) => {
      setConfigState(newConfig);
      reset();
    },
    [reset],
  );

  // Fetch customers
  const fetchCustomers = useCallback(
    async (apiKey?: string) => {
      setLoadingState("customers", true);
      setErrorState("customers", null);

      try {
        const response = await fetchMetronomeCustomers(
          apiKey || config.api_key,
        );

        if (response.status === "success") {
          setCustomers(response.result || []);
        } else {
          throw new Error(response.message || "Failed to fetch customers");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorState("customers", message);
        console.error("Error fetching customers:", error);
      } finally {
        setLoadingState("customers", false);
      }
    },
    [config.api_key, setLoadingState, setErrorState],
  );

  // Get dashboard embeddable URL
  const getDashboard = useCallback(
    async (type: "invoices" | "usage", theme?: string) => {
      setLoadingState("embeddableUrls", true);
      setErrorState("embeddableUrls", null);

      try {
        const response = await createMetronomeEmbeddableLink(
          config.api_key,
          config.customer_id,
          type,
          theme,
        );

        if (response.status === "success") {
          setEmbeddableUrls((prev) => ({
            ...prev,
            [type]: response.result,
          }));
        } else {
          throw new Error(
            response.message || `Failed to get ${type} dashboard`,
          );
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorState("embeddableUrls", message);
        console.error(`Error getting ${type} dashboard:`, error);
      } finally {
        setLoadingState("embeddableUrls", false);
      }
    },
    [config.api_key, config.customer_id, setLoadingState, setErrorState],
  );

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    setLoadingState("balance", true);
    setErrorState("balance", null);

    try {
      const response = await fetchMetronomeCustomerBalance(
        config.api_key,
        config.customer_id,
      );

      if (response.status === "success") {
        setBalance(response.result);
      } else {
        throw new Error(response.message || "Failed to fetch balance");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorState("balance", message);
      console.error("Error fetching balance:", error);
    } finally {
      setLoadingState("balance", false);
    }
  }, [config.api_key, config.customer_id, setLoadingState, setErrorState]);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    setLoadingState("alerts", true);
    setErrorState("alerts", null);

    try {
      const response = await fetchCustomerSpendAlerts(
        config.api_key,
        config.customer_id,
      );
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorState("alerts", message);
      console.error("Error fetching alerts:", error);
      return null;
    } finally {
      setLoadingState("alerts", false);
    }
  }, [config.api_key, config.customer_id, setLoadingState, setErrorState]);

  // Create alert
  const createAlert = useCallback(
    async (threshold: number): Promise<boolean> => {
      setLoadingState("alerts", true);
      setErrorState("alerts", null);

      try {
        const response = await createCustomerSpendAlert(
          config.api_key,
          config.customer_id,
          threshold,
        );
        return response === true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorState("alerts", message);
        console.error("Error creating alert:", error);
        return false;
      } finally {
        setLoadingState("alerts", false);
      }
    },
    [config.api_key, config.customer_id, setLoadingState, setErrorState],
  );

  // Fetch costs
  const fetchCosts = useCallback(
    async (windowSize: "HOUR" | "DAY" = "DAY"): Promise<BreakdownData> => {
      setLoadingState("costs", true);
      setErrorState("costs", null);

      try {
        const response = await fetchMetronomeInvoiceBreakdown(
          config.api_key,
          config.customer_id,
          windowSize,
        );

        if (response.status === "success") {
          setCosts(response.result.costs);
          setUsage(response.result.usage); // Set usage data as well since it comes together
          return response.result.costs;
        } else {
          throw new Error(response.message || "Failed to fetch costs");
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorState("costs", message);
        console.error("Error fetching costs:", error);
        const fallback = { items: [], products: {} };
        setCosts(fallback);
        return fallback;
      } finally {
        setLoadingState("costs", false);
      }
    },
    [config.api_key, config.customer_id, setLoadingState, setErrorState],
  );

  // Fetch usage (wrapper around fetchCosts since they come together)
  const fetchUsage = useCallback(
    async (windowSize: "HOUR" | "DAY" = "DAY"): Promise<BreakdownData> => {
      await fetchCosts(windowSize); // This will set both costs and usage
      return usage;
    },
    [fetchCosts, usage],
  );

  // Fetch current spend
  const fetchCurrentSpend = useCallback(async () => {
    setLoadingState("currentSpend", true);
    setErrorState("currentSpend", null);

    try {
      const response = await fetchCurrentSpendDraftInvoice(
        config.api_key,
        config.customer_id,
      );

      if (response.status === "success") {
        setCurrentSpend(response.result);
      } else {
        throw new Error(response.message || "Failed to fetch current spend");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorState("currentSpend", message);
      console.error("Error fetching current spend:", error);
      setCurrentSpend(null);
    } finally {
      setLoadingState("currentSpend", false);
    }
  }, [config.api_key, config.customer_id, setLoadingState, setErrorState]);

  // Load all data at once
  const loadAllData = useCallback(async () => {
    if (!config.api_key || !config.customer_id) {
      console.warn("Cannot load data: missing API key or customer ID");
      return;
    }

    await Promise.allSettled([
      fetchBalance(),
      fetchCosts(),
      fetchCurrentSpend(),
    ]);
  }, [
    config.api_key,
    config.customer_id,
    fetchBalance,
    fetchCosts,
    fetchCurrentSpend,
  ]);

  // Auto-load data when config changes (if both api_key and customer_id are present)
  useEffect(() => {
    if (config.api_key && config.customer_id) {
      loadAllData();
    }
  }, [config.api_key, config.customer_id, loadAllData]);

  const contextValue: MetronomeContextType = {
    config,
    balance,
    currentSpend,
    embeddableUrls,
    usage,
    costs,
    customers,
    loading,
    errors,
    setConfig,
    getDashboard,
    fetchBalance,
    fetchCosts,
    fetchUsage,
    fetchAlerts,
    createAlert,
    fetchCurrentSpend,
    fetchCustomers,
    reset,
    loadAllData,
  };

  return (
    <MetronomeContext.Provider value={contextValue}>
      {children}
    </MetronomeContext.Provider>
  );
};

// Custom hook to access the context
export const useMetronome = () => {
  const context = useContext(MetronomeContext);
  if (!context) {
    throw new Error("useMetronome must be used within a MetronomeProvider");
  }
  return context;
};

// Utility hook for checking if data is ready
export const useMetronomeReady = () => {
  const { config, loading } = useMetronome();

  const isConfigured = Boolean(config.api_key && config.customer_id);
  const isLoading = Object.values(loading).some(Boolean);
  const isReady = isConfigured && !isLoading;

  return { isConfigured, isLoading, isReady };
};

// Utility function to format usage data for charts (moved the commented function)
export const formatUsageForChart = (
  usage: any[],
): { data: any[]; groupValues: string[] } => {
  if (!usage || usage.length === 0) {
    return { data: [], groupValues: [] };
  }

  // Get unique group values
  const groupValues = usage.reduce((acc: string[], item: any) => {
    if (item.group_value && !acc.includes(item.group_value)) {
      acc.push(item.group_value);
    }
    return acc;
  }, []);

  // Get unique timestamps
  const timestamps = usage.reduce((acc: string[], item: any) => {
    if (item.starting_on && !acc.includes(item.starting_on)) {
      acc.push(item.starting_on);
    }
    return acc;
  }, []);

  // Build chart data
  const data = timestamps.map((timestamp: string) => {
    const values: Record<string, any> = {};

    groupValues.forEach((groupValue: string) => {
      const matchingItem = usage.find(
        (item: any) =>
          item.starting_on === timestamp && item.group_value === groupValue,
      );
      values[groupValue] = matchingItem?.value || 0;
    });

    return {
      starting_on: timestamp,
      ...values,
    };
  });

  return { data, groupValues };
};
