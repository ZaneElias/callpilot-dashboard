import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type AgentStatus = "idle" | "scoring" | "dialing" | "negotiating" | "checking" | "secured" | "hidden";

interface Props {
  name: string;
  rating: number;
  distance: number;
  matchScore?: number;
  status: AgentStatus;
}

const statusConfig: Record<AgentStatus, { label: string; className: string }> = {
  idle: { label: "", className: "" },
  scoring: { label: "Scoring...", className: "bg-muted text-muted-foreground animate-pulse" },
  dialing: { label: "Dialing...", className: "bg-primary/15 text-primary" },
  negotiating: { label: "Negotiating...", className: "bg-primary/15 text-primary" },
  checking: { label: "Checking Calendar...", className: "bg-warning/15 text-warning" },
  secured: { label: "Appointment Secured ✓", className: "bg-success/15 text-success" },
  hidden: { label: "", className: "" },
};

const ProviderCard = ({ name, rating, distance, matchScore, status }: Props) => {
  if (status === "hidden") return null;

  const s = statusConfig[status];
  const isActive = status !== "idle" && status !== "scoring";

  return (
    <div
      className={cn(
        "card-soft p-5 space-y-3 transition-all duration-500",
        status === "scoring" && "animate-pulse",
        status === "idle" && "opacity-60",
        isActive && "opacity-100 ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-foreground">{name}</h3>
        {matchScore !== undefined && (
          <Badge variant="secondary" className="text-xs font-bold">
            {matchScore}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {distance} mi
        </span>
      </div>

      {s.label && (
        <div className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", s.className)}>
          {s.label}
        </div>
      )}
    </div>
  );
};

export default ProviderCard;
