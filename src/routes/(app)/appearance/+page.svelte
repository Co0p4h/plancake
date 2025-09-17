<!-- https://svelte.dev/docs/kit/snapshots ?? can i use this for if they navigate off the page? -->
<script lang="ts">
	import dayjs from 'dayjs';
	import AppearanceNav from './AppearanceNav.svelte';
	import AppearanceBar from './AppearanceBar.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { ThemeCategories } from '$lib/server/db/schema';
	import { beforeNavigate } from '$app/navigation';
	import ScheduleListItem from '../../(public)/[user]/ScheduleListItem.svelte';
	import StyledText from '$lib/components/StyledText.svelte';
	import { initThemeStore, themeStore } from './appearance.svelte';
	import ScheduleGridItem from '../../(public)/[user]/ScheduleGridItem.svelte';
	import { getCurrentWeekDates } from '$lib/utils/date';
	import { validateImageUrl, validateArtistUrl } from '$lib/utils/cs-validate';
	import AppearanceSkeleton from './AppearanceSkeleton.svelte';

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

<svelte:body onkeydown={(e) => {
	if (e.key == "Escape" ) {
		activeAppearance = null;
	}
}} />

<div class="mx-auto flex flex-1 items-start gap-4">
	{#await data.schedule_data}
		<AppearanceSkeleton />
	{:then scheduleData}
		{@const items = scheduleData.items}
		{@const items_with_empty_days = (() => {
			const { start: startDate, end: endDate } = getCurrentWeekDates(scheduleData.schedule_settings.settings.first_day_of_week);

			const days = Array.from({ length: 7 }, (_, i) => {
				return dayjs(startDate).add(i, 'day').toDate();
			});

			const items_with_empty_days = days.map(day => {
				const dayString = dayjs(day).format('YYYY-MM-DD');
				const dayItems = items.filter(item => dayjs(item.startTime).format('YYYY-MM-DD') === dayString);

				if (!dayItems || dayItems.length === 0) {
					return {
						id: `empty-${dayString}`,
						createdAt: day,
						updatedAt: day,
						title: scheduleData.schedule_settings.settings.empty_day_text || 'nothing scheduled',
						description: null,
						startTime: day,
						endTime: day,
						scheduleId: scheduleData.schedule.id,
						externalUrl: null,
					}
				}

				return dayItems;
			}).flat();
			
			return items_with_empty_days;
		})()}

		<div class="max-w-8xl flex-grow self-stretch rounded-lg border border-gray-300 bg-white p-5 flex flex-col min-h-0">
			<h1 class="mb-4 text-xl text-gray-500">{m['_appearance.appearance']()}</h1>
			<div
				class="flex h-full min-h-0 flex-col items-center rounded-lg border border-gray-300 p-4 sm:p-6 lg:p-8 lg:min-w-2xl"
				style:background-color={themeStore.clientTheme.background === 'solid' ? themeStore.clientTheme.colours.background : undefined}
				style:background-image={themeStore.clientTheme.background === 'gradient' ? `linear-gradient(180deg,${themeStore.clientTheme.colours.background} 0,hsla(0,0%,98%,0) 50%),radial-gradient(51% 51% at -11% 9%,${themeStore.clientTheme.colours.primary}80 1%,${themeStore.clientTheme.colours.primary}00 100%),radial-gradient(51% 67% at 115% 96%,${themeStore.clientTheme.colours.primary}80 0,${themeStore.clientTheme.colours.primary}00 100%),radial-gradient(50% 66% at 50% 50%,${themeStore.clientTheme.colours.accent}80 0,${themeStore.clientTheme.colours.primary}00 100%),radial-gradient(22% 117% at 2% 87%,${themeStore.clientTheme.colours.secondary}00 20%,${themeStore.clientTheme.colours.accent}80 100%),linear-gradient(0deg,${themeStore.clientTheme.colours.secondary}80,${themeStore.clientTheme.colours.secondary}80)` : undefined}
			>
				<div
					class="flex w-full max-w-4xl flex-col items-center gap-4 sm:gap-6 md:gap-8 {themeStore.clientTheme.image?.url ? 'lg:flex-row lg:items-start' : ''}"
					style:color={themeStore.clientTheme.colours.text}
				>
					<div class="w-full max-w-2xl {themeStore.clientTheme.image?.url ? 'lg:max-w-none' : ''} flex-1"
						style:order={themeStore.clientTheme.layout.image_position === 'left' ? '1' : '0'}>
						<div class="mb-4 max-w-lg mx-auto">
							<div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 sm:gap-0 sm:items-center">
								<div class="flex-1"
										style:text-shadow="2px 2px 0px {themeStore.clientTheme.colours.secondary}"
								>
									<StyledText 
										theme={themeStore.clientTheme}
										typography={themeStore.clientTheme.typography.header_title}
										colour={themeStore.clientTheme.colours.primary}
										tag="h1"
										class="flex-1"
									>
										{scheduleData.schedule.title || `${scheduleData.user.displayName || scheduleData.user.username}'s schedule`}
									</StyledText>
								</div>
								<div class="p-2 max-w-34 sm:max-w-34 text-center w-full sm:w-auto flex-shrink-0"
									style:background-color={themeStore.clientTheme.colours.accent}
									style:border-radius={`${themeStore.clientTheme.item_theme.border_radius}px`}
								>
									<StyledText 
										theme={themeStore.clientTheme}
										typography={themeStore.clientTheme.typography.date_range}
										colour={themeStore.clientTheme.colours.secondary}
										class="text-xs sm:text-sm"
									>
										{(() => {
											const { start: startDate } = scheduleData.schedule_settings.settings.first_day_of_week === 'monday' 
												? { start: dayjs().startOf('isoWeek') }
												: { start: dayjs().startOf('week') };
											const endDate = startDate.add(6, 'day');
											return `${startDate.format('DD/MM')} → ${endDate.format('DD/MM')}`;
										})()}
									</StyledText>
								</div>
							</div>
							{#if scheduleData.schedule_settings.settings.show_schedule_description}
								<StyledText 
									theme={themeStore.clientTheme}
									typography={themeStore.clientTheme.typography.header_description}
									colour={themeStore.clientTheme.colours.text}
									tag="p"
									class="whitespace-pre-wrap"
								>
									{scheduleData.schedule.description}
								</StyledText>
							{/if}
						</div>

						{#if items.length > 0 || items_with_empty_days.length > 0} <!-- TODO: this does not work -->
							{#if themeStore.clientTheme.layout.items === 'list'}
								<div class="flex flex-col"
										style:gap={`${2 * themeStore.clientTheme.layout.gap}px`}
								>
									{#each scheduleData.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item, i (item.id)}
										<div class="flex justify-center">
											<ScheduleListItem {item} theme={themeStore.clientTheme} settings={scheduleData.schedule_settings.settings} />
										</div>
									{/each}
								</div>
							{:else if themeStore.clientTheme.layout.items === 'grid'}
								<div class="grid grid-cols-2 md:grid-cols-3"
										style:grid-gap={`${2 * (themeStore.clientTheme.layout.gap || 0)}px`}
								>
									{#each scheduleData.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item (item.id)}
										<ScheduleGridItem {item} theme={themeStore.clientTheme} settings={scheduleData.schedule_settings.settings} />
									{/each}
								</div>
							{/if}
						{:else}
							<div class="flex flex-col items-center justify-center min-h-[400px] py-16">
								<StyledText 
									theme={themeStore.clientTheme}
									typography={themeStore.clientTheme.typography.empty_text}
									colour={themeStore.clientTheme.colours.text}
								>
									{m['_schedule.no_items_scheduled']()}
								</StyledText>
							</div>
						{/if}
					</div>

					{#if themeStore.clientTheme.image?.url && scheduleData.schedule_settings.settings.show_schedule_image && validateImageUrl(themeStore.clientTheme.image.url) == ""}
						<div class="relative block w-full mx-auto max-w-sm sm:max-w-md lg:min-w-0 lg:max-w-md xl:max-w-lg lg:sticky lg:top-4 lg:flex-1 items-start overflow-hidden"
								style:border={`1px ${themeStore.clientTheme.colours.text} solid`}
								style:order={themeStore.clientTheme.layout.image_position === 'left' ? '0' : '1'}
								style:border-radius={`${themeStore.clientTheme.item_theme.border_radius}px`}>
							<img src={themeStore.clientTheme.image?.url} alt={themeStore.clientTheme.image?.alt} class="w-full h-auto object-cover block" loading="lazy" />
							{#if themeStore.clientTheme.image?.artist_name}
								<span class="absolute right-2 bottom-2 p-1 rounded"
									style:background-color={themeStore.clientTheme.colours.secondary}>
									<StyledText 
										theme={themeStore.clientTheme}
										typography={themeStore.clientTheme.typography.artist_text}
										colour={themeStore.clientTheme.colours.text}
									>
										{#if themeStore.clientTheme.image?.artist_url && validateArtistUrl(themeStore.clientTheme.image.artist_url) == ""}
											<a href={themeStore.clientTheme.image.artist_url} target="_blank" rel="noopener noreferrer">
												@{themeStore.clientTheme.image?.artist_name}
											</a>
										{:else}
											<span>@{themeStore.clientTheme.image?.artist_name}</span>
										{/if}
									</StyledText>
								</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="relative mx-auto flex flex-1 items-start gap-4">
			<div class="absolute right-18 xl:flex xl:relative xl:right-0">
				{#if activeAppearance}
					<AppearanceBar bind:activeAppearance />
				{/if}
			</div>
			<AppearanceNav bind:activeAppearance />
		</div>
		
	{:catch error}
		<div class="max-w-8xl flex-grow self-stretch rounded-lg border border-red-300 bg-red-50 p-5">
			<div class="text-red-600">
				<h2 class="text-lg font-semibold mb-2">error loading schedule data</h2>
				<p>{error.message}</p>
			</div>
		</div>
	{/await}
</div>