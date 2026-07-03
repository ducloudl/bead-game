import subprocess
import os

token = "ghp_...n
repo_url = f"https://{token}@github.com/ducloudl/bead-game.git"

os.chdir("/c/Users/Administrator/Projects/bead-game")

# 设置 remote
subprocess.run(["git", "remote", "set-url", "origin", repo_url], check=True)

# 验证 remote
result = subprocess.run(["git", "remote", "-v"], capture_output=True, text=True)
print("=== Remote ===")
print(result.stdout)

# 推送
env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"
result2 = subprocess.run(
    ["git", "push", "-u", "origin", "master"],
    capture_output=True, text=True,
    env=env
)
print("=== Push ===")
print(result2.stdout[-500:] if len(result2.stdout) > 500 else result2.stdout)
if result2.stderr:
    print("stderr:", result2.stderr[-300:])
