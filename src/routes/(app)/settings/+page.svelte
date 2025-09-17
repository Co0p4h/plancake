<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { AllScheduleSettings } from '$lib/server/db/schema';
	import Toggle from './Toggle.svelte';
  import SettingsSkeleton from './SettingsSkeleton.svelte';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { LinkIcon, LockIcon } from '@lucide/svelte';

  let { data } = $props();

  console.log('data: ', data);

  let descriptionElement: HTMLTextAreaElement | undefined = $state();

  let isSubmitting = $state(false);
  let isSubmittingSchedule = $state(false);

  let settings: AllScheduleSettings = $state({
    title: '',
    description: '',
    show_empty_days: true,
    empty_day_text: "",
    show_past_events: false,
    use_24_hour_time: false,
    show_social_links: false,
    first_day_of_week: "monday",
    show_logo: true,
    show_schedule_description: false,
    show_schedule_image: false
  });

  const enhance_form: SubmitFunction = ({ formData, action }) => {

    console.log('Form submitting with settings:', settings);

    isSubmitting = true;
    return async ({ result }) => {
      isSubmitting = false;

      console.log("result", result);
      
      if (result.type == "success" && result.data) {
        const updated_schedule = await result.data.updated_schedule;
        console.log("updated_settings", updated_schedule);
        
        if (updated_schedule) {
          toast.success('settings updated successfully!');
        }
      } else if (result.type == "failure" && result.data) { 
        const error_message = result.data.error || 'An unexpected error occurred';
        toast.error(error_message);
      }
    }
  }

  $effect(() => {
    data.schedule_settings?.then((result) => {
      if (result.schedule && result.schedule_settings) {
        settings = { ...result.schedule_settings, title: result.schedule.title, description: result.schedule.description };
        console.log('settings loaded:', settings);
      }
    });
  });
</script>

