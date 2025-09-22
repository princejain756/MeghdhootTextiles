import { useEffect, useMemo, useState } from "react";
import { AlarmClock, CalendarClock, Rocket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { compactCountdown, getCountdown, getNextWeeklyCutoff } from "@/lib/fomo";

type Mode = "cutoff" | "early" | "drop";

const messages: Record<Mode, { icon: JSX.Element; render: (args: { text: string }) => JSX.Element }> = {
  cutoff: {
    icon: <AlarmClock className="h-4 w-4" />,
    render: ({ text }) => (
      <>
        <span className="hidden sm:inline">Dispatch cutoff:</span> Order in <strong className="font-semibold">{text}</strong> for this week’s truck.
      </>
    ),
  },
  early: {
    icon: <Rocket className="h-4 w-4" />,
    render: () => (
      <>
        Trade-only Early Access <span className="hidden sm:inline">window</span> ends <strong className="font-semibold">tomorrow 6:00 PM IST</strong>.
      </>
    ),
  },
  drop: {
    icon: <CalendarClock className="h-4 w-4" />,
    render: () => (
      <>
        Festive Drop II <span className="hidden sm:inline">opens</span> <strong className="font-semibold">Oct 3</strong>, closes <strong className="font-semibold">Oct 10</strong>.
      </>
    ),
  },
};

export default function FomoBar() {
  const [mode, setMode] = useState<Mode>("cutoff");
  const [tick, setTick] = useState(0);
  const cutoff = useMemo(() => getNextWeeklyCutoff(18, 0, 5), []);
  const cdown = getCountdown(cutoff.nextCutoffIST);

  // Advance countdown and rotate modes for variety
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    const rot = setInterval(() => {
      setMode((m) => (m === "cutoff" ? "early" : m === "early" ? "drop" : "cutoff"));
    }, 15000);
    return () => {
      clearInterval(i);
      clearInterval(rot);
    };
  }, []);

  const text = useMemo(() => compactCountdown(cdown), [cdown, tick]);
  const content = messages[mode];

  return (
    <div
      className={cn(
        "relative z-[60] w-full border-b border-white/10 bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 text-white",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-10 items-center justify-center gap-2 text-sm">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            {content.icon}
          </span>
          <span className="select-none">
            {content.render({ text })}
          </span>
          <span className="ml-2 hidden items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs sm:flex">
            <Sparkles className="h-3 w-3" /> Priority dispatch
          </span>
        </div>
      </div>
    </div>
  );
}

