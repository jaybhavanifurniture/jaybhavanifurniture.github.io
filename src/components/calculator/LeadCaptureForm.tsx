import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../lib/analytics';
import showroom from '../../data/showroom.json';

interface LeadCaptureFormProps {
  contextSummary?: string;
}

export function LeadCaptureForm({ contextSummary }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [hasStarted, setHasStarted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Track form start
  const handleFocus = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('lead_form_started');
    }
  }, [hasStarted]);

  // Track form abandonment
  useEffect(() => {
    if (!hasStarted || status === 'success') return;

    const handleBeforeUnload = () => {
      trackEvent('lead_form_abandoned');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStarted, status]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !contact.trim()) return;

      setStatus('submitting');

      try {
        // Construct the WhatsApp message
        const message = `*New Estimate Inquiry*\n\n*Name:* ${name}\n*Contact:* ${contact}\n\n*Estimate Details:*\n${contextSummary || 'No details provided.'}`;
        const whatsappUrl = `${showroom.whatsappUrl}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        setStatus('success');
        trackEvent('lead_captured');
      } catch {
        setStatus('error');
      }
    },
    [name, contact, contextSummary],
  );

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-green-200 bg-green-50 p-5 text-center dark:border-green-800/50 dark:bg-green-900/20"
          >
            <div className="mb-2 text-2xl">✓</div>
            <p className="font-semibold text-green-800 dark:text-green-300">
              Opening WhatsApp...
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              If nothing happens, click the WhatsApp button in the menu.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-wood-50/80 p-5 dark:border-amber-800/30 dark:from-amber-900/10 dark:to-wood-900/10">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Want a designer to refine this estimate?
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Send your details to us on WhatsApp and we'll chat about your exact space.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-4 space-y-3"
              >
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleFocus}
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Phone or email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  onFocus={handleFocus}
                  required
                  minLength={10}
                  maxLength={50}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-500 dark:hover:bg-amber-400"
                >
                  {status === 'submitting' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Loading…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-900"
                      >
                        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                      </svg>
                      Send to WhatsApp
                    </span>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-center text-xs text-red-500">
                    Something went wrong. Please try again or WhatsApp us directly.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
