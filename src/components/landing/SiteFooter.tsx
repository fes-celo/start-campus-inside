import { DataCloudAwardsLogo, StartCampusLogo } from "./Logos";

export function SiteFooter() {
  return (
    <footer className="py-12 text-center">
      <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
        <StartCampusLogo />
        <DataCloudAwardsLogo />
      </div>
      <p className="mt-8 text-xs leading-[125%] text-foreground/60">© 2026 Start Campus. All rights reserved.</p>
    </footer>
  );
}
