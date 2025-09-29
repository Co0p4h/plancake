<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { CircleUserRound } from '@lucide/svelte';
	import UserMenu from './UserMenu.svelte';
	import Navigation from './Navigation.svelte';
	import SideNavigation from './SideNavigation.svelte';

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	
	let menuOpen = $state(false);
	let sideNavOpen = $state(false);

	const links = $derived(page.data.user ? [
		{
			href: '/schedule',
			label: m['_navigation.schedule'](),
			current: page.url.pathname === '/schedule'
		},
		{
			href: '/appearance',
			label: m['_navigation.appearance'](),
			current: page.url.pathname.startsWith('/appearance')
		},
		{
			href: '/settings',
			label: m['_navigation.settings'](),
			current: page.url.pathname.startsWith('/settings')
		}
	] : [
		// {
		// 	href: '/about',
		// 	label: m['_navigation.about'](),
		// 	current: page.url.pathname === '/about'
		// }
	]);

	function toggleSideNav() {
		sideNavOpen = !sideNavOpen;
	}
</script>

<header>
	<div class="flex justify-between my-4 mx-8 items-center">
		<div class="flex items-center">
			<h1 class="text-2xl font-black">
				<a href="/">P.</a>
			</h1>
			<span class="ml-4 select-none rounded bg-purple-400 px-2 py-1 text-xs text-white hidden xs:block">
				now in beta!
			</span>
		</div>

		<Navigation {links} />

		<SideNavigation {links} bind:isOpen={sideNavOpen} />

		{#if page.data.user}
			<div class="flex gap-2 items-center relative">
				<button class="flex gap-2 items-center cursor-pointer hover:bg-gray-200 rounded-md px-2 py-1"
						tabindex="0"
						onclick={toggleMenu}
				>
					@{page.data.user.username}
					<CircleUserRound size={20} />
				</button>
				<button 
					class="hamburger md:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
					onclick={toggleSideNav}
					aria-label="Toggle navigation menu"
				>
					<span class="block w-6 h-0.5 bg-gray-600 transition-transform duration-300 {sideNavOpen ? 'rotate-45 translate-y-1.5' : ''}"></span>
					<span class="block w-6 h-0.5 bg-gray-600 my-1 transition-opacity duration-300 {sideNavOpen ? 'opacity-0' : ''}"></span>
					<span class="block w-6 h-0.5 bg-gray-600 transition-transform duration-300 {sideNavOpen ? '-rotate-45 -translate-y-1.5' : ''}"></span>
				</button>
				{#if menuOpen}
					<UserMenu bind:menuOpen={menuOpen} />
				{/if}
			</div>
		{:else}
			<div class="flex gap-4 items-center justify-center text-md">
				<a class="rounded-md px-3 py-1 transition-colors hover:bg-gray-200" href="/login">
					<p>{m.login()}</p>
				</a>
				<a class="rounded-md bg-black px-3 py-1 text-white transition-colors hover:bg-gray-800" href="/signup">
					<p>{m.signup()}</p>
				</a>
			</div>
		{/if}
	</div>
</header>


