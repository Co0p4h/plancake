<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { type ScheduleSettings } from '$lib/server/db/schema';
	import Toggle from './Toggle.svelte';

  let { data } = $props();
</script>

<div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
  <h1 class="mb-4 text-xl text-gray-500">{m['_settings.settings']()}</h1>
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-lg">{m['_settings.show_empty_days']()}</h2>
        <p class="text-gray-500 text-sm">{m['_settings.show_empty_days_description']()}</p>
      </div>
      <Toggle toggled={true} onclick={() => {}} disabled={false} />
    </div>
    <div class="pl-4 border-l-2 border-gray-300">
      <div class="text-lg">{m['_settings.empty_day_text']()}</div>
      <p class="text-sm text-gray-500">{m['_settings.empty_day_text_description']()}</p>
      <input class="border w-1/2 border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" value={data.schedule_settings?.empty_day_text} placeholder={m['_settings.empty_day_text_placeholder']()} />
    </div>
    <div>
      <h2 class="text-lg">{m['_settings.show_past_events']()}</h2>
      <p class="text-gray-500 text-sm">{m['_settings.show_past_events_description']()}</p>
    </div>
    <div>
      <h2 class="text-lg">{m['_settings.use_24_hour_time']()}</h2>
      <p class="text-gray-500 text-sm">{m['_settings.use_24_hour_time_description']()}</p>
    </div>
    <div>
      <h2 class="text-lg">{m['_settings.show_social_links']()}</h2>
      <p class="text-gray-500 text-sm">{m['_settings.show_social_links_description']()}</p>
    </div>
    <div>
      <h2 class="text-lg">{m['_settings.first_day_of_week']()}</h2>
      <p class="text-gray-500 text-sm">{m['_settings.first_day_of_week_description']()}</p>
    </div>
  </div>

  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7">
    <div>
      <h2 class="text-lg">{m['_settings.show_logo']()}</h2>
      <p class="text-gray-500 text-sm">{m['_settings.show_logo_description']()}</p>
    </div>
  </div>
  <form method="POST" action="?/add" class="flex-1">
    <button
      type="submit"
      class="focus:shadow-outline rounded bg-purple-400 px-4 py-2 font-bold text-white hover:bg-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 absolute right-5 bottom-5 transition-all duration-200 ease-in-out cursor-pointer"
    >
      save
    </button>
  </form>
</div>

