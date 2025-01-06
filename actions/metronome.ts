"use server";

import Metronome from "@metronome/sdk";

const CUSTOM_SPEND_THRESHOLD_ALERT_NAME = "CUSTOM_SPEND_THRESHOLD_ALERT";
const DARK_DEFAULT = {
  Gray_dark: "#fb00f5",
  Gray_medium: "#b050e8",
  Gray_light: "#fb00f5",
  Gray_extralight: "#fb00f5",
  // White: "#000000",
  Primary_medium: "#ffffff",
  Primary_light: "#fb00f5",
  Primary_green: "#8459ca",
  Primary_red: "#4baaf2",
};

export async function createMetronomeEmbeddableLink(
  api_key: string,
  customer_id: string,
  type: "invoices" | "usage" | "credits",
  resolvedTheme: string | undefined,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({
      bearerToken: api_key,
    });
    let color_overrides: Array<any> = [];
    if (resolvedTheme === "dark") {
      color_overrides = Object.entries(DARK_DEFAULT).map((el: Array<any>) => {
        return { name: el[0], value: el[1] };
      });
    }
    const response = await client.dashboards.getEmbeddableURL({
      customer_id,
      dashboard: type,
      color_overrides,
    });
    return { status: "success", result: response.data.url };
  } catch (error) {
    return { status: "error" };
  }
}

export async function fetchMetronomeCustomerBalance(
  api_key: string,
  customer_id: string,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({
      bearerToken: api_key,
    });

    const response = await client.contracts.listBalances({
      customer_id,
      covering_date: new Date().toISOString(),
      include_archived: false,
      include_contract_balances: true,
      include_ledgers: true,
    });

    let total_granted: number = 0,
      total_used: number = 0;
    let processed_grants: Array<any> = [];
    
    response.data.forEach((grant) => {
      console.log('grants', grant.access_schedule)
      // Calculate total granted for this item
      const granted =
        grant["access_schedule"] && grant["access_schedule"]["schedule_items"]
          ? grant["access_schedule"]["schedule_items"].reduce(
              (accumulator, current) => accumulator + current["amount"],
              0,
            )
          : 0;
      
      // Calculate total used for this item
      const used = grant["ledger"]
        ? grant["ledger"].reduce(
            (accumulator, current) =>
              current["amount"] < 0 ? accumulator - current["amount"] : 0,
            0,
          )
        : 0;

      total_granted += granted;
      total_used += used;

      processed_grants.push({
        id: grant["id"],
        type: grant["type"],
        product_name: grant["product"]["name"],
        granted: granted,
        used: used,
        remaining: granted - used,
      });
    });
    return {
      status: "success",
      result: { total_granted, total_used, processed_grants },
    };
  } catch (error) {
    return { status: "error" };
  }
}

export async function fetchMetronomeInvoiceBreakdown(
  api_key: string,
  customer_id: string,
  window_size: "HOUR" | "DAY" | undefined,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({
      bearerToken: api_key,
    });
    const { start, end } = interval(30);
    let response = await client.customers.invoices.listBreakdowns(customer_id, {
      window_size,
      starting_on: new Date(start).toISOString(),
      ending_before: new Date(end).toISOString(),
    });
    let data = response.data,
      is_next_page = true;
    while (is_next_page === true) {
      if (response.next_page) {
        response = await client.customers.invoices.listBreakdowns(customer_id, {
          window_size,
          starting_on: new Date(start).toISOString(),
          ending_before: new Date(end).toISOString(),
          next_page: response.next_page,
        });
        data = [...data, ...response.data];
      } else is_next_page = false;
    }
    return {
      status: "success",
      result: {
        costs: retrieveCost(data),
        usage: retrieveUsage(data),
      },
    };
  } catch (error) {
    return { status: "error" };
  }
}

