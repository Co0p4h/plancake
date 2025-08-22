<script lang="ts">
	import type { ScheduleItem, ScheduleTheme, ScheduleSettings } from "$lib/server/db/schema";
	import dayjs from "dayjs";
	import StyledText from "../../StyledText.svelte";
	import { createGoogleCalendarLink } from "$lib/utils/calendar";
	import { CalendarPlus, ExternalLink } from "@lucide/svelte";

  let { item, theme, settings }:{ item: ScheduleItem, theme: ScheduleTheme, settings: ScheduleSettings} = $props();

  if (item.id.startsWith('empty-')) {
    $effect(() => {
      console.log(item);
    });
  }
</script>

<div class="flex w-full h-full relative z-0 group"
     style:border-radius={`${theme.item_theme.border_radius}px`}
     style:border={`1px ${theme.colours.primary} ${theme.item_theme.border_style}`}
     style:box-shadow={
       dayjs(item.startTime).isSame(dayjs(), 'day') 
         ? `0 0 8px ${theme.colours.primary}75` 
         : theme.item_theme.shadow_style === 'soft' 
           ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
           : 'none'
     }>
  
  {#if theme.item_theme.shadow_style === 'hard'}
    <div 
      class="absolute w-full h-full -z-1"
      style:border-radius={`${theme.item_theme.border_radius}px`}
      style:background-color={theme.colours.primary}
      style:left="4px"
      style:top="4px"
      style:z-index="-1"
    ></div>
  {/if}

  <!-- date header -->
  <div class='flex flex-col items-center justify-center min-w-16 min-h-16 text-white'
       style:background-color={theme.colours.primary}
       style:color={theme.colours.secondary}
       style:border-top-left-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
       style:border-bottom-left-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}>
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

  <!-- content body -->
  <div class='flex-1 flex flex-col px-4 gap-y-1 justify-center min-w-[250px]'
       style:background-color={theme.colours.secondary}
       style:color={theme.colours.text}
       style:border-top-right-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
       style:border-bottom-right-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
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

  <!-- action buttons -->
  {#if item.externalUrl}
  <a href={item.externalUrl} target="_blank" class="flex items-center justify-center w-16 h-16 hover:opacity-80 transition-opacity duration-300 absolute right-0 top-0">
    <ExternalLink class="w-5 h-5" style="color: {theme.colours.text}" />
  </a>
  {/if}
  {#if !item.id.startsWith('empty-')}
    <a href={createGoogleCalendarLink(item)} target="_blank" class="flex items-center justify-center w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:opacity-80 absolute {item.externalUrl ? 'right-12' : 'right-0'} top-0" title="Add to Google Calendar">
      <CalendarPlus class="w-5 h-5" style="color: {theme.colours.text}" />
    </a>
  {/if}
</div>