{#await data.schedule_settings}
 <SettingsSkeleton />
{:then schedule_settings}
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
    <h1 class="mb-4 text-xl text-gray-500">{m['_settings.settings']()}</h1>
    {#if schedule_settings}
      <form method="POST" action="?/updateScheduleSettings" use:enhance={enhance_form} class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
        <input type="hidden" name="schedule_settings" value={JSON.stringify(settings)} />

        <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7">
          <div class="flex flex-col gap-1">
            <div class="text-lg">{m['_settings.schedule_title']()}</div>
            <p class="text-sm text-gray-500">{m['_settings.schedule_title_description']()}</p>
            <input 
              name="title"
              bind:value={settings.title}
              class="border w-full border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" 
              placeholder={m['_settings.schedule_title_placeholder']({ name: data.user.username })} 
              disabled={isSubmittingSchedule}
            />
          </div>

          <!-- {#if settings.show_schedule_description} -->
            <div in:fade={{ duration: 100 }} class="flex flex-col gap-1">
              <div class="text-lg">{m['_settings.show_schedule_text']()}</div>
              <p class="text-sm text-gray-500">{m['_settings.show_schedule_text_description']()}</p>
              <textarea 
                name="description"
                bind:value={settings.description}
                bind:this={descriptionElement}
                class={`border w-full border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[80px] resize-y whitespace-pre-wrap ${!settings.show_schedule_description ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={m['_settings.schedule_description_placeholder']()} 
                disabled={isSubmittingSchedule || !settings.show_schedule_description}
                onclick={() => {
                  // if (!settings.show_schedule_description) {
                  //   toast('please enable "Show Schedule Text" to edit the description.', { icon: 'ℹ️' });
                  // }
                }}
              ></textarea>
            </div>
          <!-- {/if} -->
        </div>

        <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7">
          <div class="flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg">{m['_settings.show_schedule_description']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_schedule_description']()}</p>
            </div>
            <Toggle 
              toggled={settings.show_schedule_description} 
              onclick={() => { 
                settings.show_schedule_description = !settings.show_schedule_description;
                if (settings.show_schedule_description) {
                  requestAnimationFrame(() => {
                    descriptionElement?.focus();
                  });
                } 
              }}
              disabled={isSubmitting} 
            />
          </div>

          <div class="flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg">{m['_settings.show_empty_days']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_empty_days_description']()}</p>
            </div>
            <Toggle 
              toggled={settings.show_empty_days} 
              onclick={() => { settings.show_empty_days = !settings.show_empty_days }} 
              disabled={isSubmitting} 
            />
          </div>

          {#if settings.show_empty_days}
            <div in:fade={{ duration: 100 }} class="pl-4 border-l-2 border-gray-300 flex flex-col gap-1">
              <div class="text-lg">{m['_settings.empty_day_text']()}</div>
              <p class="text-sm text-gray-500">{m['_settings.empty_day_text_description']()}</p>
              <input 
                class="border w-1/2 border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" 
                bind:value={settings.empty_day_text} 
                placeholder={m['_settings.empty_day_text_placeholder']()} 
              />
            </div>
          {/if}

          <div class="flex justify-between items-center gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg">{m['_settings.show_schedule_image']()}</h2>
                <a href="/appearance#image">
                  <LinkIcon class="w-4 h-4 text-gray-500" />
                </a>
              </div> 
              <p class="text-gray-500 text-sm">{m['_settings.show_schedule_image_description']()}</p>
            </div>
            <Toggle 
              toggled={settings.show_schedule_image} 
              onclick={() => { settings.show_schedule_image = !settings.show_schedule_image }} 
              disabled={isSubmitting} 
            />
          </div>

          <!-- <div class="flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg">{m['_settings.show_past_events']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_past_events_description']()}</p>
            </div>
            <Toggle 
              toggled={settings.show_past_events} 
              onclick={() => { settings.show_past_events = !settings.show_past_events }} 
              disabled={isSubmitting} 
            />
          </div> -->

          <div class="flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg">{m['_settings.use_24_hour_time']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.use_24_hour_time_description']()}</p>
            </div>
            <Toggle 
              toggled={settings.use_24_hour_time} 
              onclick={() => { settings.use_24_hour_time = !settings.use_24_hour_time }} 
              disabled={isSubmitting} 
            />
          </div>

          <div class="flex justify-between items-center gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg">{m['_settings.show_social_links']()}</h2>
                <a href="/account#social-links">
                  <LinkIcon class="w-4 h-4 text-gray-500" />
                </a>
              </div>
              <p class="text-gray-500 text-sm">{m['_settings.show_social_links_description']()}</p>
            </div>
            <Toggle 
              toggled={settings.show_social_links} 
              onclick={() => { settings.show_social_links = !settings.show_social_links }} 
              disabled={isSubmitting} 
            />
          </div>

          <div>
            <h2 class="text-lg">{m['_settings.first_day_of_week']()}</h2>
            <p class="text-gray-500 text-sm">{m['_settings.first_day_of_week_description']()}</p>
            <select 
              class="mt-2 border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              bind:value={settings.first_day_of_week}
              disabled={isSubmitting}
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </div>
        
        <div class="container flex-1 mx-auto max-w-8xl p-5  bg-white border border-gray-300 rounded-lg flex flex-col gap-7 relative ">
          <div class="flex justify-between items-center gap-2">
            <div>
              <h2 class="text-lg">{m['_settings.show_logo']()}</h2>
              <p class="text-gray-500 text-sm">{m['_settings.show_logo_description']()}</p>
            </div>
            <div class="flex items-center gap-4">
              <LockIcon class="w-4 h-4 text-gray-500" />
              <Toggle 
                toggled={settings.show_logo} 
                onclick={() => { settings.show_logo = !settings.show_logo }} 
                disabled={true} 
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end pt-5 sticky bottom-0 pb-5 bg-white">
          <button
            type="submit"
            class="focus:shadow-outline rounded bg-purple-400 px-4 py-2 font-bold text-white hover:bg-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out cursor-pointer flex items-cente"
            disabled={isSubmitting} 
          >
            {#if isSubmitting}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              saving...
            {:else}
              save settings
            {/if}
          </button>
        </div>
      </form>
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-500">no schedule settings found. please create a schedule first.</p>
      </div>
    {/if}
  </div>
{/await}