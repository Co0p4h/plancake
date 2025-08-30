<script lang="ts">
	import { deleteUserModal } from "./accountModal.svelte";
  import { m } from '$lib/paraglide/messages.js';
	import { enhance } from "$app/forms";
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';

  let dialog: HTMLDialogElement | undefined = $state();
  let isMouseDownOnDialog = $state(false);
  let isDeleting = $state(false);

  $effect(() => {
    if (deleteUserModal.show && dialog) dialog.showModal();
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

  const enhanceDeleteUser: SubmitFunction = () => {
    isDeleting = true;
    return async ({ result }) => {
      isDeleting = false;
      
      if (result.type === 'redirect') {
        toast.success('Account deleted successfully');
        dialog?.close();
        console.log('what is this location? ', result.location);
        await goto(result.location, { invalidateAll: true });
      } else if (result.type === 'failure' && result.data) {
        const error_message = result.data.error || 'Failed to delete account';
        toast.error(error_message);
      }
    };
  };
</script>

<dialog
  class="rounded-lg mx-auto my-auto p-0 shadow-lg max-w-xl w-full border border-gray-300 bg-white"
  bind:this={dialog}
  onclose={() => (deleteUserModal.show = false)}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={() => (isMouseDownOnDialog = false)}
>
  <form method="POST" action="?/deleteUser" class="space-y-3 p-6" use:enhance={enhanceDeleteUser}>
    <h3 class="text-lg font-semibold text-red-600">
      {m['_account.delete_account_modal_title']()}
    </h3>
    <div class="space-y-3">
      <p class="text-gray-600">
        {m['_account.delete_account_modal_description']()}
      </p>
      <p class="text-gray-600 font-semibold">
        {m['_account.delete_account_modal_confirm']()}
      </p>
    </div>

    <div class="space-y-2 pt-4">
      <button
        type="submit"
        disabled={isDeleting}
        class="focus:shadow-outline w-full rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {#if isDeleting}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {m.deleting()}
        {:else}
          {m['_account.delete_account_modal_button']()}
        {/if}
      </button>
      <button
        type="button"
        onclick={() => dialog?.close()}
        disabled={isDeleting}
        class="focus:shadow-outline w-full rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 focus:outline-none cursor-pointer disabled:opacity-50"
      >
        {m.cancel()}
      </button>
    </div>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>
