<script lang="ts">
	import type { ColourTheme } from "$lib/server/db/schema";
  import { m } from '$lib/paraglide/messages.js';
	import ColorPicker from "./ColorPicker.svelte";

  let { colours }:{ colours: ColourTheme } = $props()
</script>

<div class="flex flex-col gap-5">
    {#each Object.entries(colours) as [colour, value]}
      <ColorPicker colour={colour as keyof ColourTheme} bind:colours/>
    {/each}
</div>

<style>

</style>