import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
from hybrid_router import route_prompt, summarize, BackendUnavailable, ON_DEVICE_MAX_CHARS

passed = failed = 0
def check(name, cond):
    global passed, failed
    if cond: passed += 1; print(f"ok - {name}")
    else: failed += 1; print(f"FAIL - {name}")

dev = lambda p: "device:" + p[:10]
cloud = lambda p: "cloud:" + p[:10]
def boom(p): raise RuntimeError("nope")

r = route_prompt("hello world", dev, cloud)
check("short prompt routes on-device", r.route == "on-device" and r.text.startswith("device:"))
r = route_prompt("x" * (ON_DEVICE_MAX_CHARS + 1), dev, cloud)
check("long prompt routes to cloud", r.route == "cloud")
r = route_prompt("hi", dev, cloud, on_device_available=False)
check("unavailable on-device falls back to cloud", r.route == "cloud")
r = route_prompt("hi", boom, cloud)
check("on-device failure falls back to cloud", r.route == "cloud" and any("failed" in a for a in r.attempts))
try:
    route_prompt("hi", boom, boom); check("both failing raises", False)
except BackendUnavailable:
    check("both failing raises", True)
r = summarize("a short note about a meeting", dev, cloud)
check("summarize uses router", r.route in ("on-device", "cloud") and len(r.text) > 0)
print(f"{passed}/{passed+failed} PASSED")
sys.exit(1 if failed else 0)
