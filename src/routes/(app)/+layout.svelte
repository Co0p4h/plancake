<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

</script>

<div class="min-h-screen flex flex-col bg-purple-background">
	<Header />
	
	<div class="flex flex-1 flex-col p-4">
		{@render children()}
	</div>
</div>

<Footer />
