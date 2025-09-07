<script lang="ts">
	import { deleteModal } from "./modal.svelte";
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale } from "$lib/paraglide/runtime.js"
	import { enhance } from "$app/forms";
	import { X } from "@lucide/svelte";

  let dialog: HTMLDialogElement | undefined = $state();
  let isMouseDownOnDialog = $state(false);

  $effect(() => {
    if (deleteModal.show && dialog) dialog.showModal();
  });

  function handleMouseDown(e: MouseEvent) {
    if (e.target === dialog) {
      isMouseDownOnDialog = true;
    }
  }

  function handleMouseUp(e: MouseEvent) {
    if (e.target === dialog && isMouseDownOnDialog) {
      dialog?.close();
    }
    isMouseDownOnDialog = false;
  }
</script>

<dialog
  class="rounded-lg mx-auto my-auto p-0 shadow-lg max-w-xl w-full border border-gray-300 bg-white backdrop:backdrop-blur-xs"
  bind:this={dialog}
  onclose={() => (deleteModal.show = false)}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={() => (isMouseDownOnDialog = false)}
>
  <form method="POST" action="?/delete" class="space-y-3 p-6" use:enhance>
    <div class="flex justify-between">
      <h3 class="text-lg font-semibold">
        {#if deleteModal.item}
          {getLocale() === 'ja' ? `${deleteModal.item.title}${m.delete_item()}` : `${m.delete_item()} "${deleteModal.item.title}"?`}
        {/if} 
      </h3>
      <button
        type="button"
        class="cursor-pointer" 
        onclick={() => {
          dialog?.close();
        }}
      >
        <X color={"gray"} />
      </button>
    </div>
    <p class="pb-2 text-gray-600">
      {m.confirm_delete()}
    </p>

    <input type="hidden" name="itemId" value={deleteModal.item?.id} />

    <div class="flex justify-end gap-2">
      <button
        onclick={() => dialog?.close()}
        type="button"
        class="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 focus:outline-none cursor-pointer"
      >
        {m.cancel()}
      </button>
      <button
        type="submit"
        class="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none cursor-pointer"
        onclick={() => dialog?.close()}
      >
        {m.delete()}
      </button>
    </div>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>
