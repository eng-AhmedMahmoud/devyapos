"use client";

import { openConsentSettings } from "@/lib/consent";

/**
 * Footer control that reopens the cookie preferences panel.
 *
 * A button rather than a link because it operates the on-page consent UI (via
 * {@link openConsentSettings}) instead of navigating anywhere. Styled to sit
 * among the footer links, so re-opening the choice is always one click away —
 * the standing "withdraw consent" route the policy points people to.
 */
export default function CookieSettingsLink({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {label}
    </button>
  );
}
