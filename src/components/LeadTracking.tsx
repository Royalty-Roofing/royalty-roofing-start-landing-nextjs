"use client";

/**
 * LeadTracking — mounts once and listens (via event delegation) for clicks on
 * any tel: or sms: link anywhere on the page, firing a `generate_lead` event
 * with the correct method ("call" or "text"). This keeps every phone/text link
 * tracked without wiring onClick into each component.
 *
 * It also listens for the booking widget's "royalty-booking:info" event (a lead
 * was submitted) and fires the form conversions once per lead.
 */
import { useEffect } from "react";
import { trackLead, reportCallConversion, reportAdsConversion } from "@/lib/tracking";

export default function LeadTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href^='tel:'], a[href^='sms:']") as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const method = href.startsWith("sms:") ? "text" : "call";
      trackLead(method);
      // Fire the Google Ads "Click to call" conversion on tel: clicks only.
      if (method === "call") reportCallConversion();
    };
    document.addEventListener("click", handler);

    // Booking widget lead: fire the GA4/GTM lead event and the Google Ads
    // "Submit lead form" conversion exactly once per lead.
    const counted = new Set<string>();
    const onLead = (e: Event) => {
      const d = ((e as CustomEvent).detail || {}) as Record<string, unknown>;
      const key = String(d.phone || d.email || "lead");
      if (counted.has(key)) return;
      counted.add(key);
      trackLead("form", { form_type: "roofing_estimate" });
      reportAdsConversion();
    };
    window.addEventListener("royalty-booking:info", onLead);

    return () => {
      document.removeEventListener("click", handler);
      window.removeEventListener("royalty-booking:info", onLead);
    };
  }, []);

  return null;
}
