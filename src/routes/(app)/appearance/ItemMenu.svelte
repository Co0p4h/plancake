<script lang="ts">
	import type { ItemTheme } from "$lib/server/db/schema";

  let { item_theme = $bindable() }: { item_theme: ItemTheme } = $props();
</script>

<div class="space-y-6">
  <!-- border style section -->
  <!-- <div class="border border-gray-300 rounded-lg p-4"> -->
  <div>
    <h3 class="text-lg font-semibold mb-4">Border Style</h3>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        <select bind:value={item_theme.border_style} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="none">No Border</option>
          <option value="solid">Solid Border</option>
        </select>
      </label>
    </div>
  </div>

  <!-- border radius section -->
  <!-- <div class="border border-gray-300 rounded-lg p-4"> -->
  <div>
    <h3 class="text-lg font-semibold">Border Radius</h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          <!-- Border Radius:  -->
          {item_theme.border_radius}px
          <input 
          type="range" 
          bind:value={item_theme.border_radius} 
          min="0" 
          max="20" 
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </label>
      </div>

    </div>
  </div>

  <!-- shadow style section -->
  <!-- <div class="border border-gray-300 rounded-lg p-4"> -->
  <div>
    <h3 class="text-lg font-semibold mb-4">Shadow Style</h3>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        <select bind:value={item_theme.shadow_style} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="none">No Shadow</option>
          <option value="soft">Soft Shadow</option>
          <option value="hard">Hard Shadow</option>
        </select>
      </label>
    </div>
  </div>
</div>