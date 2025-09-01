<script lang="ts">
	import { page } from '$app/state';
	import { goto } from "$app/navigation";
	import { Link, LogOut, Settings } from "@lucide/svelte";
	import toast from "svelte-french-toast";
  let { menuOpen = $bindable() } = $props();

  let menuElement: HTMLDialogElement | undefined = $state();
  let isMouseDownOnMenu = $state(false);

  $effect(() => {
    if (menuOpen && menuElement) menuElement.showModal();
  });

  function handleMouseDown(e: MouseEvent) {
    if (e.target === menuElement) {
      isMouseDownOnMenu = true;
    }
  }

  function handleMouseUp(e: MouseEvent) {
    if (e.target === menuElement && isMouseDownOnMenu) {
      menuElement?.close();
    }
    isMouseDownOnMenu = false;
  }
</script>

<dialog 
  bind:this={menuElement}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  class="rounded-lg border border-gray-300 bg-white z-10 px-4 py-3 shadow-lg top-12 right-8 ml-auto backdrop:bg-transparent"
  tabindex="0"
  onclick={() => {
    menuOpen = false;
  }}
>	
  <div class="hover:bg-gray-100 items-center gap-x-2 px-2 py-1 flex rounded-md duration-200">
    <a href="/account" class="w-full flex items-center gap-2">
      <Settings size={20} />
      account settings
    </a>
  </div>
  <div class="hover:bg-gray-100 items-center gap-x-2 px-2 py-1 flex rounded-md duration-200 ">
    <a href={`/${page.data.user.username}`} class="w-full flex items-center gap-2">
      <Link size={20} />
      {page.data.user.username}
    </a>
  </div>
  <div class="text-red-500 hover:bg-gray-100 flex items-center gap-x-2 rounded-md px-2 py-1 text-left duration-200">
    <button 
      class="flex items-center gap-2 cursor-pointer w-full" 
      onclick={async () => {
        const response = await fetch("/logout", { method: "POST" });

        if (response.ok) {
          toast.success("logout successful");
          await goto("/", { invalidateAll: true });
        } else {
            toast.error("logout failed");
        }
      }}>
      <LogOut size={18} />
      logout
    </button>
  </div>
</dialog>