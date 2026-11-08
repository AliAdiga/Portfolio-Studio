"use client";
import { useSyncExternalStore } from "react";

const EVENT = "themechange";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
const snapshot = () => document.documentElement.dataset.theme === "dark";

/** Light is the default. The choice is remembered on this device only. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  return (
    <button
      type="button"
      className={`btn btn-ghost min-h-11 px-4 py-2 ${className}`}
      aria-pressed={dark}
      onClick={() => {
        const next = !dark;
        document.documentElement.dataset.theme = next ? "dark" : "light";
        try {
          localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
          /* storage blocked: the choice simply lasts for this visit */
        }
        window.dispatchEvent(new Event(EVENT));
      }}
    >
      Dark theme
    </button>
  );
}
