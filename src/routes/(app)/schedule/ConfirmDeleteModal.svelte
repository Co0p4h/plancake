<script lang="ts">
	import { deleteModal } from "./modal.svelte";
  import { m } from '$lib/paraglide/messages.js';
	import { enhance } from "$app/forms";

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
  class="rounded-lg mx-auto my-auto p-0 shadow-lg max-w-xl w-full border border-gray-300 bg-white"
  bind:this={dialog}
  onclose={() => (deleteModal.show = false)}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={() => (isMouseDownOnDialog = false)}
>
  <form method="POST" action="?/delete" class="space-y-3 p-6" use:enhance>
    <h3 class="text-lg font-semibold">
      delete event
      {#if deleteModal.item}
        {deleteModal.item.title}?
      {/if}
    </h3>
    <p class="pb-2 text-gray-600">
      are you sure you want to delete this item? this action cannot be undone.
    </p>

    <input type="hidden" name="itemId" value={deleteModal.item?.id} />

    <div class="space-y-2">
      <button
        type="submit"
        class="focus:shadow-outline w-full rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none cursor-pointer"
        onclick={() => dialog?.close()}
      >
        delete
      </button>
      <button
        onclick={() => dialog?.close()}
        formmethod="dialog"
        class="focus:shadow-outline w-full rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 focus:outline-none cursor-pointer"
      >
        cancel
      </button>
    </div>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>
