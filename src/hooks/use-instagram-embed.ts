import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: (element?: HTMLElement | Document) => void;
      };
    };
  }
}

// Loads the Instagram embed script once and provides a process function
export function useInstagramEmbed() {
  const [ready, setReady] = useState<boolean>(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If already present
    if (window.instgrm?.Embeds?.process) {
      setReady(true);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;

    const existing = document.getElementById("instagram-embed-script") as HTMLScriptElement | null;
    if (existing) {
      // If script tag exists but window.instgrm not ready yet, attach onload
      if (!window.instgrm?.Embeds?.process) {
        existing.addEventListener("load", () => setReady(true), { once: true });
      } else {
        setReady(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  const process = (element?: HTMLElement | Document) => {
    try {
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process(element ?? undefined);
      }
    } catch (err) {
      // no-op; graceful fail
    }
  };

  return { ready, process };
}
