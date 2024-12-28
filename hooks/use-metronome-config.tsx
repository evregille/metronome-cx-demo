"use client";

import React, { createContext, useContext, useState } from "react";
import {
  createCustomerSpendAlert,
  createMetronomeEmbeddableLink,
  fetchCurrentSpendDraftInvoice,
  fetchCustomerSpendAlerts,
  fetchMetronomeCustomerBalance,
  fetchMetronomeCustomers,
  fetchMetronomeInvoiceBreakdown,
} from "@/actions/metronome";

interface MetronomeConfig {
  api_key: string;
  customer_id: string;
  chart_type: string;
}

interface Balance {
  total_granted: number | undefined;
  total_used: number | undefined;
}

interface Costs {
  items: Array<any>;
  products: any;
}
interface Usage {
  items: Array<any>;
  products: any;
}
interface Customers {
  id: string;
  name: string;
}

interface MetronomeContextType {
  metronome_config: MetronomeConfig;
  balance: Balance;
  current_spend: number | undefined;
  embeddable_url: any;
  usage: Usage;
  costs: Costs;
  customers: Array<Customers>;
  setMetronome: (d: MetronomeConfig) => void;
  getDashboard: (type: string, theme: string | undefined) => Promise<void>;
  fetchBalance: () => Promise<void>;
  fetchCosts: () => Promise<Costs>;
  fetchAlerts: () => Promise<any>;
  createAlert: (threshold: number) => Promise<any>;
  fetchCurrentSpend: () => Promise<void>;
  fetchCustomers: (api_key: string | undefined) => Promise<void>;
}

// 1. Create the context with a default value
const MetronomeContext = createContext<MetronomeContextType>({
  metronome_config: { api_key: "", customer_id: "", chart_type: "BarChart" },
  balance: { total_used: undefined, total_granted: undefined },
  current_spend: undefined,
  embeddable_url: { invoices: "", usage: "", credits: "" },
  usage: { items: [], products: [] },
  costs: { items: [], products: [] },
  customers: [],
  setMetronome: () => {},
  getDashboard: async (type, theme) => {},
  fetchBalance: async () => {},
  fetchCosts: async () => {
    return { items: [], products: [] };
  },
  fetchAlerts: async () => {
    return {};
  },
  createAlert: async (threshold) => {
    return {};
  },
  fetchCurrentSpend: async () => {},
  fetchCustomers: async () => {},
});

// 2. Create the provider component
export const MetronomeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metronome_config, setMetronomeConfig] = useState<MetronomeConfig>({
    api_key: "",
    customer_id: "",
    chart_type: "BarChart",
  });
  const [balance, setBalance] = useState<Balance>({
    total_used: undefined,
    total_granted: undefined,
  });
  const [embeddable_url, setEmbedableUrl] = useState<any>({
    invoices: "",
    usage: "",
    credits: "",
  });
  const [usage, setUsage] = useState<Usage>({ items: [], products: [] });
  const [costs, setCosts] = useState<Costs>({ items: [], products: [] });
  const [current_spend, setCurrentSpend] = useState<number | undefined>(
    undefined,
  );
  const [customers, setCustomers] = useState<Array<Customers>>([]);

  const setMetronome = async (value: MetronomeConfig) => {
    setMetronomeConfig(value);
    resetMetronomeData();
    // await loadMetronomeData();
  };

  const resetMetronomeData = () => {
    setEmbedableUrl({ invoices: "", usage: "", credits: "" });
    setBalance({ total_used: undefined, total_granted: undefined });
    setUsage({ items: [], products: [] });
    setCosts({ items: [], products: [] });
    setCurrentSpend(undefined);
  };

  const loadMetronomeData = async () => {
    await fetchBalance();
    await getDashboard("invoices", "light");
    await fetchCosts();
    await fetchCurrentSpend();
  };

  const fetchCustomers = async (api_key: string | undefined) => {
    try {
      const response = await fetchMetronomeCustomers(
        api_key ? api_key : metronome_config.api_key,
      );
      if (response && response.customers) {
        setCustomers(response.customers);
      }
    } catch (e) {
      console.log("exception", e);
    }
  };

  const getDashboard = async (
    type: "invoices" | "usage" | "credits",
    resolvedTheme: string | undefined,
  ): Promise<void> => {
    try {
      const response = await createMetronomeEmbeddableLink(
        metronome_config.api_key,
        metronome_config.customer_id,
        type,
        resolvedTheme,
      );
      console.log(metronome_config, response);
      if (response.status === "success" && response.result)
        setEmbedableUrl({
          ...embeddable_url,
          invoices: response.result,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBalance = async (): Promise<void> => {
    try {
      const response = await fetchMetronomeCustomerBalance(
        metronome_config.api_key,
        metronome_config.customer_id,
      );
      if (response && response.status === "success" && response.result)
        setBalance({
          total_granted: response.result.total_granted,
          total_used: response.result.total_used,
        });
    } catch (error) {
      // return { total_granted: undefined, total_used: undefined } ;
    }
  };

  const fetchAlerts = async (): Promise<any> => {
    try {
      return await fetchCustomerSpendAlerts(
        metronome_config.api_key,
        metronome_config.customer_id,
      );
    } catch (error) {
      return;
    }
  };

  const createAlert = async (threshold: number): Promise<any> => {
    try {
      return await createCustomerSpendAlert(
        metronome_config.api_key,
        metronome_config.customer_id,
        threshold,
      );
    } catch (error) {
      return;
    }
  };

  const fetchCosts = async (): Promise<Costs> => {
    try {
      const response = await fetchMetronomeInvoiceBreakdown(
        metronome_config.api_key,
        metronome_config.customer_id,
        "DAY",
      );
      if (response && response.status === "success" && response.result) {
        setCosts(response.result.costs);
        setUsage(response.result.usage);
        return response.result.costs;
      } else return { items: [], products: [] };
    } catch (error) {
      return { items: [], products: [] };
    }
  };

  const fetchCurrentSpend = async (): Promise<void> => {
    try {
      const spend = await fetchCurrentSpendDraftInvoice(
        metronome_config.api_key,
        metronome_config.customer_id,
      );
      if (spend && spend.total) setCurrentSpend(spend.total);
      else setCurrentSpend(undefined);
    } catch (error) {
      setCurrentSpend(undefined);
      return;
    }
  };

  return (
    <MetronomeContext.Provider
      value={{
        balance,
        embeddable_url,
        current_spend,
        usage,
        metronome_config,
        costs,
        customers,
        setMetronome,
        getDashboard,
        fetchBalance,
        fetchCosts,
        createAlert,
        fetchAlerts,
        fetchCurrentSpend,
        fetchCustomers,
      }}
    >
      {children}
    </MetronomeContext.Provider>
  );
};

// 3. Create a custom hook to access the context
export const useMetronome = () => {
  return useContext(MetronomeContext);
};

// const formatUsageGrouped = (usage: any): any => {
//   const group_values =  usage.reduce((acc: Array<string>, item: any) => { // unique values
//     if (!acc.includes(item.group_value)) acc.push(item.group_value);
//     return acc;
//   }, []);

//   const timestamps = usage.reduce((acc: Array<string>, item: any) => { // unique timestamps
//     if (!acc.includes(item.starting_on)) acc.push(item.starting_on);
//     return acc;
//   }, []);

//   const data = timestamps.map( (t:string) => {
//     let values = {};
//     group_values.forEach((v:string) => {
//       values[v] = usage.filter((el: any) => el.starting_on === t && el.group_value === v)[0]?.value
//     })
//     return {
//       starting_on: t,
//       ...values,
//     }
//   })
//   return {data, group_values};
// }
