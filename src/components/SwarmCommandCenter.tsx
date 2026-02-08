import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { startSwarm, type StartSwarmResponse } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Props {
  onSwarmDeployed: (data: StartSwarmResponse) => void;
  onSwarmStarted: () => void;
}

const SwarmCommandCenter = ({ onSwarmDeployed, onSwarmStarted }: Props) => {
  const [userPhone, setUserPhone] = useState("");
  const [objective, setObjective] = useState("");
  const [maxDistance, setMaxDistance] = useState(5);
  const [minRating, setMinRating] = useState(4.0);
  const [prioritizeRating, setPrioritizeRating] = useState(false);
  const [prioritizeDistance, setPrioritizeDistance] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = userPhone.trim().length >= 10 && objective.trim().length > 0;

  const handleDeploy = async () => {
    if (!canSubmit) return;
    setLoading(true);
    onSwarmStarted();
    try {
      const res = await startSwarm({
        user_phone: userPhone.trim(),
        objective: objective.trim(),
        preferences: {
          max_distance: maxDistance,
          min_rating: minRating,
          prioritize_rating: prioritizeRating,
          prioritize_distance: prioritizeDistance,
        },
      });
      toast({
        title: `Swarm Deployed — ${res.deployed_agents} agents active`,
        description: res.swarmed_providers.map((p) => p.name).join(", "),
      });
      onSwarmDeployed(res);
    } catch (e: any) {
      toast({
        title: "Swarm Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-soft p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-foreground">Swarm Command Center</h2>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Your Phone</Label>
          <Input
            placeholder="+1 (555) 123-4567"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Objective</Label>
          <Input
            placeholder="Book a dentist appointment"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4 pt-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preferences</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Max Distance</Label>
            <span className="text-sm font-medium text-primary">{maxDistance} mi</span>
          </div>
          <Slider
            value={[maxDistance]}
            onValueChange={([v]) => setMaxDistance(v)}
            min={1}
            max={20}
            step={1}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Min Rating</Label>
            <span className="text-sm font-medium text-primary">{minRating.toFixed(1)} ★</span>
          </div>
          <Slider
            value={[minRating]}
            onValueChange={([v]) => setMinRating(v)}
            min={1}
            max={5}
            step={0.1}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Prioritize Rating</Label>
          <Switch checked={prioritizeRating} onCheckedChange={setPrioritizeRating} disabled={loading} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Prioritize Distance</Label>
          <Switch checked={prioritizeDistance} onCheckedChange={setPrioritizeDistance} disabled={loading} />
        </div>
      </div>

      <Button
        onClick={handleDeploy}
        disabled={!canSubmit || loading}
        className="w-full rounded-xl h-12 text-base font-semibold"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Deploying...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Deploy Swarm
          </>
        )}
      </Button>
    </div>
  );
};

export default SwarmCommandCenter;
