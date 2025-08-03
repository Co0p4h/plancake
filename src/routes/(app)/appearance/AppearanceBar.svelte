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

  let { activeAppearance = $bindable() }: { activeAppearance: ThemeCategories } = $props();

  const enhance_form: SubmitFunction = ({ formData, action }) => {
    return async ({ result }) => {
      console.log('result', result);
      if (result.status == 200 && 'data' in result && result.data) {
        theme.commitChanges(result.data.updated_theme);
      } else if (result.status != 200 && 'data' in result && result.data) { // TODO: this is gross :)
        console.log('kys:', result.data.error);
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
          disabled={!theme.isModified()}
          onclick={() => {theme.resetTheme()}}
        >
          {m.reset()}
        </button>
      </div>
      {#if activeAppearance === "colours"}
      <div transition:slide>
        <ColourMenu colours={theme.clientTheme.colours} />
      </div>
      {:else if activeAppearance === "layout"}
      <div transition:slide>
        <LayoutMenu layout={theme.clientTheme.layout} />
      </div>
      {:else if activeAppearance === "typography"}
      <div transition:slide>
        <TypographyMenu typography={theme.clientTheme.typography} />
      </div>
      {:else if activeAppearance === "item"}
      <div transition:slide>
        <ItemMenu item_theme={theme.clientTheme.item_theme} />
      </div>
      {:else if activeAppearance === "background"}
      <div transition:slide>
        <BackgroundMenu background={theme.clientTheme.background} /> 
      </div>
      {:else if activeAppearance === "image"}
      <div transition:slide>
        <ImageMenu image={theme.clientTheme.image}/>
      </div>
      {/if}
    </div>
    <div class="flex text-center">
      <button
        type="submit"
        class="cursor-pointer rounded-md bg-purple-400 p-2 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out not-disabled:hover:bg-purple-500 mx-2 w-full"
        disabled={!theme.isModified()}
        onclick={() => {
          // console.log('theme', theme.clientTheme);
        }}
      >
        publish changes
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