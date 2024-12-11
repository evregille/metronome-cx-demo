import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AutoTopup() {
    const [ isAutoRechargeOn ,  setIsAutoRechargeOn ] = useState(false)

    const handleToggle = function(){
        setIsAutoRechargeOn(!isAutoRechargeOn);
    }

    return (
        <div className={"relative flex flex-col overflow-hidden rounded-3xl border shadow-sm"}>
            <div className="min-h-[100%] items-start space-y-4 bg-muted/50 p-6">
                <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Configure Auto Recharge
                </p>

                <div className="flex flex-row">
                    <div className="flex items-end">
                        <div className="flex text-left text-3xl font-semibold leading-6">
                            <Switch 
                                checked={isAutoRechargeOn} 
                                onCheckedChange={handleToggle} 
                            />
                           <Label className="align-middle indent-1.5" htmlFor="name">
                                Turn {isAutoRechargeOn === true ? 'OFF' : 'ON'} Auto-Recharge
                            </Label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex items-end">
                        <div className="flex text-left text-3xl font-semibold leading-6">
                            { isAutoRechargeOn && 
                                <Label className="text-justify" htmlFor="name">
                                    Gnomes AI will ensure that your balance is always above $25 and will bring your balance up to $250.
                                </Label>
                            }
                        </div>
              
                    </div>
                </div>
            </div>
        </div>
    )
}