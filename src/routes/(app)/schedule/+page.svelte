<script lang="ts">
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import dayjs from "dayjs";
  import isoWeek from "dayjs/plugin/isoWeek";
	import DayColumn from "./DayColumn.svelte";
	import { m } from '$lib/paraglide/messages.js';
	import AddItemModal from "./AddItemModal.svelte";
	import { isToday } from "$lib/utils/date";
	import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";
	import EditItemModal from "./EditItemModal.svelte";
	import { onMount } from "svelte";
	import type { ScheduleItem } from "$lib/server/db/schema";
  
  dayjs.extend(isoWeek);

  let { data } = $props();

  let referenceDate = $state(dayjs());
  let currentWeek = $state(dayjs().isoWeek());
  let columnNum: 1 | 3 | 5 | 7 = $state(5);
  let screenWidth = $state(1024); // default width...
  let windowStart: number = $state(0);

  let isInitialised = $state(false);

  onMount(() => {
    screenWidth = window.innerWidth;
    isInitialised = true;
    
    const handleResize = () => {
      screenWidth = window.innerWidth;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  $effect(() => {
    if (screenWidth < 640) { 
      columnNum = 1; 
    } else if (screenWidth < 1024) { 
      columnNum = 3; 
    } else if (screenWidth < 1280) { 
      columnNum = 5; 
    } else { 
      columnNum = 7; 
    }
  });

  $effect(() => {
    windowStart = calculateWindowStart(referenceDate);
  })

  // the start 0 - 6 (monday - sunday)
  const calculateWindowStart = (day: dayjs.Dayjs) => {
    const isoDayNumber = day.isoWeekday();
    
    if (columnNum === 7) return 0;
    if (columnNum === 1) return isoDayNumber - 1;
    if (columnNum === 5) {
      return Math.max(2, Math.min(4, isoDayNumber - 1)) - 2;
    }
    if (columnNum === 3) {
      return Math.max(1, Math.min(5, isoDayNumber - 1)) - 1;
    }
    const start = Math.ceil((columnNum - 1) / 2);
    return start - 2;
  };

  const getCurrentWindow = (): dayjs.Dayjs[] => {
    const window = [];
    const weekStart = dayjs().isoWeek(currentWeek).startOf('isoWeek'); // monday of current week
    
    for (let i = 0; i < columnNum; i++) {
      // console.log("windowStart", windowStart);
      const dayIndex = windowStart + i;
      const dayDate = weekStart.add(dayIndex, 'day');
      window.push(dayDate);
    }
    return window;
  };

  const goToPreviousDate = () => {
    const newStart = windowStart - 1;
    if (newStart < 0) {
      currentWeek = currentWeek === 1 ? 52 : currentWeek - 1;
      windowStart = calculateWindowStart(referenceDate.subtract(referenceDate.isoWeekday(), 'day')); // this is such a hacky way to do this...
      // console.log("windowStart ;D", windowStart);
    } else {
      windowStart = newStart;
    }
  };

  const goToNextDate = () => {
    const newStart = windowStart + 1;
    if (newStart + columnNum - 1 > 6) {
      currentWeek = currentWeek === 52 ? 1 : currentWeek + 1;
      windowStart = 0; // start from beginning of next week
    } else {
      windowStart = newStart;
    }
  };

  // const getItemsForDay = (dayIndex: dayjs.Dayjs, items: any[]) => {
  //   return items.filter(item => {
  //     const itemDate = dayjs(item.startTime);
  //     return itemDate.isSame(dayIndex, 'day');
  //   });
  // };
  
  let weekDisplayText = $derived(() => {
    const weekStart = dayjs().isoWeek(currentWeek).startOf('isoWeek'); 
    const weekEnd = weekStart.add(6, 'day'); 
    
    if (weekStart.month() !== weekEnd.month()) {
      return `${weekStart.format("MMM DD")} - ${weekEnd.format("MMM DD")}`;
    } else {
      return `${weekStart.format("MMM DD")} - ${weekEnd.format("DD")}`;
    }
  });

  const goToToday = () => {
    referenceDate = dayjs();
    currentWeek = referenceDate.isoWeek();
  }

  function groupEventsByDate(items: ScheduleItem[]): Map<string, ScheduleItem[]> {
    const eventsMap = new Map();
    if (!items) return eventsMap; 

    for (const item of items) {
      const key = dayjs(item.startTime).format("YYYY-MM-DD");

      if (!eventsMap.has(key)) {
        eventsMap.set(key, []);
      }
      eventsMap.get(key).push(item);
    }

    return eventsMap;
  } 
</script>

<div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-medium">{weekDisplayText()}</h2>
    <h2 class="text-lg font-medium">{m["_schedule.weekly_schedule"]()}</h2>
    <div class="flex  items-center">
      <button class="cursor-pointer hover:bg-gray-100 rounded-md p-1" onclick={goToPreviousDate}>
        <ChevronLeft class="h-5 w-5" />
      </button>
      <button onclick={goToToday} class="hover:bg-gray-100 rounded-md px-1 py-1 cursor-pointer">
        <span class="px-2">{m["_schedule.today"]()}</span>
      </button>
      <button class="cursor-pointer hover:bg-gray-100 rounded-md p-1" onclick={goToNextDate}>
        <ChevronRight class="h-5 w-5" />
      </button>
    </div>
  </div>
      
  {#if isInitialised}
    {#await data.streamed.items}
      <div class="flex gap-4">
        {#each getCurrentWindow() as day}
          <DayColumn 
            isToday={isToday(day)} 
            day={day} 
            items={[{id: "loading", scheduleId: "loading...", startTime: dayjs().toDate(), endTime: dayjs().toDate(), title: "loading...", description: "loading...", createdAt: dayjs().toDate(), updatedAt: dayjs().toDate(), externalUrl: ""}]}
          />
        {/each}
      </div>
    {:then items}
      {@const eventsByDate = groupEventsByDate(items)}
      <div class="flex gap-4">
        {#each getCurrentWindow() as day}
          {@const dayKey = day.format("YYYY-MM-DD")}
          {@const dayItems = eventsByDate.get(dayKey) || []}
          <DayColumn 
            isToday={isToday(day)} 
            day={day} 
            items={dayItems} 
          />
        {/each}
      </div>
    {/await}
  {:else}
    <div class="flex gap-4">
      <div class="text-gray-500">initializing...</div>
    </div>
  {/if}
</div>

<AddItemModal />
<ConfirmDeleteModal />
<EditItemModal />