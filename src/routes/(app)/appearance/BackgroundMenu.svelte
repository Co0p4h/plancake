<script lang="ts">
  let { background = $bindable() } = $props();
</script>



<div class="">
  <!-- <div class="border border-gray-300 rounded-lg p-4"> -->
  <h3 class="text-lg font-semibold">Background Type</h3>
    <!-- <label class="block text-sm font-medium text-gray-700">Background Type -->
      <select bind:value={background} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-2">
        <option value="solid">solid</option>
        <option value="gradient">gradient</option>
      </select>
    <!-- </label> -->
  <!-- </div> -->
</div>
