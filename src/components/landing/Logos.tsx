import startCampusLogo from "@/assets/startcampus-logo.svg.asset.json";
import startCampusLogoLight from "@/assets/startcampus-logo-light.svg.asset.json";

export function StartCampusLogo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <img
      src={light ? startCampusLogoLight.url : startCampusLogo.url}
      alt="Start Campus"
      className={`h-10 w-auto sm:h-12 ${className}`}
    />
  );
}

export function DataCloudAwardsLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/datacloud-awards-logo.svg"
      alt="DataCloud Awards - Best Data Centre in Europe"
      className={`h-12 w-auto ${className}`}
    />
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
