<script lang="ts">
	import { formatDateTimeLocal } from '$lib/utils/date';
  import { addModal } from './modal.svelte';
  import { m } from '$lib/paraglide/messages.js';
	import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);

  let dialog: HTMLDialogElement | undefined = $state();
  let isSubmitting = $state(false);
  let isMouseDownOnDialog = $state(false);

  $effect(() => {
    if (addModal.show && dialog) dialog.showModal();
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
  class="rounded-lg mx-auto my-auto p-0 shadow-lg max-w-2xl w-full border border-gray-300 bg-white"
  bind:this={dialog}
  onclose={() => (addModal.show = false)}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={() => (isMouseDownOnDialog = false)}
>
  <form method="POST" action="?/add" class="space-y-2 p-6">
    <div class=" grid gap-4">
      <label class="text-sm text-gray-700" for="title">
        <p class="mb-1">title</p>
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="title"
          id="title"
          type="text"
          maxlength="50"
          required
        />
      </label>

      <!-- time section -->
      <div class="flex justify-between gap-4">
        <div class="flex-1">
          <label class="block text-sm text-gray-700" for="start_time">
            <p class="mb-1">start time</p>
          </label>
          <input
            class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border p-2 leading-tight text-gray-700 focus:outline-none"
            name="start_time"
            id="start_time"
            type="datetime-local"
            required
            value={formatDateTimeLocal(addModal.initialDate)}
            />
        </div>
        <div class="flex-1">
          <label class="block text-sm text-gray-700" for="end_time">
            <p class="mb-1">end time</p>
          </label>
          <input
            class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border p-2 leading-tight text-gray-700 focus:outline-none"
            name="end_time"
            id="end_time"
            type="datetime-local"
          />
        </div>
      </div>

      <label class="text-sm text-gray-700" for="description">
        <p class="mb-1">description</p>
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="description"
          id="description"
          type="text"
          maxlength="100"
        />
      </label>

      <label class="block text-sm text-gray-700" for="external_url">
        <p class="mb-1">url</p>
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="external_url"
          id="external_url"
          type="external_url"
        />
      </label>
    </div>
    <button
      type="submit"
      class="focus:shadow-outline w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'adding...' : 'add item'}
    </button>
    <button
      onclick={() => {
        dialog?.close();
      }}
      formmethod="dialog"
      class="focus:shadow-outline w-full rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none cursor-pointer"
    >
      cancel
    </button>
  </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>