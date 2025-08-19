"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { AutoTopup } from "@/components/dashboard/metronome/auto-topup";
import { Balance } from "@/components/dashboard/metronome/balance";
import { CommitsAndCredits } from "@/components/dashboard/metronome/CommitsAndCredits";
import { Invoices } from "@/components/dashboard/metronome/invoices";
import { Topup } from "@/components/dashboard/metronome/topup";
import { WebServicePrediction } from "@/components/dashboard/metronome/web-service-prediction";

export default function BillingPage() {
  return (
    <>
      <DashboardHeader heading="Balance" text="Control your balance" />
      <div className="grid gap-8">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <>
            <Balance />
            <Topup />
            <AutoTopup />
          </>
        </div>
      </div>

      <div className="grid gap-8">
        <CommitsAndCredits />
      </div>

      <div className="grid gap-8">
        <Invoices />
      </div>

      <div className="grid gap-8">
        <WebServicePrediction />
      </div>
    </>
  );
}
