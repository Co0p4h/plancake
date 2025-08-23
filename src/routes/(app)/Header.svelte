<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { CircleUserRound } from '@lucide/svelte';
	import UserMenu from './UserMenu.svelte';
	let menuHovered = $state(false);

	// console.log("header - page", page.data);
</script>

<header class="flex justify-between mt-4 mx-8 items-center">
	<div class="flex items-center">
		<h1 class="text-2xl font-black">
			<a href="/">P.</a>
		</h1>
		<span class="ml-4 select-none rounded bg-purple-400 px-2 py-1 text-xs text-white hidden sm:block">
			now in beta!
		</span>
	</div>

	{#if page.data.user}
		<nav class="text-md">
			<ul class="flex justify-center items-center gap-2">
					<li class="py-1 px-4" aria-current={page.url.pathname === '/schedule' ? 'page' : undefined}>
						<a href="/schedule">{m['_navigation.schedule']()}</a>
					</li>
					<li class="py-1 px-4" aria-current={page.url.pathname.startsWith('/appearance') ? 'page' : undefined}>
						<a href="/appearance">{m['_navigation.appearance']()}</a>
					</li>
					<li class="py-1 px-4" aria-current={page.url.pathname.startsWith('/settings') ? 'page' : undefined}>
						<a href="/settings">{m['_navigation.settings']()}</a>
					</li>
				</ul>
		</nav>
		<div class="flex gap-2 items-center relative">
			<div class="flex gap-2 items-center cursor-pointer"
					 role="button"
					 tabindex="0"
					 onmouseenter={() => {
						menuHovered = true	
					 }}>
				<a href={`/${page.data.user.username}`}>
					<p>@{page.data.user.username}</p>
				</a>
				<CircleUserRound size={20} />
			</div>
			{#if menuHovered}
				<UserMenu bind:menuHovered />
			{/if}
		</div>
	{:else}
		<nav class="text-md">
			<ul class="flex justify-center items-center gap-2">
				<li class="py-1 px-3" aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="/about">{m['_navigation.about']()}</a>
				</li>
				<!-- <li class="py-1 px-3" aria-current={page.url.pathname === '/pricing' ? 'page' : undefined}>
					<a href="/pricing">pricing</a>
				</li> -->
			</ul>
		</nav>	
		<div class="flex gap-4 items-center justify-center text-md">
			<a class="rounded-md py-1 transition-colors hover:bg-gray-100" href="/login">
				<p>{m.login()}</p>
			</a>
			<a class="rounded-md bg-black px-3 py-1 text-white transition-colors hover:bg-gray-800" href="/signup">
				<p>{m.signup()}</p>
			</a>
		</div>
	{/if}
	</header>

<style>
	li[aria-current='page'] {
		background-color: #8c00ff26;
		border-radius: 5px;
		color: #8C00FF;
	}
</style>
