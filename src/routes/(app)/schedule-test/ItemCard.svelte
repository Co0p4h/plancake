<script lang="ts">
	import type { ScheduleItem } from "$lib/server/db/schema";
	import { Clock, Link, Pencil, Trash2 } from "@lucide/svelte";
  import dayjs from "dayjs";
	import { deleteModal, editModal } from "./modal.svelte";
  let { item }: { item: ScheduleItem } = $props();
  const bgColor = null;
</script>

<div class={`p-3 rounded-md mb-2 ${bgColor ? `bg-${bgColor}-50 border-${bgColor}-200` : 'border border-gray-100 bg-white'}`}>
  <h3 class="font-medium text-sm mb-2">{item.title}</h3>
  {#if item.description}
    <p class="text-xs text-gray-600 mb-2">{item.description}</p>
  {/if}
  <div class="flex items-center mb-2 gap-x-1">
    <Clock class="h-3 w-3 mr-1" />
    <span class="text-xs text-gray-500">{dayjs(item.startTime).format("HH:mm")}</span>
    {#if item.endTime}
      <span class="text-xs text-gray-500">-</span>
      <span class="text-xs text-gray-500">{dayjs(item.endTime).format("HH:mm")}</span>
    {/if}
  </div>
  {#if item.externalUrl}
    <a href={item.externalUrl} class="text-xs text-gray-500 flex">
      <Link class="h-3 w-3 mr-1"/>
      <p>external url</p>
    </a>
  {/if}
  <button
    aria-label="edit-button"
    type="button"
    class="rounded px-2 py-1 text-sm cursor-pointer"
    onclick={() => {
      editModal.show = true;
      editModal.item = item;
    }}
  >
    <Pencil size={18} />
  </button>
  <button
    type="button"
    class="rounded px-2 py-1 text-sm cursor-pointer"
    onclick={() => {
      deleteModal.show = true;
      deleteModal.item = item;
    }}
  >
    <Trash2 size={18} color={'#ff4646'} />
  </button>

</div>