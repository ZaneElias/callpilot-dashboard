import { useEffect, useState, useRef } from "react";
import { Activity } from "lucide-react";
import ProviderCard, { type AgentStatus } from "@/components/ProviderCard";
import { providers } from "@/lib/providers";
import type { SwarmedProvider } from "@/lib/api";

interface Props {
  isScoring: boolean;
  swarmedProviders: SwarmedProvider[] | null;
}

const STATUS_SEQUENCE: AgentStatus[] = ["dialing", "negotiating", "checking", "secured"];
const STEP_DELAY = 2000;
const STAGGER = 800;

const LiveSwarmFeed = ({ isScoring, swarmedProviders }: Props) => {
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({});
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear timers on unmount
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // When scoring starts, pulse all cards
  useEffect(() => {
    if (isScoring) {
      const s: Record<string, AgentStatus> = {};
      providers.forEach((p) => (s[p.name] = "scoring"));
      setStatuses(s);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }
  }, [isScoring]);

  // When results arrive, animate top 3 status progression
  useEffect(() => {
    if (!swarmedProviders) return;

    const swarmedNames = new Set(swarmedProviders.map((p) => p.name));

    // Hide non-selected, set selected to first status
    const initial: Record<string, AgentStatus> = {};
    providers.forEach((p) => {
      initial[p.name] = swarmedNames.has(p.name) ? "dialing" : "hidden";
    });
    setStatuses(initial);

    // Stagger status progression for each swarmed provider
    swarmedProviders.forEach((sp, idx) => {
      STATUS_SEQUENCE.forEach((status, stepIdx) => {
        if (stepIdx === 0) return; // already set to dialing
        const t = setTimeout(() => {
          setStatuses((prev) => ({ ...prev, [sp.name]: status }));
        }, idx * STAGGER + stepIdx * STEP_DELAY);
        timersRef.current.push(t);
      });
    });
  }, [swarmedProviders]);

  // Build display data
  const displayProviders = swarmedProviders
    ? swarmedProviders.map((sp) => ({
        name: sp.name,
        rating: sp.rating,
        distance: sp.distance_miles,
        matchScore: sp.match_score,
        status: statuses[sp.name] || "idle",
      }))
    : providers.map((p) => ({
        name: p.name,
        rating: p.rating,
        distance: p.distance_miles,
        matchScore: undefined,
        status: (statuses[p.name] || "idle") as AgentStatus,
      }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-foreground">Live Swarm Feed</h2>
      </div>
      <div className="grid gap-3">
        {displayProviders.map((p) => (
          <ProviderCard key={p.name} {...p} />
        ))}
      </div>
    </div>
  );
};

export default LiveSwarmFeed;
