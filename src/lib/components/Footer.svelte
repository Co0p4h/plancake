<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';
	import { localeToLanguage } from "$lib/utils/format";
</script>

<!-- <footer class="flex flex-col items-center justify-center p-3 z-10">
  <p>
    visit <a class="font-bold" href="https://coopa.me/about">coopa</a> to learn about plancake
  </p>
</footer> -->

<footer class="bg-white rounded-lg shadow-sm z-10">
  <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <a href="/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
        <!-- <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" /> -->
        <h1 class="text-2xl font-black">P.</h1>
        
        <span class="self-center text-2xl font-semibold whitespace-nowrap">plancake</span>
      </a>
      <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
        <li>
          <a href="/about" class="hover:underline me-4 md:me-6">{m['_navigation.about']()}</a>
        </li>
        <li>
          <a href="/privacy-policy" class="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
          <a href="/terms-of-service" class="hover:underline me-4 md:me-6">Terms</a>
        </li>
        <li>
          <a href="/contact" class="hover:underline">Contact</a>
        </li>
      </ul>
      <div class="flex mb-6">
        <!-- <p class="text-gray-500 text-sm">{getLocale()}</p> -->
        <select name="language" id="language" class="mt-2 rounded-md border-1 border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-default focus:border-purple-default" value={getLocale()} 
          onchange={(e: Event) => {
            setLocale((e.target as HTMLSelectElement).value as "en" | "ja")
          }}
        >
          {#each locales as locale}
            <option value={locale} selected={locale === getLocale()}>{localeToLanguage(locale)}</option>
          {/each}
        </select>
      </div>
    </div>
    <hr class="my-4 border-gray-200 sm:mx-auto" />
    <span class="block text-sm text-gray-500 sm:text-center ">© 2023 <a href="/" class="hover:underline">plancake™</a>. All Rights Reserved.</span>
  </div>
</footer>

