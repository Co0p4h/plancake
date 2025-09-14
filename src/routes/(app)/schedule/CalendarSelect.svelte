<script lang="ts">
	import { Calendar } from "@lucide/svelte";

  let { dateInputValue = $bindable(), onchange }: { dateInputValue: string, onchange: () => (void) } = $props();
</script>

<button id="datepicker-toggle" class="">
  <Calendar />
  <div class="h-full w-full bg-blue-600">
    <input type="date" id="datepicker-input" bind:value={dateInputValue} {onchange}>
  </div> 
</button>

<style>
  #datepicker-input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-sizing: border-box;
  }

  #datepicker-input::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #datepicker-toggle {
    position: relative;
  }
</style>