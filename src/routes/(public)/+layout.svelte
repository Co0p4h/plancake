<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<Header />

<div class="flex flex-1 flex-col p-4 relative">
	{@render children()}
</div>

<Footer />