import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toCyrillic, type Script } from "../lib/script";

const STORAGE_KEY = "maktabhub.script";

interface ScriptContextValue {
  script: Script;
  setScript: (script: Script) => void;
  toggleScript: () => void;
  t: (latin: string) => string;
}

const ScriptContext = createContext<ScriptContextValue | null>(null);

function readStoredScript(): Script {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "cyrillic" ? "cyrillic" : "latin";
  } catch {
    return "latin";
  }
}

function persistScript(script: Script): void {
  try {
    localStorage.setItem(STORAGE_KEY, script);
  } catch {
    /* storage unavailable — ignore */
  }
}

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScriptState] = useState<Script>(readStoredScript);

  const setScript = useCallback((next: Script) => {
    setScriptState(next);
    persistScript(next);
  }, []);

  const toggleScript = useCallback(() => {
    setScriptState((prev) => {
      const next: Script = prev === "latin" ? "cyrillic" : "latin";
      persistScript(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (latin: string) => (script === "cyrillic" ? toCyrillic(latin) : latin),
    [script],
  );

  const value = useMemo(
    () => ({ script, setScript, toggleScript, t }),
    [script, setScript, toggleScript, t],
  );

  return (
    <ScriptContext.Provider value={value}>{children}</ScriptContext.Provider>
  );
}

export function useScript(): ScriptContextValue {
  const ctx = useContext(ScriptContext);
  if (!ctx) throw new Error("useScript is only available inside ScriptProvider");
  return ctx;
}
