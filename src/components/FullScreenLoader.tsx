import { Loader2 } from "lucide-react";

const FullScreenLoader = ({ label = "Preparing your experience" }: { label?: string }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">{label}…</p>
    </div>
  );
};

export default FullScreenLoader;
