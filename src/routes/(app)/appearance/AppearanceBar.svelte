<script lang="ts">
  import type { ScheduleTheme, ThemeCategories } from '$lib/server/db/schema';
  import { m } from '$lib/paraglide/messages.js';
	import ColourMenu from './ColourMenu.svelte';
	import LayoutMenu from './LayoutMenu.svelte';
	import TypographyMenu from './TypographyMenu.svelte';
	import ItemMenu from './ItemMenu.svelte';
	import BackgroundMenu from './BackgroundMenu.svelte';
	import ImageMenu from './ImageMenu.svelte';
  
  import { themeStore as theme } from './appearance.svelte';

  import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import toast, { Toaster } from 'svelte-french-toast';

  let { activeAppearance = $bindable() }: { activeAppearance: ThemeCategories } = $props();
  
  let isSubmitting = $state(false);

  const enhance_form: SubmitFunction = ({ formData, action }) => {

    isSubmitting = true;
    // const loadingToast = toast.loading('Saving changes...', {
    //   duration: Infinity, // Keep it until we dismiss it
    // });

    return async ({ result }) => {
      // toast.dismiss(loadingToast);
      isSubmitting = false;

      if (result.type == "success" && result.data) {
        const updated_theme = await result.data.updated_theme;
        if (updated_theme) {
          theme.commitChanges(updated_theme);
          toast.success('theme updated successfully!');
        }
      } else if (result.type == "failure" && result.data) { 
        const error_message = result.data.error || 'an unexpected error occurred';
        toast.error(error_message);
      }
    }
  }

</script>

{#if theme}
  <form method="POST" action="?/updateTheme" use:enhance={enhance_form} class="space-y-2">

    <input type="hidden" name="theme" value={JSON.stringify(theme.clientTheme)} />

    <div class="bg-white border border-gray-300 rounded-lg p-4 w-80 flex-col">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl text-gray-500">{m[`_appearance.${activeAppearance}`]()}</h1>
        <button class="px-2 py-1 rounded-lg border border-gray-300 text-gray-800 bg-white cursor-pointer hover:bg-gray-100 disabled:opacity-50  disabled:cursor-not-allowed transition"
          type="button"
          disabled={!theme.isModified() || isSubmitting}
          onclick={() => {theme.resetTheme()}}
        >
          {m.reset()}
        </button>
      </div>
      {#if activeAppearance === "colours"}
      <div transition:slide>
        <ColourMenu bind:colours={theme.clientTheme.colours} />
      </div>
      {:else if activeAppearance === "layout"}
      <div transition:slide>
        <LayoutMenu bind:layout={theme.clientTheme.layout} />
      </div>
      {:else if activeAppearance === "typography"}
      <div transition:slide>
        <TypographyMenu bind:typography={theme.clientTheme.typography} />
      </div>
      {:else if activeAppearance === "item"}
      <div transition:slide>
        <ItemMenu bind:item_theme={theme.clientTheme.item_theme} />
      </div>
      {:else if activeAppearance === "background"}
      <div transition:slide>
        <BackgroundMenu bind:background={theme.clientTheme.background} /> 
      </div>
      {:else if activeAppearance === "image"}
      <div transition:slide>
        <ImageMenu bind:image={theme.clientTheme.image}/>
      </div>
      {/if}
    </div>
    <div class="flex text-center">
      <button
        type="submit"
        class="cursor-pointer rounded-md bg-purple-400 p-2 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out not-disabled:hover:bg-purple-500 mx-2 w-full flex items-center justify-center"
        disabled={!theme.isModified() || isSubmitting}
      >
        {#if isSubmitting}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          publishing...
        {:else}
          publish changes
        {/if}
      </button>
    </div>
  </form>
  {:else}
  <!-- loading state for the appearance nav -->
  <div class="bg-white border border-gray-300 rounded-lg p-4 w-80 flex-col">
    <div class="animate-pulse">
      <div class="h-6 bg-gray-200 rounded mb-4"></div>
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div class="h-10 bg-gray-200 rounded mt-4"></div>
    </div>
  </div>
{/if}

<Toaster position="bottom-center" />