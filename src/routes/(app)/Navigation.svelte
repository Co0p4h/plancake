<script lang="ts">
	interface Link {
		href: string;
		label: string;
		current?: boolean;
	}
	
	let { links }: { links: Link[] } = $props();
</script>

<nav class="hidden md:block text-md">
	<ul class="flex justify-center items-center gap-2">
		{#each links as link}
			<li class="py-1 px-4" aria-current={link.current ? 'page' : undefined}>
				<a href={link.href}>{link.label}</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	li[aria-current='page'] {
		background-color: #8c00ff26;
		border-radius: 5px;
		color: #8C00FF;
	}
</style>
