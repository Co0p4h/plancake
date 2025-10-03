<script lang="ts">
	import { enhance } from '$app/forms';
  import { formatDateTimeLocal } from '$lib/utils/date';
  import { editModal } from './modal.svelte';
  import { m } from '$lib/paraglide/messages.js';
	import { X } from '@lucide/svelte';

  let dialog: HTMLDialogElement | undefined = $state();
  let isMouseDownOnDialog = $state(false);
  let isSubmitting = $state(false);

  let { timezone } = $props();

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
  <form method="POST" action="?/update" class="space-y-4 p-6" use:enhance>
    <input type="hidden" name="id" value={editModal.item?.id ?? ''} />
    <!-- timezone (we are just automatically detecting it for now, not using the user setting, it can easily be changed by add timezone ?? though.) -->
    <input
      type="hidden"
      name="timezone"
      value={Intl.DateTimeFormat().resolvedOptions().timeZone} 
    />

    <div class="grid gap-4">
      <div class="flex justify-between">
        <h3 class="text-lg font-semibold">
          {m['update_item']()}
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
      <label class="text-sm text-gray-700" for="title">
        <p class="mb-1">{m['_item_properties.title']()}</p>
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="title"
          id="title"
          type="text"
          maxlength="50"
          required
          value={editModal.item?.title ?? ''}
        />
      </label>

      <!-- time section -->
      <div class="flex justify-between gap-4">
        <div class="flex-1">
          <label class="block text-sm text-gray-700" for="start_time">
            <p class="mb-1">{m['_item_properties.start_time']()}</p>
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
          <label class="block text-sm text-gray-700" for="end_time">
            <p class="mb-1">{m['_item_properties.end_time']()}</p>
          </label>
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
        <p class="mb-1">{m['_item_properties.description']()}</p>
        <textarea
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none resize-none"
          name="description"
          id="description"
          maxlength="100"
          rows={4}
          value={editModal.item?.description ?? ''}
        ></textarea>
      </label>

      <label class="block text-sm text-gray-700" for="external_url">
        <p class="mb-1">{m['_item_properties.url']()}</p>
        <input
          class="focus:shadow-outline w-full appearance-none rounded border-gray-300 border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
          name="external_url"
          id="external_url"
          type="external_url"
          value={editModal.item?.externalUrl ?? ''}
        />
      </label>
      <div class="flex justify-end gap-2">
        <button
          onclick={() => {
            dialog?.close();
          }}
          type="button"
          class="focus:shadow-outline rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none cursor-pointer"
        >
          {m.cancel()}
        </button>
        <button
          type="submit"
          class="focus:shadow-outline rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none cursor-pointer"
          disabled={isSubmitting}
          onclick={() => dialog?.close()}
        >
          {isSubmitting ? m.updating_item(): m.update_item()}
        </button>
      </div>
    </div>
    </form>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>