export async function fetchCustomerSpendAlerts(
  api_key: string,
  customer_id: string,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({ bearerToken: api_key });
    // retrieve all alerts for customer
    const response = await client.customers.alerts.list({ customer_id });
    // filter spend alert with name
    return response.data.filter(
      (a) =>
        a.alert.type === "spend_threshold_reached" &&
        a.alert.name === CUSTOM_SPEND_THRESHOLD_ALERT_NAME,
    );
  } catch (error) {
    return { status: "error" };
  }
}

export async function createCustomerSpendAlert(
  api_key: string,
  customer_id: string,
  threshold: number,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({ bearerToken: api_key });
    const response = await client.alerts.create({
      customer_id: customer_id,
      alert_type: "spend_threshold_reached",
      name: CUSTOM_SPEND_THRESHOLD_ALERT_NAME,
      evaluate_on_create: true,
      threshold: threshold,
    });
    return true;
  } catch (error) {
    console.log(error);
    return { status: "error" };
  }
}

export async function fetchCurrentSpendDraftInvoice(
  api_key: string,
  customer_id: string,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({ bearerToken: api_key });
    const invoices = await client.customers.invoices.list(customer_id, {
      status: "DRAFT",
    });
    let total = 0;
    if (invoices && invoices.data) {
      total = invoices.data.reduce(
        (accumulator, current) => accumulator + current["total"],
        0,
      );
    }
    return { status: "ok", total };
  } catch (error) {
    return { status: "error" };
  }
}

export async function fetchMetronomeCustomers(api_key: string) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  try {
    const client = new Metronome({ bearerToken: api_key });
    let response = await client.customers.list();
    let data = response.data,
      is_next_page = true;
    while (is_next_page === true) {
      if (response.next_page) {
        response = await client.customers.list({
          next_page: response.next_page,
        });
        data = [...data, ...response.data];
      } else is_next_page = false;
    }
    return { status: "success", customers: data };
  } catch (error) {
    return { status: "error" };
  }
}

export async function createCommit(
  api_key: string,
  customer_id: string,
  amount: number,
) {
  if (api_key === "") api_key = process.env["METRONOME_API_TOKEN"] || "";
  if (customer_id === "")
    customer_id = process.env["METRONOME_CUSTOMER_ID"] || "";

  try {
    const client = new Metronome({ bearerToken: api_key });
    // const response = await client.customers.commits.create({
    //   customer_id,
    //   name: "PREPAID TOP-UP",
    //   type: 'PREPAID',
    //   priority: 10,
    //  })
  } catch (e) {}
}

const interval = (days: number): any => {
  const now = new Date();
  const now_utc_midnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const previous = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const previous_utc_midnight = Date.UTC(
    previous.getUTCFullYear(),
    previous.getUTCMonth(),
    previous.getUTCDate(),
  );
  return { start: previous_utc_midnight, end: now_utc_midnight };
};

