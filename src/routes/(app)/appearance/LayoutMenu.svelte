<script lang="ts">
	import type { LayoutTheme } from "$lib/server/db/schema";
  import { m } from '$lib/paraglide/messages.js';

  let { layout = $bindable() }:{ layout: LayoutTheme } = $props()
</script>

<div class="border border-gray-300 rounded-lg p-4 mb-6">
  <h3 class="text-lg font-semibold mb-4">Item Gap</h3>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Item Gap: {layout.gap}px
      <input 
      type="range" 
      bind:value={layout.gap} 
      min="0" 
      max="12" 
      step="1"
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </label>
  </div>
</div>

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