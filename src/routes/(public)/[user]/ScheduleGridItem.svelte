<script lang="ts">
	import type { ScheduleItem, ScheduleTheme } from "$lib/server/db/schema";
	import { fontSize } from "$lib/utils/font";
	import dayjs from "dayjs";

  let { item, theme }:{ item: ScheduleItem, theme: ScheduleTheme} = $props();
</script>

<div class="w-full h-full overflow-hidden"
     style:border-radius={theme.item_theme.border_radius}
     style:border={`1px ${theme.colours.primary} ${theme.item_theme.border_style}`}>
  <div class='flex items-center justify-center py-2 text-white gap-1'
       style:background-color={theme.colours.primary}
       style:color={theme.colours.secondary}>
    <span class="text-2xl font-bold"
          style:font-family={theme.typography.item_date.font}
          style:font-size={fontSize(theme.typography.item_date.size)}
    >{dayjs(item.startTime).format("DD")}</span>
    <span class="text-xs uppercase">{dayjs(item.startTime).format("ddd.")}</span>
  </div>
  <div class='flex flex-col gap-y-1 items-center h-full pb-2'
       style:background-color={theme.colours.secondary}
       style:color={theme.colours.text}
  >
    <div class="flex justify-center gap-1 mt-1 px-2 py-1 rounded-lg"
         style:color={theme.colours.secondary}
         style:background-color={theme.colours.accent}
         >
      <span class="font-medium">{dayjs(item.startTime).format('HH:MM')}</span>
      {#if item.endTime}
        <span class="font-medium">-</span>
        <span class="font-medium">{dayjs(item.endTime).format('HH:MM')}</span>
      {/if}
    </div>
    <span class="font-medium px-2 text-center"
          style:font-size={fontSize(theme.typography.item_title.size)}
          style:font-family={theme.typography.item_title.font}>
      {item.title}
    </span>
    {#if item.description}
      <p class="font-small px-2 text-center"
      style:color={theme.colours.accent} 
      style:font-family={theme.typography.item_description.font}
      style:font-size={fontSize(theme.typography.item_description.size)}>
        {item.description}
      </p>
    {/if}
  </div>
</div>