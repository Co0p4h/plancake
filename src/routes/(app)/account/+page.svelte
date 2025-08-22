<script lang="ts">
	import SocialLinks from './SocialLinks.svelte';
	import { setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import type { UserSettings } from '$lib/server/db/schema';
	import { page } from '$app/state';

  let { data } = $props();

  let isSubmitting = $state(false);

  let username = $state(data.user.username);
  let display_name = $state('');

  let settings: UserSettings = $state({
    language: 'en',
    timezone: 'Asia/Tokyo',
    social_links: [{platform: '', url: ''}],
    discord_webhook: '',
  });

  $effect(() => {
    if (data.streamed.user_settings) {
      data.streamed.user_settings.then((result) => {
        if (result && result) {
          settings =  result;
          console.log('settings loaded:', settings);
        }
      });
    }
  });

  const enhance_form: SubmitFunction = ({ formData, action }) => {
    isSubmitting = true;
    return async ({ result }) => {
      isSubmitting = false;

      if (result.type == "success" && result.data) {
        const updated_settings = await result.data.updated_settings;
        if (updated_settings) {
          setLocale(updated_settings.language)
          toast.success('user settings updated successfully!');
        }
      } else if (result.type == "failure" && result.data) { 
        const error_message = result.data.error || 'an unexpected error occurred';
        toast.error(error_message);
      }
    }
  }
</script>

{#await data.streamed.user_settings}
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
    <div class="flex items-center justify-center h-32">
      <div class="text-gray-500">Loading user settings...</div>
    </div>
  </div>
{:then user_settings}
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
    <h1 class="mb-4 text-xl text-gray-500">{m['_account.account']()}</h1>
    
    <form method="POST" action="?/updateUserSettings" use:enhance={enhance_form} class="space-y-7">
      <input type="hidden" name="language" value={settings.language} />
      <input type="hidden" name="timezone" value={settings.timezone} />
      <input type="hidden" name="discord_webhook" value={settings.discord_webhook} />
      <input type="hidden" name="social_links" value={JSON.stringify(settings.social_links)} />

      <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
        <div>
          <h2 class="text-lg">{m['_account.display_name']()}</h2>
          <input placeholder={m['_account.display_name_placeholder']()} name="display_name" id="display_name" class="mt-2 rounded-md border-1 border-gray-300 p-2" bind:value={display_name} disabled={isSubmitting} />
        </div>

        <div>
          <h2 class="text-lg">{m['_account.language']()}</h2>
          <p class="text-gray-500 text-sm">Current: {settings.language}</p>
          <select name="language" id="language" class="mt-2 rounded-md border-1 border-gray-300 p-2" bind:value={settings.language}>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        <div>
          <h2 class="text-lg">{m['_account.timezone']()}</h2>
          <p class="text-gray-500 text-sm">Current: {settings.timezone}</p>
          <select name="timezone" id="timezone" class="mt-2 rounded-md border-1 border-gray-300 p-2" bind:value={settings.timezone}>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>

        <div>
          <h2 class="text-lg">{m['_account.username']()}</h2>
          <p class="text-gray-500 text-sm">{m['_account.username_description']()}</p>
          <div class="flex items-center gap-1 mt-2">
            <p>{page.url.host}/</p>
            <input placeholder={m['_account.username']()} name="username" id="username" class="rounded-md border-1 border-gray-300 p-2" bind:value={username} disabled={isSubmitting} />
          </div>
        </div>

        <!-- <div>
          <h2 class="text-lg">{m['_account.discord_webhook']()}</h2>
          <p class="text-gray-500 text-sm">Configure Discord webhook for notifications</p>
          <textarea name="discord_webhook" id="discord_webhook" class="mt-2 rounded-md border-1 border-gray-300 p-2 w-full h-24 resize-none" bind:value={settings.discord_webhook}></textarea>
        </div> -->
      </div>

      <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
        <div>
          <h2 class="text-lg">{m['_account.social_links']()}</h2>
          <p class="text-gray-500 text-sm">Manage your social media links</p>
          <div class="mt-2">
            <SocialLinks bind:socialLinks={settings.social_links} />
          </div>
        </div>
      </div>

      <div class="container max-w-8xl p-5 bg-white border border-gray-300 rounded-lg ">
        <div>
          <h2 class="text-lg">{m['_account.delete_account']()}</h2>
          <p class="text-gray-500 text-sm">This action cannot be undone</p>
          <button type="button" class="mt-2 rounded-md border-2 cursor-pointer p-2 bg-red-500 text-white hover:bg-red-600 transition-all duration-200 ease-in-out">
            {m['_account.delete_account']()}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end pt-5 sticky bottom-0 pb-5 bg-white">
        <button
          type="submit"
          class="focus:shadow-outline rounded bg-purple-400 px-4 py-2 font-bold text-white hover:bg-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out cursor-pointer flex items-center"
          disabled={isSubmitting} 
        >
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            saving...
          {:else}
            save changes
          {/if}
        </button>
      </div>
    </form>
  </div>
{/await}