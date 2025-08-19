"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MetronomeAlertForm() {
  const [value, setValue] = useState(100);
  const [selectedWorkspace, setSelectedWorkspace] = useState("all");

  const onSubmit = function (e) {
    e.preventDefault();
  };

  const handleInputChange = function (e: any) {
    setValue(e.target.value);
  };

  const handleWorkspaceChange = function (workspace: string) {
    setSelectedWorkspace(workspace);
  };

  return (
    <div className={"grid gap-6"}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Label className="" htmlFor="name">
              Spend Threshold Notification ($)
            </Label>
            
            {/* Amount and Workspace in same row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="value"
                  className="w-full"
                  size={32}
                  value={value}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="flex-1">
                <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="workspace1">Project 1</SelectItem>
                    <SelectItem value="workspace2">Project 2</SelectItem>
                    <SelectItem value="workspace3">Project 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              variant={true ? "default" : "disable"}
              disabled={false}
              className="w-[100px] shrink-0 px-3 sm:w-[150px]"
            >
              Create Notification
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
