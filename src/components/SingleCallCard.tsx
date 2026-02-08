import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startCall } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const SingleCallCard = () => {
  const [phone, setPhone] = useState("");
  const [objective, setObjective] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = phone.trim().length >= 10 && objective.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await startCall({ phone_number: phone.trim(), objective: objective.trim() });
      toast({
        title: "Call Initiated ✓",
        description: `Conversation ID: ${res.conversation_id}`,
      });
      setPhone("");
      setObjective("");
    } catch (e: any) {
      toast({
        title: "Call Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-soft p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Phone className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-foreground">Single Call</h2>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="sc-phone" className="text-xs text-muted-foreground">Phone Number</Label>
          <Input
            id="sc-phone"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sc-objective" className="text-xs text-muted-foreground">Mission Objective</Label>
          <Input
            id="sc-objective"
            placeholder="Book a dentist appointment"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full rounded-xl"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Initiate Call"}
      </Button>
    </div>
  );
};

export default SingleCallCard;
