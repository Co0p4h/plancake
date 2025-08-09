<script lang="ts">
	import type { ItemTheme } from "$lib/server/db/schema";

  let { item_theme = $bindable() }: { item_theme: ItemTheme } = $props();
</script>

{#each Object.entries(item_theme) as [key, value]}
  <p>{key}: {value}</p>
{/each}