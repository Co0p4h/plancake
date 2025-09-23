import { browser } from "$app/environment";
import type { AllScheduleSettings } from "$lib/server/db/schema";

type SettingsStore = ReturnType<typeof createSettingsStore>;
export let settingsStore: SettingsStore;

// what is this...
function deepUpdateSettings<AllScheduleSettings extends Record<string, unknown>>(
  target: AllScheduleSettings, 
  source: Partial<AllScheduleSettings>
): void {
  for (const key in source) {
    const sourceValue = source[key];
    
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      target[key] = target[key] || ({} as AllScheduleSettings[typeof key]);
      deepUpdateSettings(target[key] as Record<string, unknown>, sourceValue as Record<string, unknown>);
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue as AllScheduleSettings[typeof key];
    }
  }
}

function createSettingsStore(initialSettings: AllScheduleSettings) {
  console.log("wah..", initialSettings, typeof initialSettings);
  const snapshot = JSON.parse(JSON.stringify(initialSettings)) as AllScheduleSettings;

  const store = $state({
    originalSettings: structuredClone(snapshot),
    clientSettings: structuredClone(snapshot),
    isLoading: false,

    /**
     * a computed property that returns true if the user has made changes.
     */
    isModified() {
      return (JSON.stringify(this.clientSettings) !== JSON.stringify(this.originalSettings))
    },

    /**
     * resets any user modifications back to the original saved state.
     */
    resetSettings() {
      deepUpdateSettings(this.clientSettings, this.originalSettings);
    },

    /**
     * call this when the server successfully saves the data.
     * the current state is now the "original" state.
     */
    commitChanges(updatedSettings: AllScheduleSettings) {
      deepUpdateSettings(this.originalSettings, updatedSettings);
    },

  });

  console.log("store: ", store);

  return store;
}

export function initSettingsStore(initialSettings: AllScheduleSettings) {
  // The 'browser' check prevents re-initialisation during development hot-reloading (HMR)
  if (browser && settingsStore) {
    return;
  }

  console.log("initialSettings: ", initialSettings)

  settingsStore = createSettingsStore(initialSettings);
}
