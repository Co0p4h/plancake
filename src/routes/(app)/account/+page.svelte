<script lang="ts">
	import SocialLinks from './SocialLinks.svelte';
	import ConfirmDeleteUserModal from './ConfirmDeleteUserModal.svelte';
	import ChangeUsernameModal from './UpdateUsernameModal.svelte';
	import { updateUsernameModal, deleteUserModal } from './accountModal.svelte';
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import type { AllUserSettings } from '$lib/server/db/schema';
	import { page } from '$app/state';
	import { localeToLanguage } from '$lib/utils/format';

  let { data } = $props();

  let isSubmitting = $state(false);

  let username = $derived(data.user.username);

  let settings: AllUserSettings = $state({
    display_name: '',
    language: 'en', // not using this for now, using paraglide runtime instead...
    timezone: '',
    social_links: [{platform: '', url: ''}],
    discord_webhook: '',
  });

  $effect(() => {
    if (data.streamed.user_settings) {
      data.streamed.user_settings.then((result) => {
        console.log('loaded user settings:', result);
        
        if (result.settings && result.user.display_name) {
          settings =  { ...result.settings, display_name: result.user.display_name };
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
        // const { updated_settings, languageChanged } = result.data;
        const { updated_settings } = result.data;
        if (updated_settings) {
          // if (languageChanged) {
          //   setLocale(updated_settings.user_settings.language);
          // }
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
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative min-h-screen">
    <div class="flex items-center justify-center h-32">
      <div class="text-gray-500">Loading user settings...</div>
    </div>
  </div>
{:then user_settings}
  <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg relative">
    <h1 class="mb-4 text-xl text-gray-500">{m['_account.account']()}</h1>
    
    <form method="POST" action="?/updateUserSettings" use:enhance={enhance_form} class="space-y-7">
      <input type="hidden" name="user_settings" value={JSON.stringify(settings)} />

      <div class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
        <div>
          <h2 class="text-lg">{m['_account.display_name']()}</h2>
          <input placeholder={m['_account.display_name_placeholder']()} name="display_name" id="display_name" class="mt-2 rounded-md border-1 border-gray-300 p-2" bind:value={settings.display_name} disabled={isSubmitting} required />
        </div>

        <!-- <div>
          <h2 class="text-lg">{m['_account.language']()}</h2>
          <p class="text-gray-500 text-sm">Current: {getLocale()}</p>
          <select name="language" id="language" class="mt-2 rounded-md border-1 border-gray-300 p-2" value={getLocale()} 
            onchange={(e: Event) => {
              setLocale((e.target as HTMLSelectElement).value as "en" | "ja")
            }}
          >
            {#each locales as locale}
              <option value={locale} selected={locale === getLocale()}>{localeToLanguage(locale)}</option>
            {/each}
          </select>
        </div> -->

        <div>
          <h2 class="text-lg">{m['_account.timezone']()}</h2>
          <p class="text-gray-500 text-sm">Current: {settings.timezone}</p>
          <select name="timezone" id="timezone" class="mt-2 rounded-md border-1 border-gray-300 p-2" bind:value={settings.timezone}>
            {#each Intl.supportedValuesOf('timeZone') as tz}
              <option value={tz}>{tz}</option>
            {/each}
          </select>
        </div>

        <div class="flex gap-1 justify-between items-center">
          <div>
            <h2 class="text-lg">{m['_account.username']()}</h2>
            <p class="text-gray-500 text-sm">{m['_account.username_description']()}</p>
            <div class="flex items-center gap-1 mt-2">
              <p>{page.url.host}/</p>
              <!-- <input placeholder={m['_account.username']()} name="username" id="username" class="rounded-md border-1 border-gray-300 p-2" bind:value={username} disabled={isSubmitting} /> -->
              <p class="text-gray-500">{username}</p>
            </div>
          </div>
          <button class="mt-2 rounded-md border-1 border-gray-500 r-2 cursor-pointer px-5 py-2 bg-white text-gray-500 hover:bg-gray-200 transition-all duration-200 ease-in-out h-fit"
            type="button"
            onclick={() => {
              updateUsernameModal.show = true
              updateUsernameModal.username = username;
            }}
          >
            {"change"}
          </button>
        </div>

        <!-- <div>
          <h2 class="text-lg">{m['_account.discord_webhook']()}</h2>
          <p class="text-gray-500 text-sm">Configure Discord webhook for notifications</p>
          <textarea name="discord_webhook" id="discord_webhook" class="mt-2 rounded-md border-1 border-gray-300 p-2 w-full h-24 resize-none" bind:value={settings.discord_webhook}></textarea>
        </div> -->
      </div>

      <div id="social-links" class="container flex-1 mx-auto max-w-8xl p-5 bg-white border border-gray-300 rounded-lg flex flex-col gap-7 mb-6">
        <div>
          <h2 class="text-lg">{m['_account.social_links']()}</h2>
          <p class="text-gray-500 text-sm">{m['_account.manage_your_social_links']()}</p>
          <div class="mt-2">
            <SocialLinks bind:socialLinks={settings.social_links} />
          </div>
        </div>
      </div>

      <div class="container max-w-8xl p-5 bg-white border border-gray-300 rounded-lg ">
        <div>
          <h2 class="text-lg">{m['_account.delete_account']()}</h2>
          <p class="text-gray-500 text-sm">{m['_account.delete_account_description']()}</p>
          <button 
            type="button"
            onclick={() => (deleteUserModal.show = true)}
            class="mt-2 rounded-md border-2 cursor-pointer p-2 bg-red-500 text-white hover:bg-red-600 transition-all duration-200 ease-in-out"
          >
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

<ConfirmDeleteUserModal />
<ChangeUsernameModal />