<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import { Eye, EyeOff } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';
  // import 'mingcute_icon/font/Mingcute.css';

  let showPassword = $state('password');
  // let showPasswordText = $state('eye_line');
  let showPasswordText = $state(false);
  let username = $state('');

  function toggleShowPassword(e: Event) {
    e.preventDefault();
    showPassword = showPassword === 'password' ? 'text' : 'password';
    // showPasswordText = showPasswordText === 'eye_line' ? 'eye_close_line' : 'eye_line';
    showPasswordText = !showPasswordText;
  }

  onMount(() => {
    const urlUsername = page.url.searchParams.get('username');
    if (urlUsername) {
      username = urlUsername;
    }
  });
</script>

<div class="flex h-[calc(100vh-24rem)] flex-col items-center justify-center gap-y-4">
  <div class="w-full max-w-md">
    <h1 class="mb-8 text-center text-2xl font-semibold">sign up</h1>
    <form method="POST" class="space-y-4" use:enhance>
      <div class="">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="email"
          type="email"
          placeholder="email"
          value={page.form?.email ?? ''}
          autocomplete="email"
          required
        />
      </div>

      <div class="relative flex flex-col items-center justify-center">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="password"
          placeholder="password"
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
          placeholder="username"
          value={username ?? page.form?.username ?? ''}
          required
        />
      </div>

      <button
        type="submit"
        class="w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 focus:outline-none cursor-pointer"
      >
        sign up
      </button>
      {#if page.form?.error}
        <span class="error text-red-500">{page.form.error}</span>
      {/if}
    </form>
  </div>
  <div class="flex flex-col items-center justify-center gap-2 text-center text-sm">
    <p>already have an account? <a class="text-blue-500" href="login">log in</a></p>
  </div>
</div>
