<script lang="ts">
  import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  $effect(() => {
    if (form?.invalid) {
      toast.error(form.message);
    }
  })
</script>

<form method="POST" action="?/updateUsername" class="space-y-4" use:enhance>
  <input type="text" name="username" placeholder="Choose a username" class="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none" value={form?.username ?? ''} required />
  <button type="submit" class="w-full rounded bg-purple-600 px-3 py-2 text-white hover:bg-purple-700 focus:outline-none cursor-pointer">set username</button>  
</form>