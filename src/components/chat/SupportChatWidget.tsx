import { useMemo, useState } from "react";
import { Mail, MessageCircle, Phone, ChevronRight, X } from "lucide-react";
import showroom from "@/assets/showroom-interior.jpg";

// Simple global chat/support widget with WhatsApp, Call and Email actions
// Appears as a floating button and expands into a panel on click
export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);

  // Allow overrides via env; provide sensible defaults
  const config = useMemo(() => {
    const whatsapp = import.meta.env.VITE_SUPPORT_WHATSAPP_NUMBER ?? "+919342503401"; // E.164 without spaces
    const phone = import.meta.env.VITE_SUPPORT_PHONE ?? "+919342503401";
    const email = import.meta.env.VITE_SUPPORT_EMAIL ?? "support@meghdoottextiles.com";
    const brand = import.meta.env.VITE_BRAND_NAME ?? "MeghDoot Textiles";
    const presetMsg = encodeURIComponent(`Hello ${brand} team! I have a question about wholesale.`);
    return {
      whatsappUrl: `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${presetMsg}`,
      phoneUrl: `tel:${phone}`,
      emailUrl: `mailto:${email}?subject=${encodeURIComponent("Wholesale inquiry")}`,
    };
  }, []);

  return (
    <>
      {/* Floating bubble button (hidden when panel is open) */}
      {!open && (
        <button
          aria-label="Chat with support"
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-4 h-14 w-14 rounded-full bg-rose-400 text-white shadow-xl hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-400"
        >
          {/* Ping ripple */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-40" />
          <span className="relative flex h-full w-full items-center justify-center">
            <MessageCircle className="h-6 w-6" />
          </span>
        </button>
      )}

      {/* Panel overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-end bg-black/30"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="mb-4 mr-4 sm:mb-6 sm:mr-6 w-[calc(100%-1rem)] sm:w-[390px] max-h-[85vh] overflow-hidden rounded-2xl bg-background text-foreground shadow-2xl border animate-in slide-in-from-right-4 sm:slide-in-from-right-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            <div className="relative h-40 w-full">
              <img src={showroom} alt="Support" className="h-full w-full object-cover" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold">How can we help you today?</h3>
                <p className="text-muted-foreground text-sm">
                  Select a category so we can serve you better.
                </p>
              </div>

              <div className="space-y-3">
                <ActionCard
                  iconBg="bg-rose-100 text-rose-600"
                  title="Chat with us"
                  description="Have all your queries conveniently answered by our customer support executives via WhatsApp chat!"
                  onClick={() => window.open(config.whatsappUrl, "_blank")}
                >
                  <MessageCircle className="h-5 w-5" />
                </ActionCard>

                <ActionCard
                  iconBg="bg-amber-100 text-amber-600"
                  title="Talk to us"
                  description="Give us a quick ring via Phone Call to have all your queries answered by our customer support team!"
                  onClick={() => (window.location.href = config.phoneUrl)}
                >
                  <Phone className="h-5 w-5" />
                </ActionCard>

                <ActionCard
                  iconBg="bg-sky-100 text-sky-600"
                  title="Write to us"
                  description="Get in touch with us via E‑mail and we’ll get back to you."
                  onClick={() => (window.location.href = config.emailUrl)}
                >
                  <Mail className="h-5 w-5" />
                </ActionCard>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActionCard({
  title,
  description,
  iconBg,
  onClick,
  children,
}: {
  title: string;
  description: string;
  iconBg: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border p-4 hover:bg-muted/40 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
          {children}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base">{title}</div>
          <p className="text-sm text-muted-foreground leading-snug">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}
