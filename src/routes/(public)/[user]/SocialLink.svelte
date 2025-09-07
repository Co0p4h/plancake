<script lang="ts">
	import type { ScheduleData } from "$lib/server/db/services/schedule-service";
	import { Link } from "@lucide/svelte";

  let { url, platform, schedule_data }: {url: string, platform: string, schedule_data: ScheduleData} = $props();
</script>
<a 
  href={url} 
  target="_blank" 
  rel="noopener noreferrer" 
  class="inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
  style:background-color={schedule_data.theme.colours.secondary}
  style:color={schedule_data.theme.colours.text}
  style:border={`1px ${schedule_data.theme.colours.text} solid`}
  style:border-radius={`${schedule_data.theme.item_theme.border_radius}px`}
>
  <span class="capitalize">{platform}</span>
  <Link class="ml-2 h-5 w-5"/>
</a>