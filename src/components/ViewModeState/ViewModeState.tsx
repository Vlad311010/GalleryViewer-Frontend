import { isInputElement, isSpecialCombination } from "@/utils/inputEventUtils";
import { createContext, useContext, useEffect, useState } from "react";

const EDITING_MODE_STORAGE_KEY = "editing-mode";

interface ViewModeContextValue {
  isEditMode: boolean;
  setEditingMode: (value: boolean) => void;
  switchEditingMode: () => void;
}

export const ViewModeContext =
  createContext<ViewModeContextValue | null>(null);

export function EditModeProvider({ children }: { children: React.ReactNode; }) {
  const [editingMode, setEditingModeState] = useState(
    () => localStorage.getItem(EDITING_MODE_STORAGE_KEY) === "true"
  );

  const setEditingMode = (value: boolean) => {
    setEditingModeState(value);
    localStorage.setItem(EDITING_MODE_STORAGE_KEY, String(value));
  };

  const switchEditingMode = () => {
    setEditingModeState((current) => {
      const next = !current;

      localStorage.setItem(
        EDITING_MODE_STORAGE_KEY,
        String(next)
      );

      return next;
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    if (isInputElement(target) || isSpecialCombination(event)) {
        return;
    }

    switch (event.code) {
        case "KeyE":
            switchEditingMode();
            break;

        default:
            return;
    }  
  };



  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === EDITING_MODE_STORAGE_KEY) {
        setEditingModeState(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <ViewModeContext
      value={{
        isEditMode: editingMode,
        setEditingMode,
        switchEditingMode: switchEditingMode,
      }}
    >
      {children}
    </ViewModeContext>
  );
}


export function useViewMode() {
  const context = useContext(ViewModeContext);

  if (!context) {
    throw new Error(
      "useViewMode must be used inside ViewModeProvider"
    );
  }

  return context;
}

