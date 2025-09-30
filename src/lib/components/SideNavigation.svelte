<script lang="ts">
	interface Link {
		href: string;
		label: string;
		current?: boolean;
	}
	
	let { 
		links, 
		isOpen = $bindable(false) 
	}: { 
		links: Link[]; 
		isOpen?: boolean;
	} = $props();
	
	function closeMenu() {
		isOpen = false;
	}
</script>

<nav class="md:hidden z-100">
	{#if isOpen}
		<div 
			class="fixed inset-0 bg-black opacity-50 z-40 transition-opacity"
			onclick={closeMenu}
			onkeydown={(e) => e.key === 'Escape' && closeMenu()}
			role="button"
			tabindex="0"
			aria-label="close navigation menu"
		></div>
	{/if}
	
	<div class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 {isOpen ? 'translate-x-0' : 'translate-x-full'}">
		<div class="p-6">
			<button 
				class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
				onclick={closeMenu}
				aria-label="Close navigation menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
			
			<ul class="mt-8 space-y-4">
				{#each links as link}
					<li>
						<a 
							href={link.href} 
							class="block py-2 px-3 text-lg rounded-md transition-colors {link.current ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}"
							onclick={closeMenu}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>
