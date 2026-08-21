import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const QUERY = "(pointer: fine)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Parallax only makes sense for fine-pointer input (mouse/trackpad) and
 * only when the user hasn't asked for reduced motion.
 */
export function useParallaxEnabled() {
  const prefersReducedMotion = useReducedMotion();
  const hasFinePointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return hasFinePointer && !prefersReducedMotion;
}
