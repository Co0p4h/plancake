<script lang="ts">
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import weekday from 'dayjs/plugin/weekday';
	import ScheduleListItem from './ScheduleListItem.svelte';
	import { blur, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ScheduleGridItem from './ScheduleGridItem.svelte';
	import StyledText from '$lib/components/StyledText.svelte';
	import { getCurrentWeekDates } from '$lib/utils/date';
	import { m } from '$lib/paraglide/messages.js';
	import { validateImageUrl, validateArtistUrl } from '$lib/utils/cs-validate';
	import SocialLink from './SocialLink.svelte';
	dayjs.extend(weekday);

	let { data } = $props();

	let animate = $state(false);

	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>{page.params.user}</title>
</svelte:head>

{#await data.schedule_data}
	loading schedule...
{:then schedule_data}
	{@const items = schedule_data.items}
	{@const items_with_empty_days = (() => {
		const { start: startDate, end: endDate } = getCurrentWeekDates(schedule_data.schedule_settings.settings.first_day_of_week);

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
					title: schedule_data.schedule_settings.settings.empty_day_text || 'Nothing scheduled',
					description: null,
					startTime: day,
					endTime: day,
					scheduleId: schedule_data.schedule.id,
					externalUrl: null,
				}
			}

			return dayItems;
		}).flat();
		
		return items_with_empty_days;
	})()}

	<div id="user-schedule-gradient" class="fixed inset-0 -z-1 bg-no-repeat bg-cover"
		style:background-color={schedule_data.theme.background === 'solid' ? schedule_data.theme.colours.background : undefined}
		style:background-image={schedule_data.theme.background === 'gradient' ? `linear-gradient(180deg,${schedule_data.theme.colours.background} 0,hsla(0,0%,98%,0) 50%),radial-gradient(51% 51% at -11% 9%,${schedule_data.theme.colours.primary}80 1%,${schedule_data.theme.colours.primary}00 100%),radial-gradient(51% 67% at 115% 96%,${schedule_data.theme.colours.primary}80 0,${schedule_data.theme.colours.primary}00 100%),radial-gradient(50% 66% at 50% 50%,${schedule_data.theme.colours.accent}80 0,${schedule_data.theme.colours.primary}00 100%),radial-gradient(22% 117% at 2% 87%,${schedule_data.theme.colours.secondary}00 20%,${schedule_data.theme.colours.accent}80 100%),linear-gradient(0deg,${schedule_data.theme.colours.secondary}80,${schedule_data.theme.colours.secondary}80)` : undefined}
	></div>
	<div id="user-schedule-gradient" class="flex flex-col items-center gap-4 p-4 sm:p-6 lg:p-8 min-h-svh w-full justify-between">
		<div class="flex w-full max-w-4xl flex-col items-center gap-4 sm:gap-6 md:gap-8 
			{schedule_data.theme.image?.url ? 'md:flex-row md:items-start' : ''}"
		>
			<!-- schedule section -->
			<div class="w-full max-w-2xl order-1
				{schedule_data.theme.layout.image_position === 'left' ? 'md:order-2' : 'md:order-1'}
				{schedule_data.theme.image?.url ? 'md:max-w-none' : ''} flex-1"
			>
				<div class="mb-4 mx-auto max-w-lg">
					<div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 sm:gap-0 sm:items-center">
						<div class="flex-1"
							style:text-shadow="2px 2px 0px {schedule_data.theme.colours.secondary}"
						>
							<StyledText 
								theme={schedule_data.theme}
								typography={schedule_data.theme.typography.header_title}
								colour={schedule_data.theme.colours.primary}
								tag="h1"
							>
								{schedule_data.schedule.title || `${page.params.user}'s schedule`}
							</StyledText>
						</div>
						<div class="p-2 max-w-34 sm:max-w-34 text-center w-full sm:w-auto flex-shrink-0"
							style:background-color={schedule_data.theme.colours.accent}
							style:border-radius={`${schedule_data.theme.item_theme.border_radius}px`}
						>
							<StyledText 
								theme={schedule_data.theme}
								typography={schedule_data.theme.typography.date_range}
								colour={schedule_data.theme.colours.secondary}
								class="text-xs sm:text-sm"
							>
								{dayjs().isoWeekday(1).format('DD/MM')} →
								{dayjs().isoWeekday(7).format('DD/MM')}
							</StyledText>
						</div>
					</div>
					{#if schedule_data.schedule_settings.settings.show_schedule_description}
						<StyledText 
							theme={schedule_data.theme}
							typography={schedule_data.theme.typography.header_description}
							colour={schedule_data.theme.colours.text}
							tag="p"
							class="whitespace-pre-wrap"
						>
							{schedule_data.schedule.description}
						</StyledText>
					{/if}
				</div>

				{#if items.length > 0 || items_with_empty_days.length > 0}
					{#if schedule_data.theme.layout.items === 'list'}
						<div class="flex flex-col"
								style:gap={`${2 * schedule_data.theme.layout.gap}px`}>
							{#each schedule_data.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item, i (item.id)}
								<!-- {#if animate} -->
									<!-- <div transition:fade={{ delay: i * 150}} class="flex justify-center"> -->
									 <div class="flex justify-center">
										 <ScheduleListItem {item} theme={schedule_data.theme} settings={schedule_data.schedule_settings.settings} />
									</div>
								<!-- {/if} -->
							{/each}
						</div>
					{:else if schedule_data.theme.layout.items === 'grid'}
						<div class="grid grid-cols-2 md:grid-cols-3"
								style:gap={`${2 * schedule_data.theme.layout.gap}px`}
						>
							{#each schedule_data.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item, i (item.id)}
								<!-- {#if animate} -->
									<!-- <div transition:fade={{ delay: i * 150}}> -->
										<ScheduleGridItem {item} theme={schedule_data.theme} settings={schedule_data.schedule_settings.settings} />
									<!-- </div> -->
								<!-- {/if} -->
							{/each}
						</div>
					{/if}
				{:else}
					<div class="flex flex-col items-center justify-center min-h-[400px] py-16">
						<StyledText 
							theme={schedule_data.theme}
							typography={schedule_data.theme.typography.empty_text}
							colour={schedule_data.theme.colours.text}
						>
							{m['_schedule.no_items_scheduled']()}
						</StyledText>
					</div>
				{/if}
			</div>

			<!-- image section... -->
			{#if schedule_data.theme.image?.url && schedule_data.schedule_settings.settings.show_schedule_image && validateImageUrl(schedule_data.theme.image.url) == ""}
				<!-- {#if animate} -->
					<div class="relative w-full mx-auto max-w-sm sm:max-w-md md:min-w-0 md:max-w-md lg:max-w-lg overflow-hidden block md:sticky md:top-4 md:flex-1 order-2 
						{schedule_data.theme.layout.image_position === 'left' ? 'md:order-1' : 'md:order-2'}"
						style:border={`1px ${schedule_data.theme.colours.text} solid`}
						style:border-radius={`${schedule_data.theme.item_theme.border_radius}px`}
						>
						<!-- transition:blur={{ duration: 500 }} -->
						<img src={schedule_data.theme.image.url} alt={schedule_data.theme.image.alt} class="w-full h-auto object-cover block" loading="lazy" />
						{#if schedule_data.theme.image?.artist_name}
							<span class="absolute bottom-2 right-2 p-1 rounded"
								style:background-color={schedule_data.theme.colours.secondary} >
								<StyledText 
									theme={schedule_data.theme}
									typography={schedule_data.theme.typography.artist_text}
								>
									{#if schedule_data.theme.image?.artist_url && validateArtistUrl(schedule_data.theme.image.artist_url) == ""}
										<a href={schedule_data.theme.image.artist_url} target="_blank" rel="noopener noreferrer">
											@{schedule_data.theme.image?.artist_name}
										</a>
									{:else}
										<span>@{schedule_data.theme.image?.artist_name}</span>
									{/if}
								</StyledText>
							</span>
						{/if}
					</div>
				<!-- {/if} -->
			{/if}
		</div>
		<div class="justify-center items-center flex flex-col gap-6">
			{#if schedule_data.schedule_settings.settings.show_social_links && data.user_settings?.social_links}
				<div class="flex flex-wrap gap-2 justify-center items-center">
					{#each data.user_settings.social_links as { platform, url }, index (index)}
						<SocialLink {platform} {url} {schedule_data}  />
					{/each}
				</div>
			{/if}
			{#if schedule_data.schedule_settings.settings.show_logo}
				<footer class="z-10">
					<a class="rounded-full px-5 py-3 text-sm shadow-lg" href="/"
						style:background-color={schedule_data.theme.colours.secondary}
						style:color={schedule_data.theme.colours.text}>
						schedule.com
					</a>
				</footer>
			{/if}
		</div>
	</div>
{:catch error}
	{error.message}
{/await}