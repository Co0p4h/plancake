<script lang="ts">
	import type { ScheduleItem } from "$lib/server/db/schema";
	import { getDaysOfWeek } from "$lib/utils/date";
	import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";
	import AddItemModal from "./AddItemModal.svelte";
	import EditItemModal from "./EditItemModal.svelte";
	import { addModal } from "./modal.svelte";
	import dayjs from "dayjs";
  import isoWeek from "dayjs/plugin/isoWeek";
	import ItemCard from "./ItemCard.svelte";
	import { Plus } from "@lucide/svelte";
  import { m } from '$lib/paraglide/messages.js';

  dayjs.extend(isoWeek);

  let { data } = $props();

  let currentDate = $state(dayjs());
  let gridEl: HTMLDivElement | null = $state(null); 
  let todayEl: HTMLDivElement | null = $state(null); 

  function groupEventsByDate(items: ScheduleItem[]): Map<string, ScheduleItem[]> {
    const eventsMap = new Map();
    if (!items) return eventsMap; // Return empty map if items are null/undefined

    for (const item of items) {
      // Using dayjs as in your example
      const key = dayjs(item.startTime).format("YYYY-MM-DD");

      if (!eventsMap.has(key)) {
        eventsMap.set(key, []);
      }
      // The '?' is optional chaining, good for safety
      eventsMap.get(key)?.push(item);
    }
    // You can debug here easily!
    // console.log("Grouped Events Map:", eventsMap);
    return eventsMap;
  } 

  let weekDays = $derived(() => {
    return getDaysOfWeek(currentDate);
  });

  const isSameDay = (d1: dayjs.Dayjs, d2: dayjs.Dayjs) => {
    return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
  }

  const formatHeaderDate = (date: dayjs.Dayjs) => {
    return date.format('MMMM YYYY'); 
  };

  const goToPreviousWeek = () => {
    currentDate = currentDate.subtract(7, "days");
  };

  const goToNextWeek = () => {
    currentDate = currentDate.add(7, "days");
  };

  const handleDayScroll = (direction: "left" | "right") => {
    if (!gridEl) return;
    const scrollAmount = gridEl.clientWidth;
    gridEl.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // $effect(() => {
  //   const scrollToToday = () => {
  //     if (todayEl && gridEl) {
  //       if (gridEl.scrollWidth > gridEl.clientWidth) {
  //         const gridRect = gridEl.getBoundingClientRect();
  //         const todayRect = todayEl.getBoundingClientRect();

  //         const scrollLeft =
  //           todayRect.left -
  //           gridRect.left -
  //           gridRect.width / 2 +
  //           todayRect.width / 2;

  //         gridEl.scrollTo({
  //           left: scrollLeft,
  //           behavior: "smooth",
  //         });
  //       }
  //     }
  //   };

  //   scrollToToday();

  //   window.addEventListener("resize", scrollToToday);

  //   return () => {
  //     window.removeEventListener("resize", scrollToToday);
  //   };
  // });
</script>

<div class="weekly-calendar">
  <header class="calendar-header">
    <button onclick={goToPreviousWeek} class="nav-arrow week-nav">
      &lt;&lt;
    </button>
    <!-- The header text is derived from currentDate -->
    <h2>{formatHeaderDate(currentDate)}</h2>
    <button onclick={goToNextWeek} class="nav-arrow week-nav">
      &gt;&gt;
    </button>
  </header>

  <div class="calendar-body">
    <button
      onclick={() => handleDayScroll("left")}
      class="nav-arrow day-nav day-nav-left"
    >
      &lt;
    </button>


  <!-- Add your events or content here -->
    {#await data.streamed.items}
          <!-- (1) PENDING STATE: Render the grid skeleton with loaders -->
      <div class="calendar-grid" bind:this={gridEl}>
        {#each weekDays() as day}
          {@const isToday = isSameDay(day, dayjs())}
          <div
            class="day-column"
            class:today={isToday}
          >
            <div class="day-header">
              <div class="day-name">
                {day.format("ddd")}
              </div>
              <div class="day-number">{day.format("D")}</div>
            </div>
            <div class="day-content">
              <div class="spinner"></div>
            </div>
          </div>
        {/each}
      </div>
    {:then items} 
      {@const eventsByDate = groupEventsByDate(items)}
      <div class="calendar-grid" bind:this={gridEl}>
        {#each weekDays() as day}
          {@const isToday = isSameDay(day, dayjs())}
          {@const dayKey = day.format("YYYY-MM-DD")}
          {@const dayItems = eventsByDate.get(dayKey) || []}
          <div
            class="day-column"
            class:today={isToday}
            bind:this={todayEl}
          >
            <div class="day-header">
              <div class="day-name">
                {day.format("ddd")}
              </div>
              <div class="day-number">{day.format("D")}</div>
            </div>
            <div class="day-content">
              {#each dayItems as item (item.id)}
                <ItemCard {item} />
              {/each}
            </div>
            <button class="relative bottom-4 left-0 right-0 text-center text-gray-400 text-sm hover:text-gray-600 cursor-pointer"
              onclick={() => {
                addModal.show = true;
                addModal.initialDate = day;
              }}>
              <span class="flex items-center justify-center">
                <Plus class="h-3 w-3 mr-1" />{m["_schedule.add_event"]()}
              </span>
            </button>
          </div>
        {/each}
      </div>
      {:catch error}
        <p>Error loading items: {error.message}</p>
      {/await}

    <button
      onclick={() => handleDayScroll("right")}
      class="nav-arrow day-nav day-nav-right"
    >
      &gt;
    </button>
  </div>
</div>

<AddItemModal />
<ConfirmDeleteModal />
<EditItemModal />

<style>
  /* Main container for the calendar */
  .weekly-calendar {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    width: 95%;
    max-width: 1200px;
    margin: 2rem auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  /* Header with month/year and navigation */
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ddd;
  }

  .calendar-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  /* General styles for navigation arrows */
  .nav-arrow {
    background: none;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    font-size: 1.2rem;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, color 0.2s;
  }

  .nav-arrow:hover {
    background-color: #e9e9e9;
    color: #000;
  }

  /* Main body containing the grid and day-scroll arrows */
  .calendar-body {
    position: relative;
  }

  /* The grid that holds the day columns */
  .calendar-grid {
    display: grid;
    /* Default to 7 columns on large screens */
    grid-template-columns: repeat(7, 1fr);
    background-color: #fff;
  }

  /* Individual day column styling */
  .day-column {
    border-left: 1px solid #eee;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
  }

  .day-column:first-child {
    border-left: none;
  }

  .day-header {
    padding: 0.75rem;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  .day-name {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #777;
  }

  .day-number {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin-top: 0.25rem;
  }

  /* Highlight for the current day */
  .day-column.today .day-header {
    background-color: #eef5ff;
  }

  .day-column.today .day-number {
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
  }

  .day-content {
    flex-grow: 1;
    padding: 0.5rem;
  }

  /* Hide day-scrolling arrows by default */
  .day-nav {
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .day-nav-left {
    left: 10px;
  }
  .day-nav-right {
    right: 10px;
  }

  /* --- Responsive Breakpoints --- */

  /* Medium screens (e.g., tablets) - 5 days */
  @media (max-width: 1280px) {
    .calendar-grid {
      grid-template-columns: repeat(7, 20%); /* 100% / 5 = 20% */
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
      scrollbar-width: none; /* Hide scrollbar on Firefox */
    }
    .calendar-grid::-webkit-scrollbar {
      display: none; /* Hide scrollbar on Chrome/Safari */
    }
    .day-column {
      scroll-snap-align: center;
    }
    .day-nav {
      display: flex;
    }
  }

  /* Small screens (e.g., large phones) - 3 days */
  @media (max-width: 1024px) {
    .calendar-grid {
      grid-template-columns: repeat(7, 33.33%); /* 100% / 3 = 33.33% */
    }
    .calendar-header h2 {
      font-size: 1.1rem;
    }
  }

  /* Extra-small screens (e.g., standard phones) - 1 day */
  @media (max-width: 640px) {
    .calendar-grid {
      grid-template-columns: repeat(7, 100%); /* 100% / 1 = 100% */
    }
    .calendar-header {
      padding: 0.75rem 1rem;
    }
  }
</style>