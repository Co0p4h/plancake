<script lang="ts">
	import type { ScheduleItem } from "$lib/server/db/schema";
	import { Clock, Link, Pencil, Trash2 } from "@lucide/svelte";
  import dayjs from "dayjs";
	import { deleteModal, editModal } from "./modal.svelte";
  let { item }: { item: ScheduleItem } = $props();
  const bgColor = "";
</script>

<div class={`group p-[10px] relative rounded-md mb-2 ${bgColor ? `bg-${bgColor}-50 border-${bgColor}-200` : 'border border-gray-200 bg-white'}`}>
  <div>
    <h3 class="font-medium text-md text-gray-800">{item.title}</h3>
    {#if item.description}
      <p class="text-sm text-gray-500 mt-1">{item.description}</p>
    {/if}
  </div>

  <div class="flex items-center text-xs text-black mt-3">
    <Clock class="h-3 w-3 mr-1" />
    <span>{dayjs(item.startTime).format("HH:mm")}</span>
    {#if item.endTime}
      <span class="mx-1">-</span>
      <span>{dayjs(item.endTime).format("HH:mm")}</span>
    {/if}
  </div>

  {#if item.externalUrl}
    <a href={item.externalUrl} class="text-xs text-gray-500 flex mt-1">
      <Link class="h-3 w-3 mr-1"/>
      <p>external link</p>
    </a>
  {/if}

  <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2">
    <button
      aria-label="Edit"
      class="p-1 rounded hover:bg-gray-100 transition cursor-pointer"
      onclick={() => {
        editModal.show = true;
        editModal.item = item;
      }}
    >
      <Pencil size={16} class="text-gray-600" />
    </button>
    <button
      aria-label="Delete"
      class="p-1 rounded hover:bg-red-50 transition cursor-pointer"
      onclick={() => {
        deleteModal.show = true;
        deleteModal.item = item;
      }}
    >
      <Trash2 size={16} class="text-red-500" />
    </button>
  </div>
</div>