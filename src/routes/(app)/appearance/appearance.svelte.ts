import { browser } from "$app/environment";
import type { ScheduleTheme, ThemeCategories } from "$lib/server/db/schema";

type ThemeStore = ReturnType<typeof createThemeStore>;
export let themeStore: ThemeStore;

function createThemeStore(initialTheme: ScheduleTheme) {
  const store = $state({
    originalTheme: structuredClone(initialTheme),
    clientTheme: structuredClone(initialTheme),
    isLoading: false,

    /**
     * A computed property that returns true if the user has made changes.
     */
    isModified() {
      // console.log("ORIGINAL:", JSON.stringify(this.originalTheme));
      // console.log("CLIENT:  ", JSON.stringify(this.clientTheme));
      return (JSON.stringify(this.clientTheme) !== JSON.stringify(this.originalTheme))
    },

    /**
     * Resets any user modifications back to the original saved state.
     */
    resetTheme(category) {
      Object.assign(this.clientTheme[category], this.originalTheme[category]);
    },

    /**
     * Saves the current theme to the server.
     */
    async saveTheme() {
      if (this.clientTheme === this.originalTheme) {
        console.log('No changes to save.');
        return;
      }

      this.isLoading = true;

      try {
        // --- Your actual API call would go here ---
        console.log('Saving theme to server:', this.clientTheme);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        // On success, the currently saved theme becomes the new "original"
        this.originalTheme = structuredClone(this.clientTheme);
        console.log('Theme saved successfully!');

      } catch (err) {
        console.error("Failed to save theme:", err);
        // Let the calling component know an error occurred
        throw err;
      } finally {
        // This ALWAYS runs, ensuring the loading state is turned off.
        this.isLoading = false;
      }
    }
  });

  return store;
}

export function initThemeStore(initialTheme: ScheduleTheme) {
  // The 'browser' check prevents re-initialization during development hot-reloading (HMR)
  if (browser && themeStore) {
    return;
  }

  console.log('Initializing theme store with initial theme:', initialTheme);
  
  themeStore = createThemeStore(initialTheme);
}