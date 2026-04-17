---
name: location-install
description: ติดตั้ง Location Tracking สำหรับ user ใหม่ — สร้าง MQTT user, GitHub repo, clone, config ใช้เมื่อพูดว่า location install, add location user, setup location
user-invocable: true
---

# /location-install — Setup Location Tracking for a New User

Install OwnTracks location tracking for a new user on this server.

## What this does

1. Ask user for details
2. Create MQTT credentials
3. Create GitHub repo (auto, under logged-in gh account)
4. Clone repo locally
5. Add user to `users.json`
6. Restart `location-server`

## Steps

### Step 1: Check prerequisites

```bash
gh auth status 2>&1 | head -3
pm2 status location-server | grep location-server
```

If `location-server` is not running → tell user to run `/location-install` after starting it.
Get GitHub username: `gh api user --jq '.login'`

### Step 2: Ask questions (one by one, wait for each answer)

Ask in order:

1. **Username** — "ชื่อ username สำหรับ location tracking คืออะไร? (ใช้เป็น MQTT topic: owntracks/{username}/iphone)"
2. **Password** — "ตั้ง password สำหรับ {username} ครับ"
3. **Repo name** — "ชื่อ GitHub repo คืออะไร? (กด Enter ใช้ default: {username}-location)"
4. **Named places** — "มีสถานที่ที่ต้องการตั้งชื่อมั้ย? เช่น Home, Office (พิมพ์ชื่อ,lat,lon เช่น 'Home,13.756,100.502' หรือ skip กด Enter)"

### Step 3: Create MQTT user

```bash
sudo mosquitto_passwd -b /etc/mosquitto/passwd {username} '{password}'
```

Ask user to run: `! sudo mosquitto_passwd -b /etc/mosquitto/passwd {username} '{password}'`

### Step 4: Create GitHub repo + clone

```bash
GITHUB_USER=$(gh api user --jq '.login')
REPO_NAME="{username}-location"  # or custom name from step 2
REPO_DIR="$HOME/Project/{Username}-Location"

# Create repo
gh repo create $GITHUB_USER/$REPO_NAME --public --description "Location tracking for {username}"

# Initialize with current.csv
mkdir -p $REPO_DIR
cd $REPO_DIR
git init
echo "lat,lon,address,timestamp,battery,accuracy" > current.csv
echo "0,0,initializing,$(date -u +%Y-%m-%dT%H:%M:%SZ),," >> current.csv
git add .
git commit -m "init: location tracking repo"
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
git push -u origin main
```

### Step 5: Add user to users.json

Read current `/home/paji/Project/Location-Server/users.json`, add new user entry:

```json
"{username}": {
  "repo_dir": "/home/paji/Project/{Username}-Location",
  "github_repo": "{github_user}/{repo_name}",
  "named_places": [
    // add named places if provided in step 2
    {"name": "Place Name", "lat": 0.0, "lon": 0.0, "radius_m": 200}
  ]
}
```

Write back to users.json.

### Step 6: Restart location-server

```bash
pm2 restart location-server
pm2 logs location-server --lines 5 --nostream
```

### Step 7: Show OwnTracks setup guide

Display connection settings for the new user:

```
✅ Setup Complete!

📱 OwnTracks Settings:
─────────────────────
Mode:     MQTT
Host:     100.70.100.11  (Tailscale — ต้องเชื่อม Tailscale zirz1911 ก่อน)
Port:     1883
TLS:      OFF
Username: {username}
Password: {password}
Device ID: iphone (หรืออะไรก็ได้)

📦 GitHub Repo: https://github.com/{github_user}/{repo_name}
```

## Notes

- Tailscale network: `zirz1911` — user ต้องได้รับ invite ก่อน
- Named places เพิ่มทีหลังได้โดยแก้ `/home/paji/Project/Location-Server/users.json`
- History จะเริ่มเก็บทันทีที่ OwnTracks ส่ง location แรก
