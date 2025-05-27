<!-- maybe fix the way I am getting and passing around initial date? -->
<script lang="ts">
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import dayjs from "dayjs";
  import isoWeek from "dayjs/plugin/isoWeek";
	import DayColumn from "./DayColumn.svelte";
	import { m } from '$lib/paraglide/messages.js';
	import AddItemModal from "./AddItemModal.svelte";
	import { getDaysOfWeek, isToday } from "$lib/utils/date";
	import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";
	import EditItemModal from "./EditItemModal.svelte";
  dayjs.extend(isoWeek);

  let { data } = $props();
  let currentDate = $state(dayjs());

  const goToPreviousWeek = () => {
    currentDate = currentDate.subtract(1, 'week');
  };
  
  const goToNextWeek = () => {
    currentDate = currentDate.add(1, 'week');
  };

  // TODO: need a better way to do this...?
  const getItemsForDay = (dayIndex: dayjs.Dayjs) => {
    return data.items.filter(item => dayjs(item.startTime).date() === dayIndex.date() && 
      dayjs(item.startTime).month() === dayIndex.month() && 
      dayjs(item.startTime).year() === dayIndex.year());
  };

  const getWeekDisplayText = () => {
    const daysOfWeek = getDaysOfWeek(currentDate);
    const startDay = daysOfWeek[0];
    const endDay = daysOfWeek[daysOfWeek.length - 1];
    
    if (startDay.month() !== endDay.month()) {
      return `${startDay.format("MMM DD")} - ${endDay.format("MMM DD")}`;
    } else {
      return `${startDay.format("MMM DD")} - ${endDay.format("DD")}`;
    }
  };
</script>

<div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-medium">{getWeekDisplayText()}</h2>
    <h2 class="text-lg font-medium">{m["_schedule.weekly_schedule"]()}</h2>
    <div class="flex  items-center">
      <button class="cursor-pointer hover:bg-gray-100 rounded-md p-1" onclick={goToPreviousWeek}>
        <ChevronLeft class="h-5 w-5" />
      </button>
      <button onclick={() => currentDate = dayjs()} class="hover:bg-gray-100 rounded-md px-1 py-1 cursor-pointer">
        <span class="px-2">{m["_schedule.today"]()}</span>
      </button>
      <button class="cursor-pointer hover:bg-gray-100 rounded-md p-1" onclick={goToNextWeek}>
        <ChevronRight class="h-5 w-5" />
      </button>
    </div>
  </div>
      
  <div class="flex gap-4">
    {#each getDaysOfWeek(currentDate) as day, index}
      <DayColumn isToday={isToday(day)} day={day} items={getItemsForDay(day)} />
    {/each}
  </div>
</div>

<AddItemModal />
<ConfirmDeleteModal />
<EditItemModal />