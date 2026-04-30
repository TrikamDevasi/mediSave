import { useEffect, useState } from "react";

const KEY = "medisave_onboarded";

export function useOnboarding() {
  const [checked, setChecked] = useState(false);
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOnboarded(localStorage.getItem(KEY) === "true");
    setChecked(true);
  }, []);

  const complete = () => {
    localStorage.setItem(KEY, "true");
    setOnboarded(true);
  };

  return { checked, onboarded, complete };
}
