<script lang="ts">
	import type { TypographyTheme } from "$lib/server/db/schema";

  let { typography }: {typography: TypographyTheme} = $props();
</script>

{#each Object.entries(typography) as [key, value]}
  <p>{key}: {value}</p>
{/each}

