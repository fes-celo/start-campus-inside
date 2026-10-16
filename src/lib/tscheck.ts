import { lazy } from "react";
import type { ErrorRouteComponent, ErrorComponentProps } from "@tanstack/react-router";

function E1(_props: ErrorComponentProps) {
  return null;
}
export const t1: ErrorRouteComponent = E1;

function E2(_props: ErrorComponentProps) {
  return null;
}
E2.preload = () => undefined;
export const t2: ErrorRouteComponent = E2;

export const E3 = Object.assign((_props: ErrorComponentProps) => null, {
  preload: () => undefined,
});
export const t3: ErrorRouteComponent = E3;

export const E4 = lazy(async () => ({
  default: (_props: ErrorComponentProps) => null,
}));
export const t4: ErrorRouteComponent = E4;

export const E5 = Object.assign(function E5(_props: ErrorComponentProps) {
  return null;
}, {} as { preload?: () => Promise<void> | undefined });
export const t5: ErrorRouteComponent = E5;
