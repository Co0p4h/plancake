import { browser } from "$app/environment";
import type { ScheduleTheme } from "$lib/server/db/schema";

type ThemeStore = ReturnType<typeof createThemeStore>;
export let themeStore: ThemeStore;

// what is this...
function deepUpdateTheme<ScheduleTheme extends Record<string, unknown>>(
  target: ScheduleTheme, 
  source: Partial<ScheduleTheme>
): void {
  for (const key in source) {
    const sourceValue = source[key];
    
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      target[key] = target[key] || ({} as ScheduleTheme[typeof key]);
      deepUpdateTheme(target[key] as Record<string, unknown>, sourceValue as Record<string, unknown>);
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue as ScheduleTheme[typeof key];
    }
  }
}

function createThemeStore(initialTheme: ScheduleTheme) {
  const store = $state({
    originalTheme: structuredClone(initialTheme),
    clientTheme: structuredClone(initialTheme),
    isLoading: false,

    /**
     * A computed property that returns true if the user has made changes.
     */
    isModified() {
      return (JSON.stringify(this.clientTheme) !== JSON.stringify(this.originalTheme))
    },

    /**
     * Resets any user modifications back to the original saved state.
     */
    resetTheme() {
      deepUpdateTheme(this.clientTheme, this.originalTheme);
    },

    /**
     * Call this when the server successfully saves the data.
     * The current state is now the "original" state.
     */
    commitChanges(updated_theme: ScheduleTheme) {
      deepUpdateTheme(this.originalTheme, updated_theme);
    },

  });

  return store;
}

export function initThemeStore(initialTheme: ScheduleTheme) {
  // The 'browser' check prevents re-initialisation during development hot-reloading (HMR)
  if (browser && themeStore) {
    return;
  }

  // console.log('Initialising theme store with initial theme:', initialTheme);
  
  themeStore = createThemeStore(initialTheme);
}