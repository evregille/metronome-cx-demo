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
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          {/* Budget Input Row */}
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap" htmlFor="value">
              Budget ($)
            </Label>
            <div className="flex-1">
              <div className="relative">
                <Input
                  id="value"
                  className="w-full pl-8"
                  size={32}
                  value={value}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Workspace Selection Row */}
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap" htmlFor="workspace">
              Apply budget to
            </Label>
            <div className="flex-1">
              <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workspaces</SelectItem>
                  <SelectItem value="workspace1">Workspace 1</SelectItem>
                  <SelectItem value="workspace2">Workspace 2</SelectItem>
                  <SelectItem value="workspace3">Workspace 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            className="w-[150px]"
          >
            Create Budget
          </Button>
        </div>
      </form>
    </div>
  );
}
