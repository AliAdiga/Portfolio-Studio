"use client";
import { useEffect, useSyncExternalStore } from "react";

const EVENT = "themechange";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
const snapshot = () => document.documentElement.dataset.theme === "dark";

/**
 * Flip the theme. Page colours cross-fade because the root's registered colour tokens transition
 * (see globals.css), so no per-element transition classes are needed.
 */
function apply(dark: boolean) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Tactile day/night switch, built from CSS and inline SVG only.
 * The art is decorative (aria-hidden); the control is a real switch named "Dark mode".
 * Colours, thumb position and artwork are all driven by html[data-theme], which is set
 * before first paint, so there is no flash and no animation on page load.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);

  // With no saved choice, follow the system setting as it changes.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("theme");
      } catch {
        /* ignore */
      }
      if (saved !== "dark" && saved !== "light") apply(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      className={`switch ${className}`}
      onClick={() => {
        const next = !dark;
        try {
          localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
          /* storage blocked: the choice lasts for this visit */
        }
        apply(next);
      }}
    >
      <span className="switch-track" aria-hidden="true">
        <svg className="switch-sky day" viewBox="0 0 76 40" focusable="false">
          <circle cx="20" cy="20" r="46" fill="#fff" opacity="0.07" />
          <circle cx="20" cy="20" r="36" fill="#fff" opacity="0.08" />
          <circle cx="20" cy="20" r="27" fill="#fff" opacity="0.1" />
          <g className="sky-clouds" fill="#f4efe7">
            <circle cx="37" cy="31" r="5" opacity="0.7" />
            <circle cx="44" cy="29" r="6.5" opacity="0.7" />
            <circle cx="50" cy="35" r="7" />
            <circle cx="58" cy="30" r="8.5" />
            <circle cx="67" cy="35" r="7.5" />
            <circle cx="44" cy="38" r="6" />
            <rect x="40" y="35" width="40" height="8" />
          </g>
        </svg>
        <svg className="switch-sky night" viewBox="0 0 76 40" focusable="false">
          <circle cx="56" cy="20" r="46" fill="#fff" opacity="0.03" />
          <circle cx="56" cy="20" r="34" fill="#fff" opacity="0.04" />
          <circle cx="56" cy="20" r="25" fill="#fff" opacity="0.05" />
          <g className="sky-stars" fill="#f1ebe2">
            <circle cx="13" cy="11" r="1.2" />
            <circle cx="24" cy="27" r="1" opacity="0.8" />
            <circle cx="9" cy="29" r="0.8" opacity="0.7" />
            <circle cx="34" cy="14" r="0.9" opacity="0.8" />
            <path d="M31 24 l0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9 -2.2 -2.2 -0.9 2.2 -0.9z" opacity="0.9" />
          </g>
        </svg>
      </span>
      <span className="switch-thumb" aria-hidden="true">
        <span className="sun" />
        <span className="moon">
          <svg viewBox="0 0 30 30" width="30" height="30" focusable="false">
            <g fill="#a9acb8" opacity="0.8">
              <circle cx="11" cy="10" r="3.4" />
              <circle cx="20.5" cy="17.5" r="4.2" />
              <circle cx="10.5" cy="21" r="2.4" />
            </g>
            <g fill="#e9eaee" opacity="0.7">
              <circle cx="11.6" cy="10.7" r="2.6" />
              <circle cx="21.2" cy="18.2" r="3.4" />
              <circle cx="11" cy="21.6" r="1.7" />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}
