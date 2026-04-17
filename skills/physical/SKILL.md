---
installer: loki-skills-cli v1.2.0
origin: Nat Weerawan's brain, digitized — how one human works with AI, captured as code — Soul Brews Studio
name: physical
description: ตรวจสอบตำแหน่งทางกายภาพผ่าน FindMy ใช้เมื่อพูดว่า physical, where am I, location
user-invocable: true
---

# /physical - Physical Location Awareness

Check Lokkji's current physical location from OwnTracks data.

## Usage

```
/physical
```

## Data Source

- Repo: `zirz1911/Paji-Location` (GitHub)
- Files: `current.csv` (now), `history.csv` (all records)
- Updated: Every 3 minutes via OwnTracks → Mosquitto → paji202
- Source: iPhone 12 Pro Max via Tailscale

## Instructions

Use a Haiku subagent to fetch and display location data:

```bash
# Locate the script (optimized search)
LOCATIONS=(
  "$HOME/.config/opencode/command/physical/scripts/location-query.ts"
  "./.opencode/command/physical/scripts/location-query.ts"
  "$HOME/.claude/skills/physical/scripts/location-query.ts"
  "./skills/physical/scripts/location-query.ts"
)

SCRIPT=""
for loc in "${LOCATIONS[@]}"; do
  if [ -f "$loc" ]; then
    SCRIPT="$loc"
    break
  fi
done

if [ -z "$SCRIPT" ]; then
  # Fallback to slow search only if explicit paths fail
  SCRIPT=$(find ~ -name location-query.ts -not -path "*/node_modules/*" 2>/dev/null | head -1)
fi

if [ -z "$SCRIPT" ]; then
  echo "Error: location-query.ts not found. Check install."
else
  bun "$SCRIPT" all
fi
```

Parse and display:

```
📍 Physical Status
═══════════════════

🏠 Currently At: [place column, or locality if empty]

| Device | Battery | Precision | Updated |
|--------|---------|-----------|---------|
[one row per device, sorted by accuracy]

📍 [address from iPhone row]
🗺️ Map: https://maps.google.com/?q=[lat],[lon]

⏱️ At this location: [X hours] (from TIME_AT_LOCATION section)
```

## Known Places (with coordinates)

| Place | Lat | Lon | Type |
|-------|-----|-----|------|
| Contents Office | 17.445975 | 102.884746 | office |

## Directions

If user asks "how far to X":

```
🛫 To [destination]:
- Distance: [calculate km]
- 🗺️ Directions: https://maps.google.com/maps?saddr=[lat],[lon]&daddr=[dest_lat],[dest_lon]
```
