<script lang="ts">
	import type { TypographyTheme } from "$lib/server/db/schema";

  let { typography }: {typography: TypographyTheme} = $props();
</script>

{#each Object.entries(typography) as [key, value]}
  {#if key !== "base_font"}
    {#each Object.entries(value) as [x, y]}
      <p>{x}: {y}</p>
    {/each}
  {:else}
    <p>{key}: {value}</p>
  {/if}
  <br>
{/each}

