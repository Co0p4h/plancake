<script lang="ts">
	import type { ScheduleImage } from "$lib/server/db/schema";
	import { validateImageUrl, validateArtistUrl } from "$lib/utils/cs-validate";
  import { onDestroy } from "svelte";

  let { image = $bindable() }: { image: ScheduleImage } = $props();

  let error: string = $state("");
  let debounceTimeout: ReturnType<typeof setTimeout>;

  function onInput() {
    error = "";
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (image.url)
        error += `${validateImageUrl(image.url)}`;
      if (image.artist_url)
        error += validateArtistUrl(image.artist_url);
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
          oninput={onInput}
        />
      </div>
      
      {#if error}
        <div class="text-red-500 text-sm mt-2 whitespace-pre-wrap">{error}</div>
      {/if}
    </div>
  </div>
</div>