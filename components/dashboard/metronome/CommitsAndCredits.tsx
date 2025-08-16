"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { useMetronome } from "@/hooks/use-metronome-config";

export function CommitsAndCredits() {
  const { config, embeddableUrls, getDashboard } = useMetronome();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    (async () => {
      console.log("commits_and_credits component - Theme changed to:", resolvedTheme);
      await getDashboard("commits_and_credits", resolvedTheme);
    })();
  }, [config, resolvedTheme, getDashboard]);

  console.log("commits_and_credits component - Current theme:", resolvedTheme);
  console.log("commits_and_credits component - Embeddable URL:", embeddableUrls.commits_and_credits);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border shadow-sm">
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Commits and Credits
        </p>
        {embeddableUrls.commits_and_credits && embeddableUrls.commits_and_credits.length > 0 && (
          <iframe
            id="commits_and_credits"
            title={"Metronome Commits and Credits"}
            src={embeddableUrls.commits_and_credits}
            width={"100%"}
            height={"500px"}
          />
        )}
      </div>
    </div>
  );
}
