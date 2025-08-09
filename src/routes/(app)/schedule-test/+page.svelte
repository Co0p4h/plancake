<script lang="ts">
	import dayjs from 'dayjs';
  import { onMount } from 'svelte';
	import ItemCard from './ItemCard.svelte';

  let { data } = $props();

  // ---- Date helpers -------------------------------------------------------

  const WEEK_STARTS_ON = 1; // 1 = Monday, 0 = Sunday

  function startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function addDays(d: Date, n: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  function startOfWeek(d: Date, weekStartsOn = WEEK_STARTS_ON): Date {
    const x = startOfDay(d);
    const day = x.getDay();
    const diff = (day - weekStartsOn + 7) % 7;
    x.setDate(x.getDate() - diff);
    return x;
  }

  function isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function fmtDayShort(d: Date): string {
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }

  function fmtDayLong(d: Date): string {
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }

  function fmtRange(a: Date, b: Date): string {
    const sameMonth = a.getMonth() === b.getMonth();
    const sameYear = a.getFullYear() === b.getFullYear();
    const optsA: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    const optsB: Intl.DateTimeFormatOptions = {
      month: sameMonth ? undefined : 'short',
      day: 'numeric',
      year: sameYear ? undefined : 'numeric'
    };
    return `${a.toLocaleDateString(undefined, optsA)} – ${b.toLocaleDateString(
      undefined,
      optsB
    )}`;
  }

  // ---- State (Svelte 5 runes) --------------------------------------------

  let containerEl: HTMLDivElement | null = null;
  let today = startOfDay(new Date());

  // The week we are viewing (start date).
  let weekStart = $state(startOfWeek(today));

  // The "focused/selected" date within the visible week (default = today).
  // When switching weeks, we keep the same weekday index where possible.
  let selectedDate = $state(new Date(today));

  // All 7 days of the current week (always rendered).
  let weekDays = $derived(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  );

  // Index of selected within current week or -1 if not in this week.
  let selectedIndex = $derived(() => {
    for (let i = 0; i < 7; i++) {
      if (isSameDay(weekDays[i], selectedDate)) return i;
    }
    return -1;
  });

  // Responsive visible columns (7 → 5 → 3 → 1) computed from container width.
  let visibleCols = $state(7);

  // Width of one column (in px), derived from container width and visibleCols.
  let colWidth = $state(0);

  // The left-most snapped column index currently in view.
  let scrollIndex = $state(0);

  // ---- Responsive logic ---------------------------------------------------

  function computeVisible(width: number): number {
    // Tweak breakpoints as needed
    if (width >= 1024) return 7;
    if (width >= 768) return 5;
    if (width >= 560) return 3;
    return 1;
  }

  function updateMeasurements(): void {
    if (!containerEl) return;
    const width = containerEl.clientWidth;
    const nextVisible = computeVisible(width);
    if (nextVisible !== visibleCols) visibleCols = nextVisible;
    colWidth = width / visibleCols;
    // Keep CSS var in sync for flex-basis
    containerEl.style.setProperty('--visible', String(visibleCols));
  }

  // ---- Scrolling / snapping ------------------------------------------------

  function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
  }

  function scrollToIndex(i: number, smooth = false): void {
    if (!containerEl) return;
    const idx = clamp(i, 0, 7 - visibleCols);
    containerEl.scrollTo({
      left: idx * colWidth,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  // Center selected date when possible.
  function centerOnSelected(smooth = false): void {
    if (selectedIndex < 0) return;
    const half = Math.floor(visibleCols / 2);
    const target = clamp(selectedIndex - half, 0, 7 - visibleCols);
    scrollToIndex(target, smooth);
  }

  function handleScroll(): void {
    if (!containerEl || colWidth === 0) return;
    const idx = Math.round(containerEl.scrollLeft / colWidth);
    scrollIndex = clamp(idx, 0, 7 - visibleCols);
  }

  // ---- Week navigation -----------------------------------------------------

  function shiftWeek(deltaWeeks: number): void {
    // Keep selected weekday index if it was in the current week,
    // otherwise keep the same weekday as "selectedDate".
    const keepIdx =
      selectedIndex >= 0 ? selectedIndex : selectedDate.getDay();

    weekStart = addDays(weekStart, deltaWeeks * 7);

    // Calculate new selected date based on weekday
    // Map weekday (0=Sun) to index in week given WEEK_STARTS_ON setting.
    const desiredIdx =
      (keepIdx - WEEK_STARTS_ON + 7) % 7; // 0..6 within the week grid

    selectedDate = addDays(weekStart, desiredIdx);
    // After moving week, center selected
    queueMicrotask(() => centerOnSelected(true));
  }

  // Shift visible by one column (for small viewports).
  function shiftColumns(delta: number): void {
    scrollToIndex(scrollIndex + delta, true);
  }

  // Select a day (by clicking a cell)
  function selectDay(d: Date, i: number): void {
    selectedDate = d;
    // Center selection when viewport is not showing all 7
    if (visibleCols < 7) centerOnSelected(true);
  }

  // ---- Lifecycle -----------------------------------------------------------

  onMount(() => {
    // Observe container to update visibleCols + colWidth
    const resize = () => {
      updateMeasurements();
      // Align initial center on mount and when breakpoints change
      centerOnSelected(false);
      handleScroll();
    };

    // Initial: ensure selectedDate belongs to current week if today is in it
    if (
      today >= weekDays[0] &&
      today <= weekDays[6] &&
      selectedIndex === -1
    ) {
      selectedDate = today;
    }

    const ro = new ResizeObserver(resize);
    if (containerEl) ro.observe(containerEl);

    // First measurement after mount
    queueMicrotask(resize);

    return () => ro.disconnect();
  });

  // Adjust scroll when visibleCols changes (e.g., orientation or resize).
  $effect(() => {
    // This effect runs whenever visibleCols changes, keep centered.
    // Use auto (not smooth) to avoid long animation on rotate.
    centerOnSelected(false);
  });

  // ---- Derived labels ------------------------------------------------------

  let weekLabel = $derived(() =>
    fmtRange(weekDays()[6], weekDays()[6])
  );

  // ---- Utility guards for arrows ------------------------------------------

  let canScrollLeft = $derived(() => scrollIndex > 0);
  let canScrollRight = $derived(() => scrollIndex < 7 - visibleCols);
</script>

<!-- Page layout -->
<section class="calendar">
  <header class="toolbar">
    <div class="week-nav">
      <button
        class="icon-btn"
        aria-label="Previous week"
        onclick={() => shiftWeek(-1)}
      >
        ‹
      </button>
      <div class="week-label" aria-live="polite">{weekLabel()}</div>
      <button
        class="icon-btn"
        aria-label="Next week"
        onclick={() => shiftWeek(1)}
      >
        ›
      </button>
    </div>

    <div class="today-actions">
      <button
        class="btn"
        onclick={() => {
          const now = startOfDay(new Date());
          today = now;
          weekStart = startOfWeek(now);
          selectedDate = now;
          queueMicrotask(() => centerOnSelected(true));
        }}
      >
        Today
      </button>
    </div>
  </header>

  <div class="grid-wrapper">
    {#if visibleCols < 7}
      <button
        class="scroll-btn left"
        aria-label="Scroll left"
        disabled={!canScrollLeft}
        onclick={() => shiftColumns(-1)}
      >
        ‹
      </button>
    {/if}

    <div
      class="scroller"
      bind:this={containerEl}
      onscroll={handleScroll}
    >
      {#each weekDays() as d, i}
        <div
          class="day-col {isSameDay(d, selectedDate) ? 'selected' : ''}"
          role="button"
          tabindex="0"
          aria-label={fmtDayLong(d)}
          aria-pressed={isSameDay(d, selectedDate)}
          onclick={() => selectDay(d, i)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectDay(d, i);
            }
          }}
        >
          <div class="day-header">
            <div class="weekday">
              {fmtDayShort(d)}
            </div>
            <div class="date">
              {d.getDate()}
            </div>
          </div>

          <div class="day-content">
            <!-- Your events go here -->
            <div class="placeholder">
              {#await data.streamed.items}
                No events
              {:then items} 
                <!-- {#each items as item} -->
                 <ItemCard item={items[0]} />
                <!-- {/each} -->
              {/await}

            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if visibleCols < 7}
      <button
        class="scroll-btn right"
        aria-label="Scroll right"
        disabled={!canScrollRight}
        onclick={() => shiftColumns(1)}
      >
        ›
      </button>
    {/if}
  </div>
</section>

<style>
  :global(:root) {
    --bg: #0b0e14;
    --panel: #121826;
    --panel-2: #1a2233;
    --text: #e6edf7;
    --muted: #a8b3cf;
    --primary: #5b9bff;
    --accent: #7bd88f;
    --border: #233049;
    --ring: #345;
    --visible: 7;
  }

  .calendar {
    display: grid;
    gap: 12px;
    padding: 16px;
    color: var(--text);
    background: var(--bg);
    min-height: 100dvh;
    box-sizing: border-box;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .week-nav {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 6px 8px;
  }

  .week-label {
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .icon-btn {
    appearance: none;
    border: none;
    background: var(--panel-2);
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    line-height: 32px;
    font-size: 18px;
    cursor: pointer;
    display: grid;
    place-items: center;
    border: 1px solid var(--border);
  }

  .icon-btn:hover {
    outline: 2px solid var(--ring);
    outline-offset: 0;
  }

  .btn {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--panel);
    color: var(--text);
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn:hover {
    outline: 2px solid var(--ring);
    outline-offset: 0;
  }

  .grid-wrapper {
    position: relative;
  }

  .scroller {
    display: flex;
    gap: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .scroller::-webkit-scrollbar {
    height: 10px;
  }
  .scroller::-webkit-scrollbar-thumb {
    background: #2a3856;
    border-radius: 999px;
  }
  .scroller::-webkit-scrollbar-track {
    background: transparent;
  }

  .day-col {
    flex: 0 0 calc(100% / var(--visible));
    min-width: 0;
    border-right: 1px solid var(--border);
    scroll-snap-align: start;
    display: grid;
    grid-template-rows: auto 1fr;
    height: 72dvh;
    background: linear-gradient(180deg, var(--panel) 0%, #0f1522 100%);
  }

  .day-col:last-child {
    border-right: none;
  }

  .day-col.selected {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
    background: linear-gradient(180deg, #0f192d 0%, #0f1a2f 100%);
  }

  .day-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: inherit;
    z-index: 1;
  }

  .weekday {
    font-size: 0.95rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .date {
    font-weight: 700;
    color: var(--text);
  }

  .day-content {
    padding: 12px;
  }

  .placeholder {
    color: var(--muted);
    font-size: 0.9rem;
    border: 1px dashed var(--border);
    padding: 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.1);
  }

  .scroll-btn {
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    z-index: 2;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--text);
    display: grid;
    place-items: center;
    cursor: pointer;
    opacity: 0.92;
  }

  .scroll-btn:hover {
    outline: 2px solid var(--ring);
  }

  .scroll-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .scroll-btn.left {
    left: 8px;
  }
  .scroll-btn.right {
    right: 8px;
  }
</style>