"use client";

import { useState, } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MetronomeAlertForm() {
  const [value, setValue] = useState(100);

  const onSubmit = function(e){
    e.preventDefault()
  }

  const handleInputChange = function (e: any) {
    setValue(e.target.value)
  }

  return (
    <div className={"grid gap-6"}>
      
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Label className="" htmlFor="name">
              Spend Threshold Notification ($)
            </Label>
            <Input
              id="value"
              className="flex-8"
              size={32}
              value={value}
              onChange={handleInputChange}
            />
            
          <Button
            type="submit"
            variant={true ? "default" : "disable"}
            disabled={false}
            className="w-[100px] shrink-0 px-3 sm:w-[150px]"
          >Create Notification 
          </Button>
        </div>
        </div>
    </form>
  </div>
  );
}