"use client"

import { DashboardHeader } from "@/components/dashboard/header";
import { Balance } from "@/components/dashboard/metronome/balance";
import { Invoices } from "@/components/dashboard/metronome/invoices";
import { AutoTopup } from "@/components/dashboard/metronome/auto-topup";
import { Topup } from "@/components/dashboard/metronome/topup";

export default function BillingPage() {
  

  return (
    <>
      <DashboardHeader
        heading="Balance"
        text="Control your balance"
      />
      <div className="grid gap-8">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
        <>
         <Balance  />
          <Topup />
          <AutoTopup />
        </>
        </div>
      </div>
     
      <div className="grid gap-8">
        <Invoices />
      </div>
    </>
  );
}
