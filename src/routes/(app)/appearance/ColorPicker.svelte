<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
	import type { ColourTheme } from '$lib/server/db/schema';

  let { colour, colours = $bindable() }: { colour: keyof ColourTheme, colours: ColourTheme} = $props()

  const inputId = `color-picker-${colour}`;
</script>

<div class="flex justify-between items-center">
  <label for={inputId} class="text-xl">{m[`_appearance._colours.${colour}`]()}</label>
  <input type="color" class="block h-14 w-19" bind:value={colours[colour]} />
</div>

<style>
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }

  input::-webkit-color-swatch {
    border-radius: 8px;
    border: 1px solid #d1d5dc;
  }

  input::-moz-color-swatch {
    border-radius: 8px;
    border: 1px solid #d1d5dc;
  }
</style>
