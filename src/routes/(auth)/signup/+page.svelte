<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import { Eye, EyeOff, Twitch } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import type { PageProps, Snapshot } from './$types';
	import dayjs from 'dayjs';

  let { form }: PageProps = $props();

  let showPassword = $state('password');
  let showPasswordText = $state(false);

  let formData = $state({
    username: '',
    email: '',
  })

  export const snapshot: Snapshot = {
		capture: () => formData,
		restore: (value) => formData = value
	};

  function toggleShowPassword(e: Event) {
    e.preventDefault();
    showPassword = showPassword === 'password' ? 'text' : 'password';
    showPasswordText = !showPasswordText;
  }

  onMount(() => {
    const urlUsername = page.url.searchParams.get('username');
    if (urlUsername) {
      formData.username = urlUsername;
    }
  });

  $effect(() => {
    if (form?.invalid) {
      toast.error(form.message);
    }
  })
</script>

<div class="flex min-h-[calc(100vh-24rem)] flex-col items-center justify-center gap-y-4 px-4 py-8 sm:py-12">
  <div class="w-full max-w-md">
    <h1 class="mb-8 mt-4 text-center text-2xl font-semibold sm:mt-0">{m['_auth.signup.title']()}</h1>
    <form method="POST" class="space-y-4" use:enhance>
      <input type="hidden" name="timezone" value={dayjs.tz.guess()} />
      <div class="">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="email"
          type="email"
          placeholder={m['_auth.signup.email']()}
          autocomplete="email"
          required
          bind:value={formData.email}
        />
          <!-- value={formData.email ?? page.form?.email ?? ''} -->
      </div>

      <div class="relative flex flex-col items-center justify-center">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="password"
          placeholder={m['_auth.signup.password']()}
          type={showPassword}
          autocomplete="new-password"
          spellcheck="false"
          value
          required
          />
          <!-- minlength="8" -->
        <button
          aria-label="show_password_button"
          class="absolute right-3 text-sm cursor-pointer"
          onclick={toggleShowPassword}
          type="button"
        >
          {#if showPasswordText}
            <EyeOff size={20} />
          {:else}
            <Eye size={20} />
          {/if}
        </button>
      </div>

      <div class="">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="username"
          type="text"
          placeholder={m['_auth.signup.username']()}
          required
          bind:value={formData.username}
          />
          <!-- value={formData.username ?? page.form?.username ?? ''} -->
      </div>

      <button
        type="submit"
        class="w-full rounded bg-purple-500 px-4 py-2 font-medium text-white hover:bg-purple-700 focus:outline-none cursor-pointer"
      >
        {m['_auth.signup.button']()}
      </button>

      <div class="flex items-center justify-center gap-4">
        <div class="h-px w-full bg-gray-300"></div>
        <p class="text-center text-gray-500">or</p>
        <div class="h-px w-full bg-gray-300"></div>
      </div>

      <a href="/login/google" 
      class="w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 focus:outline-none cursor-pointer justify-center items-center flex"
      >
        <svg class="mr-3 h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
        {m['_auth.login.google_button']()}
      </a>
      <a href="/login/twitch" 
      class="w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 focus:outline-none cursor-pointer justify-center items-center flex"
      >
        <Twitch class="mr-3" />
        {m['_auth.login.twitch_button']()}
      </a>
    </form>
  </div>
  <div class="flex flex-col items-center justify-center gap-2 text-center text-sm">
    <p class="">
      {m['_auth.signup.agree_to_terms_of_service']({terms_of_service: m['_auth.signup.terms_of_service']()})} <a class="text-blue-500" href="terms-of-service">
        {m['_auth.signup.terms_of_service']()}
      </a>
    </p>
    <p>{m['_auth.signup.already_have_account']()} <a class="text-blue-500" href="login">{m['_auth.signup.login']()}</a></p>
  </div>
</div>
