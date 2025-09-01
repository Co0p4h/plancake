<script lang="ts">
  import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
  import type { PageProps } from './$types';
	import { page } from '$app/state';

  let { form }: PageProps = $props();

  $effect(() => {
    if (form?.invalid) {
      toast.error(form.message);
    }
  })
</script>

<div class="grid place-items-center min-h-[calc(100vh-12rem)]">
  <form method="POST" action="?/updateUsername" class="flex flex-col gap-5" use:enhance>
    <div class="flex items-center justify-center ">
      <span class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap select-none">{page.url.host}/</span>    
      <input 
        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold rounded focus:border-purple-500 focus:outline-none" 
        type="text" 
        name="username" 
        placeholder="username" 
        style="width: 8ch;"
        autocomplete="off"
        value={form?.username ?? ''} 
        required 
      />
    </div>
    <div class="flex ">
      <button 
        type="submit" 
        class="w-1/2 rounded-full bg-black px-6 py-3 text-base sm:text-lg text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 cursor-pointer transition-all duration-200 ease-in-out">
        continue
      </button>  
    </div>
  </form>
</div>
