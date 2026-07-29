export function StartCampusLogo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border-2 ${
          light ? "border-primary-foreground" : "border-primary"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="#12bd64" />
        </svg>
      </span>
      <span
        className={`text-sm font-bold leading-[1.05] ${
          light ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        Start
        <br />
        Campus
      </span>
    </div>
  );
}

export function DataCloudAwardsLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-[#e0a800]">★★★★★</p>
      <p className="text-sm font-bold leading-tight text-foreground">
        DATACLOUD
        <br />
        AWARDS
      </p>
      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
        Best Data Centre in Europe
      </p>
    </div>
  );
}

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid h-14 w-14 place-items-center rounded-full bg-teal/60 backdrop-blur-sm ${className}`}
    >
      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-primary-foreground" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}