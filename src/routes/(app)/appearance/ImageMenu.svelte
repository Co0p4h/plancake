<script lang="ts">
  import { onDestroy } from "svelte";

  let { image } = $props();

  let error: string = $state("");
  let debounceTimeout: ReturnType<typeof setTimeout>;

  // TODO: add image url validation
  const validateUrl = (url: string) => {
    if (!url) return "please enter an image url";
    try {
      new URL(url);
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

<div class="flex flex-col border border-gray-300 rounded-lg p-4">
  <textarea
    class="min-h-25"
    bind:value={image.url}
    oninput={onInput}
  ></textarea>
  {#if error}
    <div class="text-red-500 mt-2">{error}</div>
  {/if}
</div>