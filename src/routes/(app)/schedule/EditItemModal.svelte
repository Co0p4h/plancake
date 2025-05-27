<script lang="ts">
  import { formatDateTimeLocal } from '$lib/utils/date';
  import { editModal } from './modal.svelte';

  let dialog: HTMLDialogElement | undefined = $state();
  let isMouseDownOnDialog = $state(false);

  $effect(() => {
    if (editModal.show && dialog) dialog.showModal();
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
  onclose={() => (editModal.show = false)}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmouseleave={() => (isMouseDownOnDialog = false)}
>
  <form method="POST" action="?/update" class="space-y-4 p-6">
    <input type="hidden" name="id" value={editModal.item?.id ?? ''} />
    <div class="grid gap-4">
      <label class="text-sm text-gray-700" for="title">
        title
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="title"
          id="title"
          type="text"
          required
          value={editModal.item?.title ?? ''}
        />
      </label>

      <!-- time section -->
      <div class="flex justify-between gap-4">
        <div class="flex-1">
          <label class="block text-sm text-gray-700" for="start_time">
            start time
          </label>
          <input
            class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border p-2 leading-tight text-gray-700 focus:outline-none"
            name="start_time"
            id="start_time"
            type="datetime-local"
            required
            value={formatDateTimeLocal(editModal.item?.startTime)}
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm text-gray-700" for="end_time"> end time </label>
          <input
            class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border p-2 leading-tight text-gray-700 focus:outline-none"
            name="end_time"
            id="end_time"
            type="datetime-local"
            value={formatDateTimeLocal(editModal.item?.endTime)}
          />
        </div>
      </div>

      <label class="text-sm text-gray-700" for="description">
        description
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="description"
          id="description"
          type="text"
          maxlength="100"
          value={editModal.item?.description ?? ''}
        />
      </label>

      <label class="block text-sm text-gray-700" for="external_url">
        url
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="external_url"
          id="external_url"
          type="external_url"
          value={editModal.item?.externalUrl ?? ''}
        />
      </label>
    </div>
    <button
      type="submit"
      class="focus:shadow-outline w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none cursor-pointer"
    >
      update item
    </button>
    <button
      onclick={() => {
        dialog?.close();
      }}
      type="submit"
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
