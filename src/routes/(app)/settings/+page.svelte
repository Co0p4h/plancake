<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ScheduleSettings } from '$lib/server/db/schema';
	import Toggle from './Toggle.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

  let { data } = $props();

  let isSubmitting = $state(false);
  let settings: ScheduleSettings = $state({
    show_empty_days: true,
    empty_day_text: "",
    show_past_events: false,
    use_24_hour_time: false,
    show_social_links: false,
    first_day_of_week: "monday",
    show_logo: true,
  });

  const enhance_form: SubmitFunction = ({ formData, action }) => {
    console.log('Form submitting with settings:', settings);
    isSubmitting = true;
    return async ({ result }) => {
      isSubmitting = false;

      if (result.type == "success" && result.data) {
        const updated_settings = await result.data.updated_settings;
        if (updated_settings) {
          toast.success('Settings updated successfully!');
        }
      } else if (result.type == "failure" && result.data) { 
        const error_message = result.data.error || 'An unexpected error occurred';
        toast.error(error_message);
      }
    }
  }

  $effect(() => {
    if (data.schedule_settings) {
      data.schedule_settings.then((result) => {
        if (result && result[0]) {
          settings = { ...result[0].settings };
          console.log('Settings loaded:', settings);
        }
      });
    }
  });
</script>

{#await data.schedule_settings}
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
    <div class="flex items-center justify-center h-32">
      <div class="text-gray-500">Loading schedule settings...</div>
    </div>
  </div>
{:then schedule_settings}
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
    <h1 class="mb-4 text-xl text-gray-500">{m['_settings.settings']()}</h1>
    {#if schedule_settings}
      <form method="POST" action="?/updateSettings" use:enhance={enhance_form} class="flex-1">
        <input type="hidden" name="settings" value={JSON.stringify(settings)} />
        <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg">{m['_settings.show_empty_days']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_empty_days_description']()}</p>
            </div>
            <Toggle toggled={settings.show_empty_days} onclick={() => {
              console.log('Toggle show_empty_days clicked, current:', settings.show_empty_days);
              settings.show_empty_days = !settings.show_empty_days;
              console.log('New value:', settings.show_empty_days);
            }} disabled={isSubmitting} />
          </div>

          {#if settings.show_empty_days}
            <div in:fade={{ duration: 100 }} class="pl-4 border-l-2 border-gray-300">
              <div class="text-lg">{m['_settings.empty_day_text']()}</div>
              <p class="text-sm text-gray-500">{m['_settings.empty_day_text_description']()}</p>
              <input 
                class="border w-1/2 border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" 
                bind:value={settings.empty_day_text} 
                placeholder={m['_settings.empty_day_text_placeholder']()} 
              />
            </div>
          {/if}

          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg">{m['_settings.show_past_events']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_past_events_description']()}</p>
            </div>
            <Toggle toggled={settings.show_past_events} onclick={() => {
              console.log('Toggle show_past_events clicked, current:', settings.show_past_events);
              settings.show_past_events = !settings.show_past_events;
              console.log('New value:', settings.show_past_events);
            }} disabled={isSubmitting} />
          </div>

          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg">{m['_settings.use_24_hour_time']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.use_24_hour_time_description']()}</p>
            </div>
            <Toggle toggled={settings.use_24_hour_time} onclick={() => {
              console.log('Toggle use_24_hour_time clicked, current:', settings.use_24_hour_time);
              settings.use_24_hour_time = !settings.use_24_hour_time;
              console.log('New value:', settings.use_24_hour_time);
            }} disabled={isSubmitting} />
          </div>

          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg">{m['_settings.show_social_links']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_social_links_description']()}</p>
            </div>
            <Toggle toggled={settings.show_social_links} onclick={() => {
              console.log('Toggle show_social_links clicked, current:', settings.show_social_links);
              settings.show_social_links = !settings.show_social_links;
              console.log('New value:', settings.show_social_links);
            }} disabled={isSubmitting} />
          </div>

          <div>
            <h2 class="text-lg">{m['_settings.first_day_of_week']()}</h2>
            <p class="text-gray-500 text-sm">{m['_settings.first_day_of_week_description']()}</p>
            <select 
              class="mt-2 border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              bind:value={settings.first_day_of_week}
              disabled={isSubmitting}
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </div>
        
        <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg">{m['_settings.show_logo']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_logo_description']()}</p>
            </div>
            <Toggle toggled={settings.show_logo} onclick={() => {
              console.log('Toggle show_logo clicked, current:', settings.show_logo);
              settings.show_logo = !settings.show_logo;
              console.log('New value:', settings.show_logo);
            }} disabled={isSubmitting} />
          </div>
        </div>

        <button
          type="submit"
          class="focus:shadow-outline rounded bg-purple-400 px-4 py-2 font-bold text-white hover:bg-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 absolute right-5 bottom-5 transition-all duration-200 ease-in-out cursor-pointer"
          disabled={isSubmitting || schedule_settings[0].settings == settings} 
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-500">no schedule settings found. Please create a schedule first.</p>
      </div>
    {/if}
  </div>
{/await}

<Toaster position="bottom-center" />
