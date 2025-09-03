<script lang="ts">
	interface Link {
		href: string;
		label: string;
		current?: boolean;
	}
	
	let { links }: { links: Link[] } = $props();
</script>

{#if links.length > 0}
	<nav class="hidden md:block text-md">
		<ul class="flex justify-center items-center gap-2">
			{#each links as link}
				<li class="py-1 hover:bg-gray-200 rounded-sm cursor-pointer" aria-current={link.current ? 'page' : undefined}>
					<a class="px-4" href={link.href}>{link.label}</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	li[aria-current='page'] {
		background-color: #8c00ff26;
		color: #8C00FF;
	}
</style>
