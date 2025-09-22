import { Clock } from "lucide-react";

export default function PriceHoldStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border/70 bg-gradient-to-br from-sky-50 to-sky-100/50 p-3 text-sky-900">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white"><Clock className="h-3.5 w-3.5" /></span>
          <span>
            Lock today’s intro price for <strong className="font-semibold">48h</strong> after adding to cart
          </span>
        </div>
        {!compact && (
          <span className="hidden text-xs text-sky-800 sm:inline">Timer starts on your first add-to-cart</span>
        )}
      </div>
    </div>
  );
}

