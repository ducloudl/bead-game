import subprocess
import json

token = "ghp_...n
payload = json.dumps({"source": {"branch": "main", "path": "/"}})
result = subprocess.run(
    ["curl", "-s", "-X", "POST", "https://api.github.com/repos/ducloudl/bead-game/pages",
     "-H", "Authorization: Bearer " + token,
     "-H", "Accept: application/vnd.github+json",
     "-H", "X-GitHub-Api-Version: 2022-11-28",
     "-d", payload],
    capture_output=True, text=True
)
print("=== GitHub Pages ===")
print(result.stdout[:500])
if result.stderr:
    print("stderr:", result.stderr[:200])
