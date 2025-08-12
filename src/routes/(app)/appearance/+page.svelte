<!-- https://svelte.dev/docs/kit/snapshots ?? can i use this for if they navigate off the page? -->
<script lang="ts">
	import dayjs from 'dayjs';
	import AppearanceNav from './AppearanceNav.svelte';
	import AppearanceBar from './AppearanceBar.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { ThemeCategories } from '$lib/server/db/schema';
	import { beforeNavigate } from '$app/navigation';
	import ScheduleListItem from '../../(public)/[user]/ScheduleListItem.svelte';
	import StyledText from '../../StyledText.svelte';
	import { initThemeStore, themeStore } from './appearance.svelte';
	import ScheduleGridItem from '../../(public)/[user]/ScheduleGridItem.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	// onMount(() => {
		initThemeStore(data.schedule_data.theme); // maybe this should be in some main layout file? 
	// });

	// TODO: implement streaming in data
	// $effect.pre(() => {
	// 	const initialiseTheme = async () => {
	// 		try {
	// 			const schedule_data = await data.schedule_data;
	// 			initThemeStore(schedule_data.theme);
	// 		} catch (error) {
	// 			console.error('failed to load schedule data:', error);
	// 		}
	// 	};
		
	// 	initialiseTheme();
	// });

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
	{#await data.schedule_data}
		<!-- Loading skeleton that matches the actual layout -->
		<div class="animate-pulse max-w-8xl flex-grow self-stretch rounded-lg border border-gray-300 bg-white p-5">
			<!-- Header skeleton -->
			<div class="h-6 bg-gray-200 rounded w-32 mb-4"></div>
			
			<!-- Main preview area skeleton -->
			<div class="flex min-h-screen flex-col items-center rounded-lg border border-gray-300 p-4 bg-gray-50">
				<div class="flex w-full max-w-4xl flex-row items-start gap-8">
					<!-- Schedule section skeleton -->
					<div class="mx-auto w-full min-w-sm lg:min-w-xs lg:max-w-xl flex-1">
						<div class="mb-4">
							<!-- Header with username and date range -->
							<div class="flex justify-between mb-4 items-center">
								<div class="h-8 bg-gray-200 rounded w-48"></div>
								<div class="p-2 max-w-24 text-center w-full h-10 bg-gray-200 rounded"></div>
							</div>
							<!-- Description -->
							<div class="h-4 bg-gray-200 rounded w-64 mb-4"></div>
						</div>

						<!-- Schedule items skeleton -->
						<div class="flex flex-col gap-4">
							<!-- List item 1 -->
							<div class="border border-gray-200 rounded-lg p-4 bg-white">
								<div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
								<div class="h-3 bg-gray-200 rounded w-1/4"></div>
							</div>
							
							<!-- List item 2 -->
							<div class="border border-gray-200 rounded-lg p-4 bg-white">
								<div class="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
								<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div class="h-3 bg-gray-200 rounded w-1/3"></div>
							</div>
							
							<!-- List item 3 -->
							<div class="border border-gray-200 rounded-lg p-4 bg-white">
								<div class="h-5 bg-gray-200 rounded w-5/6 mb-2"></div>
								<div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
								<div class="h-3 bg-gray-200 rounded w-1/4"></div>
							</div>
						</div>
					</div>

					<!-- Image section skeleton -->
<div class="sticky top-4 hidden flex-1 items-start lg:block">
						<div class="relative w-96 h-[600px] bg-gray-200 rounded border border-gray-300">
							<!-- Image attribution skeleton -->
							<div class="absolute right-1 bottom-1 p-1 bg-gray-300 rounded">
								<div class="h-3 bg-gray-400 rounded w-16"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Appearance nav skeleton -->
		<div class="bg-white border border-gray-300 rounded-lg p-4 w-80 flex-col animate-pulse">
			<div class="flex justify-between items-center mb-4">
				<div class="h-6 bg-gray-200 rounded w-24"></div>
				<div class="h-8 bg-gray-200 rounded w-16"></div>
			</div>
			<div class="space-y-4">
				<div class="h-10 bg-gray-200 rounded"></div>
				<div class="h-10 bg-gray-200 rounded"></div>
				<div class="h-10 bg-gray-200 rounded"></div>
				<div class="h-32 bg-gray-200 rounded"></div>
			</div>
			<div class="mt-6">
				<div class="h-10 bg-gray-200 rounded w-full"></div>
			</div>
		</div>
		
		<!-- Appearance bar skeleton (hidden on smaller screens) -->
		<div class="hidden xl:flex">
			<div class="bg-white border border-gray-300 rounded-lg p-4 w-20 flex-col animate-pulse">
				<div class="space-y-4">
					<div class="w-12 h-12 bg-gray-200 rounded"></div>
					<div class="w-12 h-12 bg-gray-200 rounded"></div>
					<div class="w-12 h-12 bg-gray-200 rounded"></div>
					<div class="w-12 h-12 bg-gray-200 rounded"></div>
					<div class="w-12 h-12 bg-gray-200 rounded"></div>
				</div>
			</div>
		</div>
		


	{:then scheduleData}
		<div class="max-w-8xl flex-grow self-stretch rounded-lg border border-gray-300 bg-white p-5">
			<h1 class="mb-4 text-xl text-gray-500">{m['_appearance.appearance']()}</h1>
			<div
				class="flex min-h-screen flex-col items-center rounded-lg border border-gray-300 p-4"
				style:background-color={themeStore.clientTheme.colours.background}
			>
				<div
					class="flex w-full max-w-4xl flex-row items-start gap-8"
					style:color={themeStore.clientTheme.colours.text}
				>
					<div class="mx-auto w-full min-w-sm lg:min-w-xs lg:max-w-xl flex-1"
							style:order={themeStore.clientTheme.layout.image_position === 'left' ? '1' : '0'}>
						<div class="mb-4">
							<div class="flex justify-between mb-4 items-center">
								<StyledText 
									theme={themeStore.clientTheme}
									typography={themeStore.clientTheme.typography.header_title}
									colour={themeStore.clientTheme.colours.primary}
									tag="h1"
								>
									{scheduleData.user.username}'s schedule
								</StyledText>
								<div class="p-2 max-w-32 text-center w-full"
									style:color={themeStore.clientTheme.colours.secondary}
									style:background-color={themeStore.clientTheme.colours.accent}
								>
									<StyledText 
										theme={themeStore.clientTheme}
										typography={themeStore.clientTheme.typography.body}
										colour={themeStore.clientTheme.colours.secondary}
									>
										{dayjs().isoWeekday(1).format('DD/MM')} →
										{dayjs().isoWeekday(7).format('DD/MM')}
									</StyledText>
								</div>
							</div>
							<StyledText 
								theme={themeStore.clientTheme}
								typography={themeStore.clientTheme.typography.header_description}
								colour={themeStore.clientTheme.colours.text}
								tag="p"
							>
								{scheduleData.schedule.description}
							</StyledText>
						</div>
						{#if themeStore.clientTheme.layout.items === 'list'}
							<div class="flex flex-col"
									style:gap={`${2 * (themeStore.clientTheme.layout.gap || 0)}px`}
							>
								{#each scheduleData.items as item (item.id)}
									<ScheduleListItem {item} theme={themeStore.clientTheme} />
								{/each}
							</div>
						{:else if themeStore.clientTheme.layout.items === 'grid'}
							<div class="grid gap-4 grid-cols-2 md:grid-cols-3"
									style:gap={`${2 * (themeStore.clientTheme.layout.gap || 0)}px`}
							>
								{#each scheduleData.items as item (item.id)}
									<ScheduleGridItem {item} theme={themeStore.clientTheme} />
								{/each}
							</div>
						{/if}
					</div>
					{#if themeStore.clientTheme.image?.url}
						<div class="sticky top-4 hidden flex-1 items-start lg:block"
								style:border={`1px ${themeStore.clientTheme.colours.text} solid`}
								style:order={themeStore.clientTheme.layout.image_position === 'left' ? '0' : '1'}>
							<img src={themeStore.clientTheme.image?.url} alt={themeStore.clientTheme.image?.alt} class="object-cover" />
							<span class="absolute right-1 bottom-1 p-1"
								style:background-color={themeStore.clientTheme.colours.secondary}>
								<StyledText 
									theme={themeStore.clientTheme}
									typography={themeStore.clientTheme.typography.body}
									colour={themeStore.clientTheme.colours.text}
								>
									<a href={themeStore.clientTheme.image.artist_url}>
										@{themeStore.clientTheme.image?.artist_name}
									</a>
								</StyledText>
							</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="hidden xl:flex">
			<AppearanceBar bind:activeAppearance />
		</div>
		<AppearanceNav bind:activeAppearance />
		
	{:catch error}
		<div class="max-w-8xl flex-grow self-stretch rounded-lg border border-red-300 bg-red-50 p-5">
			<div class="text-red-600">
				<h2 class="text-lg font-semibold mb-2">Error loading schedule data</h2>
				<p>{error.message}</p>
			</div>
		</div>
	{/await}
</div>