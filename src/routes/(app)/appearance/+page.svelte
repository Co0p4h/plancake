<!-- https://svelte.dev/docs/kit/snapshots ?? can i use this for if they navigate off the page? -->
<script lang="ts">
	import dayjs from 'dayjs';
	import AppearanceNav from './AppearanceNav.svelte';
	import AppearanceBar from './AppearanceBar.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { ThemeCategories } from '$lib/server/db/schema';
	import { beforeNavigate } from '$app/navigation';
	import ScheduleListItem from '../../(public)/[user]/ScheduleListItem.svelte';
	import { fontSize } from '$lib/utils/font';
	import { initThemeStore, themeStore } from './appearance.svelte';
	import ScheduleGridItem from '../../(public)/[user]/ScheduleGridItem.svelte';

	let { data } = $props();

	initThemeStore(data.theme);

	beforeNavigate(({ cancel }) => {
		if (
			themeStore.isModified() &&
			!confirm('are you sure you want to leave? unsaved appearance changes will be lost.')
		) {
			cancel();
		}
	});

	let activeAppearance: ThemeCategories = $state('colours');
</script>

<div class="mx-auto flex flex-1 items-start gap-4">
	<div class="max-w-8xl flex-grow self-stretch rounded-lg border border-gray-300 bg-white p-5">
		<h1 class="mb-4 text-xl text-gray-500">{m['_appearance.appearance']()}</h1>
		<!-- main area -->
		<div
			class="flex min-h-screen flex-col items-center rounded-lg border border-gray-300 p-4"
			style:background-color={themeStore.clientTheme.colours.background}
		>
			<div
				class="flex w-full max-w-4xl flex-row items-start gap-8"
				style:color={themeStore.clientTheme.colours.text}
			>
				<!-- schedule section -->
				<div class="mx-auto w-full min-w-sm lg:min-w-xs lg:max-w-xl flex-1"
					 	 style:order={themeStore.clientTheme.layout.image_position === 'left' ? '1' : '0'}>
					<div class="mb-4">
						<div class="flex justify-between mb-4 items-center">
							<h1 style:color={themeStore.clientTheme.colours.primary}
									style:font-size={fontSize(themeStore.clientTheme.typography.header_title.size)}>
								{data.user.username}'s schedule
							</h1>
							<div
							class="p-2 max-w-24 text-center w-full"
							style:color={themeStore.clientTheme.colours.secondary}
							style:background-color={themeStore.clientTheme.colours.accent}
							>
								{dayjs().weekday(1).format('DD')} →
								{dayjs().weekday(7).format('DD')}
							</div>
						</div>
						<p style:font-size={fontSize(themeStore.clientTheme.typography.header_description.size)}>
							<!-- TODO: if schedule description is too long then it looks terrible :D -->
							{data.schedule.description}
						</p>
					</div>

					{#if themeStore.clientTheme.layout.items === 'list'}
						<div class="flex flex-col"
							   style:gap={`${2 * parseInt(themeStore.clientTheme.layout.gap)}px`}
						>
							{#each data.items as item (item.id)}
								<ScheduleListItem {item} theme={themeStore.clientTheme} />
							{/each}
						</div>
					{:else if themeStore.clientTheme.layout.items === 'grid'}
						<div class="grid gap-4 grid-cols-2 md:grid-cols-3"
							   style:gap={`${2 * parseInt(themeStore.clientTheme.layout.gap)}px`}
						>
							{#each data.items as item (item.id)}
								<ScheduleGridItem {item} theme={themeStore.clientTheme} />
							{/each}
						</div>
					{/if}
				</div>

				<!-- image section... -->
				{#if themeStore.clientTheme.image?.url}
					<div class="sticky top-4 hidden flex-1 items-start lg:block"
							 style:border={`1px ${data.theme.colours.text} solid`}
							 style:order={themeStore.clientTheme.layout.image_position === 'left' ? '0' : '1'}>
						<img src={themeStore.clientTheme.image?.url} alt={themeStore.clientTheme.image?.alt} class="object-cover" />
						<span class="absolute right-1 bottom-1 p-1"
									style:background-color={themeStore.clientTheme.colours.secondary}>
							@{themeStore.clientTheme.image?.artistAtribution}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex-col gap-2 hidden xl:flex">
		<AppearanceBar bind:activeAppearance />
		<button
			class="mx-1 cursor-pointer rounded-md bg-purple-400 p-2 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out not-disabled:hover:bg-purple-500"
			disabled={!themeStore.isModified()}
			onclick={() => {
				console.log('theme', themeStore.clientTheme);
			}}
		>
			publish changes
		</button>
	</div>
	<AppearanceNav bind:activeAppearance />
</div>
