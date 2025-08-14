<script lang="ts">
	import type { ScheduleItem, ScheduleTheme, ScheduleSettings } from "$lib/server/db/schema";
	import dayjs from "dayjs";
	import StyledText from "../../StyledText.svelte";

  let { item, theme, settings }:{ item: ScheduleItem, theme: ScheduleTheme, settings: ScheduleSettings} = $props();

  if (item.id.startsWith('empty-')) {
    $effect(() => {
      console.log(item);
    });
  }
</script>

<div class="flex w-full h-full overflow-hidden"
     style:border-radius={`${theme.item_theme.border_radius}px`}
     style:border={`1px ${theme.colours.primary} ${theme.item_theme.border_style}`}
     style:box-shadow={dayjs(item.startTime).isSame(dayjs(), 'day') 
       ? `0 0 8px ${theme.colours.primary}75` 
       : 'none'}>
  <div class='flex flex-col items-center justify-center min-w-16 min-h-16 text-white'
       style:background-color={theme.colours.primary}
       style:color={theme.colours.secondary}>
    <StyledText 
      theme={theme}
      typography={theme.typography.item_date}
      colour={theme.colours.secondary}
      tag="span"
      class="text-2xl font-bold"
    >
      {dayjs(item.startTime).format("DD")}
    </StyledText>
    <span class="text-xs uppercase">{dayjs(item.startTime).format("ddd.")}</span>
  </div>
  <div class='flex-1 flex flex-col px-4 gap-y-1 justify-center min-w-[250px]'
       style:background-color={theme.colours.secondary}
       style:color={theme.colours.text}
  >
    <div class="flex items-center gap-1">
      {#if !item.id.startsWith('empty-')}
        <StyledText 
        theme={theme}
        typography={theme.typography.item_title}
        colour={theme.colours.text}
        tag="span"
        >
          {dayjs(item.startTime).format('HH:mm')}
        </StyledText>
        {#if item.endTime}
          <span class="font-medium">-</span>
          <StyledText 
          theme={theme}
          typography={theme.typography.item_title}
          colour={theme.colours.text}
          tag="span"
          >
            {dayjs(item.endTime).format('HH:mm')}
          </StyledText>
        {/if}
      {/if}
      <StyledText 
        theme={theme}
        typography={item.id.startsWith('empty-') ? theme.typography.empty_day : theme.typography.item_title}
        colour={theme.colours.text}
        tag="span"
        class="pl-2"
      >
        {#if item.id.startsWith('empty-')}
          {settings.empty_day_text || 'nothing scheduled'}  
        {:else}
          {item.title}
        {/if}
      </StyledText>
    </div>
    {#if item.description}
      <StyledText 
        theme={theme}
        typography={theme.typography.item_description}
        colour={theme.colours.accent}
        tag="p"
      >
        {#if !item.id.startsWith('empty-')}
          {item.description}
        {/if}
      </StyledText>
    {/if}
  </div>
</div>