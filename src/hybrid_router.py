"""Hybrid inference router for #BuildHybridAI.

Mirrors the Firebase AI Logic hybrid pattern: try on-device inference
first (fast, private, free), fall back to cloud when the on-device model
is unavailable, the prompt is too long for the on-device context, or the
on-device call fails. All routing decisions are pure and testable offline;
the Firebase AI Logic call sites are isolated behind backend callables so
the web app can inject the real SDK without changing the router.
"""
from dataclasses import dataclass, field

ON_DEVICE_MAX_CHARS = 1200


class BackendUnavailable(Exception):
    pass


@dataclass
class Result:
    text: str
    route: str  # "on-device" or "cloud"
    reason: str
    attempts: list = field(default_factory=list)


def route_prompt(prompt, on_device, cloud, on_device_available=True):
    """Route a prompt through hybrid inference.

    on_device / cloud: callables taking the prompt and returning text;
    either may raise BackendUnavailable (or any Exception) to signal failure.
    """
    attempts = []
    if not on_device_available:
        attempts.append("on-device:skipped-unavailable")
    elif len(prompt) > ON_DEVICE_MAX_CHARS:
        attempts.append("on-device:skipped-too-long")
    else:
        try:
            text = on_device(prompt)
            attempts.append("on-device:ok")
            return Result(text=text, route="on-device",
                          reason="short prompt served on-device", attempts=attempts)
        except Exception as exc:  # fall through to cloud
            attempts.append(f"on-device:failed:{type(exc).__name__}")
    try:
        text = cloud(prompt)
        attempts.append("cloud:ok")
        reason = ("cloud fallback after on-device unavailable/too-long/failed"
                  if attempts else "cloud")
        return Result(text=text, route="cloud", reason=reason, attempts=attempts)
    except Exception as exc:
        attempts.append(f"cloud:failed:{type(exc).__name__}")
        raise BackendUnavailable(f"both routes failed: {attempts}") from exc


def summarize(text, on_device, cloud, on_device_available=True):
    """App feature: summarize a note/document via the hybrid router."""
    prompt = ("Summarize the following in at most three short bullet points, "
              "keeping names, dates and numbers exact:\n\n" + text)
    return route_prompt(prompt, on_device, cloud,
                        on_device_available=on_device_available)
