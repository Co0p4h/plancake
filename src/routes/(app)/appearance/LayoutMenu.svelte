<script lang="ts">
	import type { LayoutTheme } from "$lib/server/db/schema";
  import { m } from '$lib/paraglide/messages.js';

  let { layout = $bindable() }:{ layout: LayoutTheme } = $props()
</script>

<!-- {#each Object.entries(layout) as [key, value]}
  <p>{key}: {value}</p>
{/each} -->

<h2 class="text-lg">item gap</h2>
<input type="number" id="gap" name="gap" bind:value={layout.gap} min="0" max="8" 
       class="w-20 p-2 border border-gray-300 rounded-lg mb-4"/>
<input type="range" bind:value={layout.gap} min="0" max="8" />

<button class="flex mx-auto w-max gap-x-2 px-10 py-5 bg-gray-300 border-3 cursor-pointer" 
        style:border-color={layout.image_position == 'right' && layout.items == 'list' ? '#8c00ff' : ''}
        type="button"
        onclick={() => {
          layout.image_position = 'right';
          layout.items = 'list';
        }}>
  <div class="space-y-[3px]">
    {#each [1, 2, 3, 4, 5, 6, 7] as item}
      <div class="h-2.5 w-17 bg-black"></div>
    {/each}
  </div>
  
  <div class="w-17 bg-white"></div>
</button>

<br>

<button class="flex mx-auto w-max gap-x-2 px-10 py-5 bg-gray-300 border-3 cursor-pointer" 
        style:border-color={layout.image_position == 'left' && layout.items == 'list' ? '#8c00ff' : ''}
        type="button"
        onclick={() => {
          layout.image_position = 'left'
          layout.items = 'list';
        }}>
  <div class="w-17 bg-white"></div>

  <div class="space-y-[3px]">
    {#each [1, 2, 3, 4, 5, 6, 7] as item}
      <div class="h-2.5 w-17 bg-black"></div>
    {/each}
  </div>
</button>

<br>

<button class="flex mx-auto w-max gap-x-2 px-8.25 py-5 bg-gray-300 border-3 items-center cursor-pointer" 
        style:border-color={layout.image_position == 'right' && layout.items == 'grid' ? '#8c00ff' : ''}
        type="button"
        onclick={() => {
          layout.image_position = 'right';
          layout.items = 'grid'
        }}>
  <div class="grid grid-cols-3 gap-[5px]">
    {#each [...Array(6)] as _}
      <div class="bg-black h-9 w-6"></div>
    {/each}
  </div>

  <div class="w-17 h-[88px] bg-white"></div>
</button>

<br>

<button class="flex mx-auto w-max gap-x-2 px-8.25 py-5 bg-gray-300 border-3 items-center"
        style:border-color={layout.image_position == 'left' && layout.items == 'grid' ? '#8c00ff' : ''}
        type="button"
        onclick={() => {
          layout.image_position = 'left';
          layout.items = 'grid'
        }}>
  <div class="w-17 h-[88px] bg-white"></div>

  <div class="grid grid-cols-3 gap-[5px]">
    {#each [...Array(6)] as _}
      <div class="bg-black h-9 w-6"></div>
    {/each}
  </div>
</button>