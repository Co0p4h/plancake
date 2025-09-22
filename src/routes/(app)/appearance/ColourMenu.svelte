<script lang="ts">
	import type { ColourTheme } from "$lib/server/db/schema";
  import { m } from '$lib/paraglide/messages.js';
	import ColourPicker from "./ColourPicker.svelte";

  let { colours = $bindable() }:{ colours: ColourTheme } = $props()
</script>

<div class="flex flex-col gap-5">
  {#each Object.entries(colours) as [colour, value]}
    <ColourPicker colour={colour as keyof ColourTheme} bind:colours/>
  {/each}
</div>
