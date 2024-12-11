import { useMetronome } from "@/hooks/use-metronome-config";
import { useEffect, } from "react";

export function CurrentInvoiceTotal() {
    const { current_spend , fetchCurrentSpend } = useMetronome();
    
    useEffect(() => {
        (async () => {
               await fetchCurrentSpend();
        })()
    },[])

    return (
        <div className={"relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"}>
            <div className="min-h-[100%] items-start space-y-4 bg-muted/50 p-6">
                <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Total Usage Costs
                </p>
         
                <div className="w-full text-3xl font-semibold leading-6">
                    $ { current_spend === undefined ? 'N/A' : (current_spend / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
            </div>
        </div>
    )
}