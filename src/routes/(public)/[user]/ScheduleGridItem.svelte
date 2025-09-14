<script lang="ts">
	import type { ScheduleItem, ScheduleSettings, ScheduleTheme } from "$lib/server/db/schema";
	import dayjs from "dayjs";
	import StyledText from "$lib/components/StyledText.svelte";
	import { createGoogleCalendarLink } from "$lib/utils/calendar";
	import { CalendarPlus, ExternalLink } from "@lucide/svelte";

  let { item, theme, settings }:{ item: ScheduleItem, theme: ScheduleTheme, settings: ScheduleSettings} = $props();
</script>

<div class="w-full h-full relative z-0 group flex flex-col"
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
  <div class='flex items-center justify-center py-2 px-2 text-white min-h-[3rem]'
       style:background-color={theme.colours.primary}
       style:color={theme.colours.secondary}
       style:border-top-left-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
       style:border-top-right-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
  >
    <div class="flex flex-col items-center">
      <StyledText 
        theme={theme}
        typography={theme.typography.day_numbers}
        colour={theme.colours.secondary}
        tag="span"
        class="leading-none"
      >
        {dayjs(item.startTime).format("DD")}
      </StyledText>
      <StyledText 
        theme={theme}
        typography={theme.typography.day_labels}
        colour={theme.colours.secondary}
        tag="span"
      >
        {dayjs(item.startTime).format("ddd.")}
      </StyledText>
    </div>
  </div>
  
  <!-- content body -->
  <div class="flex flex-col gap-y-2 p-3 flex-1 text-center py-2"
       class:justify-center={item.id.startsWith('empty-')}
       style:background-color={theme.colours.secondary}
       style:color={theme.colours.text}
       style:border-bottom-left-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
       style:border-bottom-right-radius={`${Math.max(0, theme.item_theme.border_radius - 1)}px`}
  >
    {#if !item.id.startsWith('empty-')}
      <div class="flex justify-center gap-1 px-2 py-1 whitespace-nowrap"
           style:color={theme.colours.secondary}
           style:background-color={theme.colours.accent}
           style:border-radius={`${theme.item_theme.border_radius}px`}>
        <StyledText 
          theme={theme}
          typography={theme.typography.item_time}
          colour={theme.colours.secondary}
          tag="span"
        >
          {dayjs(item.startTime).format(settings.use_24_hour_time ? 'HH:mm' : 'hh:mmA')}
          {#if item.endTime}
            <span class="time-range">
              {dayjs(item.endTime).format(settings.use_24_hour_time ? 'HH:mm' : 'hh:mmA')}
            </span>
          {/if}
        </StyledText>
      </div>
    {/if}
    
    <!-- title -->
    <StyledText 
      theme={theme}
      typography={item.id.startsWith('empty-') ? theme.typography.empty_text : theme.typography.item_title}
      colour={theme.colours.text}
      tag="span"
      class="px-2 text-center"
    >
      {#if item.id.startsWith('empty-')}
        {settings.empty_day_text || 'nothing scheduled'}  
      {:else}
        {item.title}
      {/if}
    </StyledText>
    
    <!-- description -->
    {#if item.description && !item.id.startsWith('empty-')}
      <StyledText 
        theme={theme}
        typography={theme.typography.item_description}
        colour={theme.colours.accent}
        tag="p"
        class="leading-tight whitespace-pre-wrap"
      >
        {item.description}
      </StyledText>
    {/if}
  </div>
  
  <!-- action buttons -->
  {#if item.externalUrl}
    <a href={item.externalUrl} 
       target="_blank" 
       class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:opacity-80"
       style:background-color={theme.colours.secondary}
       title="Open external link">
      <ExternalLink class="w-4 h-4" style="color: {theme.colours.text}" />
    </a>
  {/if}
  
  {#if !item.id.startsWith('empty-')}
    <a href={createGoogleCalendarLink(item)} 
       target="_blank" 
       class="absolute top-2 {item.externalUrl ? 'right-12' : 'right-2'} w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:opacity-80"
       style:background-color={theme.colours.secondary}
       title="Add to Google Calendar">
      <CalendarPlus class="w-4 h-4" style="color: {theme.colours.text}" />
    </a>
  {/if}
</div>

<style>
  .time-range::before {
    content: ' - ';
    white-space: pre;
  }
</style>