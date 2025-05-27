<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Eye, EyeOff } from '@lucide/svelte';
  // import 'mingcute_icon/font/Mingcute.css';
  // import { crossfade, draw, fade, scale } from 'svelte/transition';

  let showPassword = $state('password');
  // let showPasswordText = $state('eye_line');
  let showPasswordText = $state(false);

  function toggleShowPassword(e: Event) {
    e.preventDefault();
    showPassword = showPassword === 'password' ? 'text' : 'password';
    // showPasswordText = showPasswordText === 'eye_line' ? 'eye_close_line' : 'eye_line';
    showPasswordText = !showPasswordText;
  }
</script>

<div class="flex h-[calc(100vh-24rem)] flex-col items-center justify-center gap-y-4">
  <div class="w-full max-w-md">
    <h1 class="mb-8 text-center text-2xl font-semibold">login</h1>
    <form method="POST" class="space-y-4" use:enhance>
      <div class="">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="email"
          type="email"
          placeholder="email"
          value={page.form?.email ?? ''}
          required
        />
      </div>

      <div class="relative flex flex-col items-center justify-center">
        <input
          class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          name="password"
          placeholder="password"
          type={showPassword}
          spellcheck="false"
          value
          required
        />
        <button
          aria-label="show_password_button"
          class="absolute right-3 text-sm"
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
      <button
        type="submit"
        class="w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 focus:outline-none"
      >
        login
      </button>
      {#if page.form?.error}
        <span class="error text-red-500">{page.form.error}</span>
      {/if}
    </form>
  </div>
  <div class="flex flex-col items-center justify-center gap-2 text-center text-sm">
    <p class="">
      by creating an account you agree to our <a class="text-blue-500" href="terms">
        terms of service.
      </a>
    </p>
    <p>don't have an account? <a class="text-blue-500" href="signup">signup</a></p>
  </div>
</div>
