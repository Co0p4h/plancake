<script lang="ts">
	import type { ScheduleItem, ScheduleTheme } from "$lib/server/db/schema";
	import { fontSize } from "$lib/utils/font";
	import dayjs from "dayjs";

  let { item, theme }:{ item: ScheduleItem, theme: ScheduleTheme} = $props();
</script>

<div class="flex w-full h-full overflow-hidden"
     style:border-radius={`${theme.item_theme.border_radius}px`}
     style:border={`1px ${theme.colours.primary} ${theme.item_theme.border_style}`}>
  <div class='flex flex-col items-center justify-center min-w-16 min-h-16 text-white'
       style:background-color={theme.colours.primary}
       style:color={theme.colours.secondary}>
    <span class="text-2xl font-bold"
          style:font-family={theme.typography.item_date.font}
          style:font-size={fontSize(theme.typography.item_date.size)}
    >{dayjs(item.startTime).format("DD")}</span>
    <span class="text-xs uppercase">{dayjs(item.startTime).format("ddd.")}</span>
  </div>
  <div class='flex-1 flex flex-col px-4 gap-y-1 justify-center min-w-[250px]'
       style:background-color={theme.colours.secondary}
       style:color={theme.colours.text}
  >
    <!-- TODO: make a custom compoenent that auto puts these styles in? -->
    <div class="flex items-center gap-1"
         style:font-family={theme.typography.item_title.font}
         style:font-size={fontSize(theme.typography.item_title.size)}
         style:font-weight={theme.typography.item_title.weight}
         style:color={theme.colours.text}>
      <span class="font-medium">{dayjs(item.startTime).format('HH:mm')}</span>
      {#if item.endTime}
        <span class="font-medium">-</span>
        <span class="font-medium">{dayjs(item.endTime).format('HH:mm')}</span>
      {/if}
      <span class="font-medium pl-2">{item.title}</span>
    </div>
    {#if item.description}
      <p class="font-small"
      style:color={theme.colours.accent} 
      style:font-family={theme.typography.item_description.font}
      style:font-size={fontSize(theme.typography.item_description.size)}>
        {item.description}
      </p>
    {/if}
  </div>
</div>