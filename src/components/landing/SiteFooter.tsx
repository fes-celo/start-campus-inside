import { DataCloudAwardsLogo, StartCampusLogo } from "./Logos";

export function SiteFooter() {
  return (
    <footer className="pb-12 pt-4 text-center">
      <div className="flex flex-wrap items-center justify-center gap-10">
        <StartCampusLogo />
        <DataCloudAwardsLogo />
      </div>
      <p className="mt-8 text-xs text-foreground/60">
        © 2026 Start Campus. All rights reserved.
      </p>
    </footer>
  );
}