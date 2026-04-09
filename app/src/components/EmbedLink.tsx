"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useIsEmbedded } from "../hooks/useIsEmbedded";
import { appendEmbedParam } from "../hooks/useEmbedHref";

type LinkProps = ComponentProps<typeof Link>;

export default function EmbedLink({ href, ...props }: LinkProps) {
  const isEmbedded = useIsEmbedded();
  const resolvedHref = typeof href === "string"
    ? appendEmbedParam(href, isEmbedded)
    : href;

  return <Link href={resolvedHref} {...props} />;
}

export function EmbedAnchor({
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isEmbedded = useIsEmbedded();
  const resolvedHref = href ? appendEmbedParam(href, isEmbedded) : href;

  return <a href={resolvedHref} {...props} />;
}
