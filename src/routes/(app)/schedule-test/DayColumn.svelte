<script lang="ts">
	import type { ScheduleItem } from "$lib/server/db/schema";
	import { Plus, Trash2 } from "@lucide/svelte";
  import { m } from "$lib/paraglide/messages.js";
	import { addModal } from "./modal.svelte";
  import dayjs from "dayjs";
  import isoWeek from "dayjs/plugin/isoWeek";
	import ItemCard from "./ItemCard.svelte";
	// import { fade } from "svelte/transition";

  dayjs.extend(isoWeek);

  let { day, isToday, items }: {day: dayjs.Dayjs, isToday: boolean, items: Promise<ScheduleItem[]> } = $props();

</script>

<div class="flex-1 min-w-[140px] rounded-lg">
  <div class={`p-2 rounded-t-md border ${isToday ? 'bg-black border-black text-white': 'border-gray-300'}`}>
    <h3 class="text-sm font-medium">
      {dayjs(day).format("ddd. D")}
    </h3>
  </div>
  <div class={`p-2 min-h-[600px] border-l border-r border-b rounded-b-md relative ${isToday ? 'border-black': 'border-gray-300'}`}>
    {#await items}
      <div class="space-y-2">
        <div class="h-16 bg-gray-100 rounded-md animate-pulse"></div>
        <div class="h-12 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    {:then items}
      {#each items as item, i (item.id)}
        <!-- <div in:fade={{ delay: i * 100, duration: 300 }}> -->
          <ItemCard {item} />
        <!-- </div> -->
      {/each}
    {:catch error}
      failed to laod items
    {/await}
      <button class="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm hover:text-gray-600 cursor-pointer"
        onclick={() => {
          addModal.show = true;
          addModal.initialDate = day;
        }}>
        <span class="flex items-center justify-center">
          <Plus class="h-3 w-3 mr-1" />{m["_schedule.add_event"]()}
        </span>
      </button>
  </div>
</div>