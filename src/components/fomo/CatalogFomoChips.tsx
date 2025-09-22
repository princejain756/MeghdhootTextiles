import { Badge } from "@/components/ui/badge";
import { fakeCatalogFomo, formatIST } from "@/lib/fomo";
import { AlertTriangle, FlameKindling, Eye, Users } from "lucide-react";

export function CatalogFomoChips({ keySeed }: { keySeed: string }) {
  const f = fakeCatalogFomo(keySeed);

  // Urgency (pick 1): low stock preferred, else final run
  const urgency = (() => {
    if (typeof f.lowStockSets === "number" && f.lowStockSets > 0 && f.lowStockSets <= 5) {
      return (
        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
          <FlameKindling className="mr-1.5 h-3.5 w-3.5" />
          {f.lowStockSets <= 2 ? "Fast-moving" : "Limited"}: {f.lowStockSets} sets left
        </Badge>
      );
    }
    if (f.finalRunDate) {
      return (
        <Badge variant="outline" className="border-rose-300/60 text-rose-600">
          <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
          Final run — retiring {formatIST(f.finalRunDate, { weekday: "short", day: "2-digit", month: "short" })}
        </Badge>
      );
    }
    return null;
  })();

  // Proof (pick 1): recent interest preferred, else concurrent viewers
  const proof = (() => {
    if (typeof f.recentInterest === "number" && f.recentInterest > 0) {
      return (
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-800">
          <Users className="mr-1.5 h-3.5 w-3.5" /> {f.recentInterest} retailers showed interest this week
        </Badge>
      );
    }
    if (typeof f.concurrentViewers === "number" && f.concurrentViewers >= 8) {
      return (
        <Badge variant="outline" className="border-sky-300/60 text-sky-700">
          <Eye className="mr-1.5 h-3.5 w-3.5" /> {f.concurrentViewers} viewing now
        </Badge>
      );
    }
    return null;
  })();

  return (
    <div className="flex flex-wrap gap-2">
      {urgency}
      {proof}
    </div>
  );
}

export function CatalogSidebarFomo({ keySeed }: { keySeed: string }) {
  const f = fakeCatalogFomo(keySeed);
  if (!f.citySlots && !f.queueSize) return null;
  return (
    <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
      {f.citySlots && (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2">
          <span>City allocations</span>
          <span className="font-medium text-foreground">
            {f.citySlots.taken} of {f.citySlots.total} {f.citySlots.city}
          </span>
        </div>
      )}
      {typeof f.queueSize === "number" && f.queueSize > 8 && (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2">
          <span>In production queue</span>
          <span className="font-medium text-foreground">{f.queueSize} ahead</span>
        </div>
      )}
    </div>
  );
}
