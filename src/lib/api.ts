const BASE_URL = "http://localhost:8000";

export interface StartCallPayload {
  phone_number: string;
  objective: string;
}

export interface StartCallResponse {
  success: boolean;
  conversation_id: string;
  callSid: string;
}

export interface UserPreferences {
  max_distance: number;
  min_rating: number;
  prioritize_rating: boolean;
  prioritize_distance: boolean;
}

export interface StartSwarmPayload {
  user_phone: string;
  objective: string;
  preferences: UserPreferences;
}

export interface SwarmedProvider {
  name: string;
  match_score: number;
  rating: number;
  distance_miles: number;
}

export interface StartSwarmResponse {
  status: string;
  deployed_agents: number;
  swarmed_providers: SwarmedProvider[];
}

async function apiFetch<T>(endpoint: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed (${res.status})`);
    }
    return res.json();
  } catch (e: any) {
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      throw new Error("Cannot reach backend — check that your server is running on localhost:8000");
    }
    throw e;
  }
}

export const startCall = (payload: StartCallPayload) =>
  apiFetch<StartCallResponse>("/start-call", payload);

export const startSwarm = (payload: StartSwarmPayload) =>
  apiFetch<StartSwarmResponse>("/start-swarm", payload);
