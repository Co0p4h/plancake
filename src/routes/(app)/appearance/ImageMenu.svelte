<script lang="ts">
	// import type { ScheduleImage } from "$lib/server/db/schema";
  import { onDestroy } from "svelte";

  let { image = $bindable() } = $props();

  console.log(image);
  

  let error: string = $state("");
  let debounceTimeout: ReturnType<typeof setTimeout>;

  const validateUrl = (url: string) => {
    if (!url) return "please enter an image url";
    try {
      const urlObj = new URL(url);
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const pathname = urlObj.pathname.toLowerCase();
      const hasValidExtension = validImageExtensions.some(ext => pathname.endsWith(ext));
      
      if (!hasValidExtension) {
        return "please enter a valid image url";
      }
      
      return "";
    } catch (e) {
      return "please enter a valid url";
    }
  };

  function onInput() {
    error = "";
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      error = validateUrl(image.url);
    }, 500); 
  }

  onDestroy(() => {
    clearTimeout(debounceTimeout);
  });
</script>

<div class="space-y-6">
  <div class="border border-gray-300 rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4">Image Settings</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="image_url">Image URL</label>
        <textarea
          name="image_url"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32 resize-none"
          bind:value={image.url}
          oninput={onInput}
        ></textarea>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="artist_name">Artist Attribution</label>
        <input 
          type="text" 
          name="artist_name" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          bind:value={image.artist_name}
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="artist_url">Artist URL</label>
        <input 
          type="text" 
          name="artist_url" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          bind:value={image.artist_url}
        />
      </div>
      
      {#if error}
        <div class="text-red-500 text-sm mt-2">{error}</div>
      {/if}
    </div>
  </div>
</div>