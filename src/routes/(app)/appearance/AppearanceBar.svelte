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

  let { activeAppearance = $bindable() }: {activeAppearance: ThemeCategories } = $props();

</script>

<div class="w-80 p-4 bg-white border border-gray-300 rounded-lg">
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-xl text-gray-500">{m[`_appearance.${activeAppearance}`]()}</h1>
    <button class="px-2 py-1 rounded-lg border border-gray-300 text-gray-800 bg-white cursor-pointer hover:bg-gray-100 disabled:opacity-50  disabled:cursor-not-allowed transition"
      disabled={!theme.isModified()}
      onclick={() => {theme.resetTheme(activeAppearance)}}
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