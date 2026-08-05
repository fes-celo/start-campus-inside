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
      className={`flex h-14 w-14 items-center justify-center rounded-full bg-teal/60 backdrop-blur-sm ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 translate-x-[2px] fill-primary-foreground"
        aria-hidden="true"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}
