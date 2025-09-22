<script lang="ts">
  let { background = $bindable() } = $props();
  import { m } from '$lib/paraglide/messages.js';
</script>

<div class="">
  <!-- <div class="border border-gray-300 rounded-lg p-4"> -->
  <h3 class="text-lg font-semibold">{m['_appearance._background.background_type']()}</h3>
    <!-- <label class="block text-sm font-medium text-gray-700">Background Type -->
      <select bind:value={background} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-2">
        <option value="solid">{m['_appearance._background.solid']()}</option>
        <option value="gradient">{m['_appearance._background.gradient']()}</option>
      </select>
    <!-- </label> -->
  <!-- </div> -->
</div>
