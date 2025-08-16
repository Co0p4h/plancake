<script lang="ts">
  // import type { SocialLink } from '$lib/types-example';

  let { socialLinks = $bindable() }: { socialLinks: any[]} = $props();
  // let socialLinks: any[] = $state(data.socialLinks);
  let hasEmptyPair = $state(false);

  // console.log('social links data', data.socialLinks);

  function addLink() {
    if (hasEmptyPair) return;
    socialLinks = [...socialLinks, { platform: '', url: '' }];
    hasEmptyPair = true;
  }

  function removeLink(index: number) {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    socialLinks = newLinks;
    hasEmptyPair = newLinks.some((pair) => !pair.platform || !pair.url);
  }

  function handleKeyChange(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const newLinks = [...socialLinks];
    newLinks[index].platform = target.value;
    socialLinks = newLinks;
    checkEmptyPairs();
  }

  function handleValueChange(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const newLinks = [...socialLinks];
    newLinks[index].url = target.value;
    socialLinks = newLinks;
    checkEmptyPairs();
  }

  function checkEmptyPairs() {
    hasEmptyPair = socialLinks.some((pair) => !pair.platform || !pair.url);
  }
</script>

<input type="hidden" name="socialLinks" value={JSON.stringify(socialLinks)} />
{#if socialLinks}
  <div class="space-y-3">
    {#each socialLinks as { platform, url }, index (index)}
      <div class="flex gap-x-3 items-end">
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1" for="platform-{index}">Link Title</label>
          <input
            id="platform-{index}"
            type="text"
            class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={platform}
            placeholder="Enter title"
            required
            oninput={(e) => handleKeyChange(index, e)}
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1" for="url-{index}">URL</label>
          <input
            id="url-{index}"
            type="url"
            class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={url}
            placeholder="Enter URL"
            required
            oninput={(e) => handleValueChange(index, e)}
          />
        </div>
        <button
          type="button"
          class="rounded-md bg-red-500 text-white px-4 py-2 transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
          onclick={() => removeLink(index)}>
          Remove
        </button>
      </div>
    {/each}
  </div>
{/if}
<div class="flex gap-x-3 mt-4">
  <button
    type="button"
    onclick={addLink}
    class="rounded-md bg-purple-400 px-4 py-2 text-white transition-all duration-200 hover:bg-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
    disabled={hasEmptyPair}>
    + Add Link
  </button>
  <!-- <button
    type="submit"
    formaction="?/updateSocialLinks"
    class="rounded-md bg-purple-400 px-4 py-2 text-white transition-all duration-200 hover:bg-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer">
    Save
  </button> -->
</div>
