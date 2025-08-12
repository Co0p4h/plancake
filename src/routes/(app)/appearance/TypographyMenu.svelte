<script lang="ts">
	import type { TypographyTheme } from "$lib/server/db/schema";

  let { typography = $bindable() }: {typography: TypographyTheme} = $props();

  const textElements = Object.keys(typography).filter(key => key !== "base_font") as Array<keyof Omit<TypographyTheme, 'base_font'>>;
  
  let selectedElement: keyof Omit<TypographyTheme, 'base_font'> = $state(textElements[0] || "header_title");
  
  function getDisplayName(key: string): string {
    return key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
</script>

<div class="space-y-6">
  <!-- base font section -->
  <div class="border border-gray-300 rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4">Base Font</h3>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Font Family
        <select bind:value={typography.base_font} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
      </label>
    </div>
  </div>

  <!-- selected text element controls -->
  {#if selectedElement && typography[selectedElement]}
    {@const value = typography[selectedElement]}
    <div class="border border-gray-300 rounded-lg p-4">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <select 
            bind:value={selectedElement} 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold text-purple-600"
          >
            {#each textElements as element}
              <option value={element}>{getDisplayName(element)}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- font -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Font
            <select bind:value={value.font} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </label>
        </div>
        
        <!-- size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Size
            <select bind:value={value.size} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="xs">Extra Small (12px)</option>
              <option value="sm">Small (14px)</option>
              <option value="base">Base (16px)</option>
              <option value="lg">Large (18px)</option>
              <option value="xl">Extra Large (20px)</option>
              <option value="2xl">2X Large (24px)</option>
              <option value="3xl">3X Large (30px)</option>
              <option value="4xl">4X Large (36px)</option>
              <option value="5xl">5X Large (48px)</option>
            </select>
          </label>
        </div>
        
        <!-- weight -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Weight
            <select bind:value={value.weight} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="100">Thin (100)</option>
              <option value="200">Extra Light (200)</option>
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </label>
        </div>
        
        <!-- style -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Style
            <select bind:value={value.style} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </label>
        </div>
        
        <!-- capitalisation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Capitalisation
            <select bind:value={value.capitalisation} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
            </select>
          </label>
        </div>
        
        <!-- decoration -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Decoration
            <select bind:value={value.decoration} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="line-through">Line Through</option>
            </select>
          </label>
        </div>
        
        <!-- letter spacing -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Letter Spacing
            <input 
              type="text" 
              bind:value={value.letter_spacing} 
              placeholder="e.g. 0.5px, 1px"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>
        </div>
      </div>
    </div>
  {/if}
</div>
