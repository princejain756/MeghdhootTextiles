import { Progress } from "@/components/ui/progress";
import { Gift } from "lucide-react";
import { fakePerkPool } from "@/lib/fomo";

export default function PerkProgressBar() {
  const { total, left } = fakePerkPool();
  const used = total - left;
  const value = Math.min(100, Math.round((used / total) * 100));

  if (left <= 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-emerald-50 to-emerald-100/40 p-4 text-emerald-900">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white"><Gift className="h-3.5 w-3.5" /></span>
          <span>
            Free swatch pack for first {total} qualifying orders this week — <strong className="font-semibold">{left} left</strong>
          </span>
        </div>
        <span className="hidden text-xs text-emerald-800 sm:inline">Auto-applies at checkout</span>
      </div>
      <div className="mt-3">
        <Progress value={value} className="h-2" />
      </div>
    </div>
  );
}

