<script lang="ts">
	import type { ScheduleItem, ScheduleTheme } from "$lib/server/db/schema";
	import dayjs from "dayjs";
	import StyledText from "../../StyledText.svelte";

  let { item, theme }:{ item: ScheduleItem, theme: ScheduleTheme} = $props();
</script>

<div class="w-full h-full overflow-hidden"
     style:border-radius={theme.item_theme.border_radius}
     style:border={`1px ${theme.colours.primary} ${theme.item_theme.border_style}`}>
  <div class='flex items-center justify-center py-2 text-white gap-1'
       style:background-color={theme.colours.primary}
       style:color={theme.colours.secondary}>
    <StyledText 
      theme={theme}
      typography={theme.typography.item_date}
      colour={theme.colours.secondary}
      tag="span"
    >
      {dayjs(item.startTime).format("DD")}
    </StyledText>
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
      <StyledText 
        theme={theme}
        typography={theme.typography.item_title}
        colour={theme.colours.secondary}
        tag="span"
      >
        {dayjs(item.startTime).format('HH:mm')}
      </StyledText>
      {#if item.endTime}
        <StyledText 
          theme={theme}
          typography={theme.typography.item_title}
          colour={theme.colours.secondary}
          tag="span"
        >
          - {dayjs(item.endTime).format('HH:mm')}
        </StyledText>
      {/if}
    </div>
    <StyledText 
      theme={theme}
      typography={theme.typography.item_title}
      colour={theme.colours.text}
      tag="span"
      class="px-2 text-center"
    >
      {item.title}
    </StyledText>
    {#if item.description}
      <StyledText 
        theme={theme}
        typography={theme.typography.item_description}
        colour={theme.colours.accent}
        tag="p"
        class="px-2 text-center"
      >
        {item.description}
      </StyledText>
    {/if}
  </div>
</div>