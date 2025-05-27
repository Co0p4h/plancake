<!-- src/routes/[user]/+error.svelte -->
<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="my-auto flex items-center justify-center min-h-svh">
  <div class="text-center">
    {#if page.status === 404}
      <h1 class="text-4xl font-bold mb-4">{page.error?.message}</h1>
      <p class="text-gray-600 mb-6">
        want this to be your username? 
        <a class="underline text-gray-700" href={`/signup?username=${page.params?.user}`}>
          create your schedule now.
        </a>
      </p>
    {:else}
      <h1 class="text-4xl font-bold mb-4">oops!</h1>
      <p class="text-gray-600 mb-6">
          something went wrong while loading the schedule.
      </p>
      <h1 class="text-4xl font-bold mb-4">{page.error?.message}</h1>
      <h1 class="text-4xl font-bold mb-4">{page.status}</h1>
    {/if}

    <a
        href="/"
        class="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
    >
        home
    </a>
  </div>
</div>
