// Provider-agnostic analytics event wrapper
// Fires Plausible-style custom events if available, falls back to console.debug

type EventName =
  | 'calculator_viewed'
  | 'input_changed'
  | 'estimate_viewed'
  | 'breakdown_expanded'
  | 'lead_form_started'
  | 'lead_captured'
  | 'lead_form_abandoned';

interface EventPayload {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Fire an analytics event. Provider-agnostic:
 * - If Plausible is loaded, fires via window.plausible()
 * - If GA4 is loaded, fires via gtag()
 * - Falls back to console.debug in development
 */
export function trackEvent(name: EventName, payload?: EventPayload): void {
  // Plausible
  if (typeof window !== 'undefined' && 'plausible' in window) {
    (window as any).plausible(name, { props: payload });
    return;
  }

  // GA4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', name, payload);
    return;
  }

  // Development fallback
  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${name}`, payload || '');
  }
}
