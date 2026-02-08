

# CallPilot Mission Control Dashboard

A clean, professional AI Voice Agent dashboard for booking appointments — Apple/Medical-inspired soft UI.

## Design System
- **Light soft UI**: White backgrounds, soft grey cards (`#F8F9FA`), generous rounded corners (`xl`/`2xl`), large subtle shadows
- **Accents**: Soft Blue (`#4A90D9`) for primary actions, Mint Green (`#34D399`) for success, Soft Red (`#EF4444`) for errors
- **Typography**: Clean, spacious, professional

---

## Page Layout (Single Page)

### 1. Top Header Bar
- "CallPilot Mission Control" branding with a subtle radar icon
- Minimal, clean design

### 2. Single Call Card (Top-Left, compact)
- **Phone Number** input
- **Mission Objective** text input
- **"Initiate Call"** button (soft blue)
- `POST /start-call` → `{ phone_number, objective }`
- Shows loading state, then success toast with `conversation_id` or error toast

### 3. Swarm Command Center (Left Panel)
- **User Phone** input
- **Objective** text input
- **Preferences Panel:**
  - Max Distance slider (1–20 miles, default 5)
  - Min Rating slider (1.0–5.0, default 4.0)
  - Prioritize Rating toggle
  - Prioritize Distance toggle
- Large **"Deploy Swarm"** button
- `POST /start-swarm` → `{ user_phone, objective, preferences: { max_distance, min_rating, prioritize_rating, prioritize_distance } }`

### 4. Live Swarm Feed (Right Side)
- **Initial state**: Shows all 5 providers from hardcoded `providers.json` data as muted preview cards (name, rating stars, distance)
- **On Deploy Swarm click:**
  1. All cards show a **"Scoring Providers..."** shimmer/pulse animation
  2. After API responds, cards transition to show only the **Top 3** returned in `swarmed_providers` — displaying Provider Name, Star Rating, Distance, and **Match Score** (from backend `match_score`)
  3. **Simulated live status progression** on each card with staggered timing (since backend calls are async and we don't have a websocket):
     - "Dialing..." (blue) → "Negotiating..." (blue) → "Checking Calendar..." (yellow) → "Appointment Secured ✓" (mint green)
  4. Non-selected providers fade out

### 5. Toast Notifications & Error Handling
- Success: "Swarm Deployed — X agents active" with provider names
- Error: Friendly CORS/network error messages
- Loading states on all buttons (disabled + spinner)
- Basic input validation (phone number format, non-empty objective)

### 6. Backend Connection
- All API calls via `fetch` to configurable base URL (defaulting to `http://localhost:8000`)
- Graceful handling of network errors and CORS issues

