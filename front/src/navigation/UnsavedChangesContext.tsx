import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type UnsavedChangesContextValue = {
  hasUnsavedChanges: boolean;
  markUnsavedChanges: () => void;
  clearUnsavedChanges: () => void;
  confirmNavigation: (actionLabel?: string) => boolean;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | undefined>(undefined);

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const markUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const clearUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const confirmNavigation = useCallback(
    (actionLabel = "continuar") => {
      if (!hasUnsavedChanges) {
        return true;
      }

      return window.confirm(`Hay cambios sin guardar. Si continua, puede perderlos. Desea ${actionLabel}?`);
    },
    [hasUnsavedChanges],
  );

  const value = useMemo<UnsavedChangesContextValue>(
    () => ({
      hasUnsavedChanges,
      markUnsavedChanges,
      clearUnsavedChanges,
      confirmNavigation,
    }),
    [clearUnsavedChanges, confirmNavigation, hasUnsavedChanges, markUnsavedChanges],
  );

  return <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>;
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);

  if (!context) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  }

  return context;
}