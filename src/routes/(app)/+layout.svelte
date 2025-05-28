<script lang="ts">
	import Header from './Header.svelte';

	// console.log("(app) layout");

	let { children } = $props();
</script>

<Header />

<div class="flex flex-1 flex-col p-4">
	{@render children()}
</div>

<footer class="flex flex-col items-center justify-center p-3">
	<p>
		visit <a class="font-bold" href="https://coopa.me/about">coopa</a> to learn about plancake
	</p>
</footer>