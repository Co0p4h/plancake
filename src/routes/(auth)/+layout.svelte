<script lang="ts">
  let { children } = $props();
</script>

<div class="min-h-svh flex flex-col bg-purple-background">
  <header class="flex mt-4 mx-8 items-center justify-between">
    <div class="flex items-center">
			<h1 class="text-2xl font-black">
				<a href="/">P.</a>
			</h1>
			<span class="ml-4 select-none rounded bg-purple-400 px-2 py-1 text-xs text-white hidden sm:block">
				now in beta!
			</span>
    </div>
  </header>
  <div class="flex flex-1 flex-col p-4 z-10">
    {@render children()}
  </div>
</div>
<div class="h-1/2 showcase-gradient fixed bottom-0 left-0 w-full"></div>

<style>
  .showcase-gradient {
		background-image: linear-gradient(180deg,#fafafa 0,hsla(0,0%,98%,0) 50%),
											radial-gradient(51% 51% at -11% 9%,#8c00ffa1 1%,#ff57dd00 100%),
											radial-gradient(51% 67% at 115% 96%,#8c00ffa1 0,#ff57dd00 100%),
											radial-gradient(50% 66% at 50% 50%,#e9d5ffa3 0,#ff57dd00 100%),
											radial-gradient(22% 117% at 2% 87%,#00f3ba00 20%,#e9d5ffa3 100%),
											linear-gradient(0deg,#61cdffa3,#61cdffa3);
		}
</style>