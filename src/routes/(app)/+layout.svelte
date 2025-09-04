<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		console.log('wah2');
		if (!document.startViewTransition) return;

		console.log('wah');

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

</script>

<Header />

<div class="flex flex-1 flex-col p-4">
	{@render children()}
</div>

<Footer />