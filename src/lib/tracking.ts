/**
 * tracking.ts — single source of truth for lead conversion tracking.
 *
 * Push a `generate_lead` event to dataLayer/gtag (method: "form" | "call" | "text")
 * and fire the Google Ads conversions. Leads themselves are sent to GHL by the
 * Royalty booking widget (components/royalty-booking.tsx).
 */

export type LeadMethod = "form" | "call" | "text";

/**
 * Google Ads conversion labels. Format: AW-<account>/<conversion-label>.
 * Used as the gtag `send_to` value.
 */
const GOOGLE_ADS_FORM_CONVERSION = "AW-931355603/tkwuCKLs78ccENO3jbwD";
const GOOGLE_ADS_CALL_CONVERSION = "AW-931355603/uVslCNmV3c0cENO3jbwD";

/**
 * Fire the Google Ads "Click to call" conversion. Mirrors Google's
 * gtag_report_conversion snippet (value 1.0 USD). Fire-and-forget: we don't
 * hijack navigation because tel: links open the dialer natively.
 */
export function reportCallConversion(): boolean {
  if (typeof window === "undefined") return false;

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return false;

  w.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CALL_CONVERSION,
    value: 1.0,
    currency: "USD",
  });
  return false;
}

/**
 * Fire the Google Ads "Submit lead form" conversion (value 1.0 USD). The form
 * shows an inline success state, so no redirect callback is needed.
 * Idempotency is enforced by the caller (fires exactly once per lead) — see
 * LeadTracking's "royalty-booking:info" listener.
 */
export function reportAdsConversion(): boolean {
  if (typeof window === "undefined") return false;

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return false;

  w.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_FORM_CONVERSION,
    value: 1.0,
    currency: "USD",
  });
  return false;
}

/**
 * Fire the analytics conversion event. Safe to call on the client only.
 * Pushes to both dataLayer (GTM) and gtag (GA4 / Google Ads) if present.
 */
export function trackLead(method: LeadMethod, extra?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "generate_lead", method, ...extra });

  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", { method, ...extra });
  }
}
