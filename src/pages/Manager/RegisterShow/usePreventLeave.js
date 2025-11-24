// usePreventLeave.js
import { useEffect } from "react";

export default function usePreventLeave(shouldBlock) {
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock]);
}
