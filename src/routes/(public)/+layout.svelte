<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-purple-background">
	<Header />
	
	<div class="flex flex-1 flex-col p-4 relative">
		{@render children()}
	</div>
</div>

<Footer />