const retrieveCost = (breakdowns: Array<any>): any => {
  let products: any = {},
    items: Array<any> = [];
  breakdowns.forEach((breakdown) => {
    //for each breakdown (hour or day)
    if (breakdown.line_items) {
      let dimensions = {},
        product_names = {};
      breakdown.line_items.forEach((line) => {
        // for each line item part of the breakdown
        if (line.total >= 0) {
          // ignore credits in the costs view
          if (!products[line.name]) products[line.name] = {}; // add product name
          product_names[line.name] = product_names[line.name]
            ? product_names[line.name] + line.total / 100
            : line.total / 100;
          if (
            line.pricing_group_values &&
            Object.keys(line.pricing_group_values).length > 0
          ) {
            Object.keys(line.pricing_group_values).forEach((el) => {
              if (line.pricing_group_values && line.pricing_group_values[el]) {
                dimensions[line.pricing_group_values[el]] = dimensions[
                  line.pricing_group_values[el]
                ]
                  ? dimensions[line.pricing_group_values[el]] + line.total / 100
                  : line.total / 100;
                if (products[line.name][el]) {
                  if (
                    products[line.name][el].findIndex(
                      (v: string) => v === line.pricing_group_values[el],
                    ) === -1
                  )
                    products[line.name][el].push(line.pricing_group_values[el]);
                } else
                  products[line.name][el] = [line.pricing_group_values[el]];
              }
            });
          }
          if (
            line.presentation_group_values &&
            Object.keys(line.presentation_group_values).length > 0
          ) {
            Object.keys(line.presentation_group_values).forEach((el) => {
              if (
                line.presentation_group_values &&
                line.presentation_group_values[el]
              ) {
                dimensions[line.presentation_group_values[el]] = dimensions[
                  line.presentation_group_values[el]
                ]
                  ? dimensions[line.presentation_group_values[el]] + line.total
                  : line.total;
                if (products[line.name][el]) {
                  if (
                    products[line.name][el].findIndex(
                      (v: string) => v === line.presentation_group_values[el],
                    ) === -1
                  )
                    products[line.name][el].push(
                      line.presentation_group_values[el],
                    );
                } else
                  products[line.name][el] = [
                    line.presentation_group_values[el],
                  ];
              }
            });
          }
        }
      });
      items.push({
        total: breakdown.total / 100,
        ...dimensions,
        ...product_names,
        starting_on: breakdown.breakdown_start_timestamp,
        type: breakdown.type,
      });
    }
  });
  return { products, items };
};

const retrieveUsage = (breakdowns: Array<any>): any => {
  let products: any = {},
    items: Array<any> = [];
  breakdowns.forEach((breakdown) => {
    //for each breakdown (hour or day)
    if (breakdown.line_items) {
      let dimensions = {},
        product_names = {};
      breakdown.line_items.forEach((line) => {
        // for each line item part of the breakdown
        if (line.total >= 0) {
          // ignore credits in the costs view
          if (!products[line.name]) products[line.name] = {}; // add product name
          product_names[line.name] = product_names[line.name]
            ? product_names[line.name] + line.quantity
            : line.quantity;
          if (
            line.pricing_group_values &&
            Object.keys(line.pricing_group_values).length > 0
          ) {
            Object.keys(line.pricing_group_values).forEach((el) => {
              if (line.pricing_group_values && line.pricing_group_values[el]) {
                dimensions[line.pricing_group_values[el]] = dimensions[
                  line.pricing_group_values[el]
                ]
                  ? dimensions[line.pricing_group_values[el]] + line.quantity
                  : line.quantity;
                if (products[line.name][el]) {
                  if (
                    products[line.name][el].findIndex(
                      (v: string) => v === line.pricing_group_values[el],
                    ) === -1
                  )
                    products[line.name][el].push(line.pricing_group_values[el]);
                } else
                  products[line.name][el] = [line.pricing_group_values[el]];
              }
            });
          }
          if (
            line.presentation_group_values &&
            Object.keys(line.presentation_group_values).length > 0
          ) {
            Object.keys(line.presentation_group_values).forEach((el) => {
              if (
                line.presentation_group_values &&
                line.presentation_group_values[el]
              ) {
                dimensions[line.presentation_group_values[el]] = dimensions[
                  line.presentation_group_values[el]
                ]
                  ? dimensions[line.presentation_group_values[el]] +
                    line.quantity
                  : line.quantity;
                if (products[line.name][el]) {
                  if (
                    products[line.name][el].findIndex(
                      (v: string) => v === line.presentation_group_values[el],
                    ) === -1
                  )
                    products[line.name][el].push(
                      line.presentation_group_values[el],
                    );
                } else
                  products[line.name][el] = [
                    line.presentation_group_values[el],
                  ];
              }
            });
          }
        }
      });
      items.push({
        ...dimensions,
        ...product_names,
        starting_on: breakdown.breakdown_start_timestamp,
        type: breakdown.type,
      });
    }
  });
  return { items, products };
};
