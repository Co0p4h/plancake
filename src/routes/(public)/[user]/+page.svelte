<script lang="ts">
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import weekday from 'dayjs/plugin/weekday';
	import ScheduleListItem from './ScheduleListItem.svelte';
	import { blur, fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ScheduleGridItem from './ScheduleGridItem.svelte';
	import StyledText from '$lib/components/StyledText.svelte';
	import { getCurrentWeekDates } from '$lib/utils/date';
	import { m } from '$lib/paraglide/messages.js';
	dayjs.extend(weekday);

	let { data } = $props();

	let animate = $state(false);

	onMount(() => {
		animate = true;
	});
</script>

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

		<div id="user-schedule-gradient" class="flex flex-col items-center p-4 sm:p-6 lg:p-8 min-h-svh w-full justify-between"
		 style:background-color={schedule_data.theme.background === 'solid' ? schedule_data.theme.colours.background : undefined}
		 style:background-image={schedule_data.theme.background === 'gradient' ? `linear-gradient(180deg,${schedule_data.theme.colours.background} 0,hsla(0,0%,98%,0) 50%),radial-gradient(51% 51% at -11% 9%,${schedule_data.theme.colours.primary}80 1%,${schedule_data.theme.colours.primary}00 100%),radial-gradient(51% 67% at 115% 96%,${schedule_data.theme.colours.primary}80 0,${schedule_data.theme.colours.primary}00 100%),radial-gradient(50% 66% at 50% 50%,${schedule_data.theme.colours.accent}80 0,${schedule_data.theme.colours.primary}00 100%),radial-gradient(22% 117% at 2% 87%,${schedule_data.theme.colours.secondary}00 20%,${schedule_data.theme.colours.accent}80 100%),linear-gradient(0deg,${schedule_data.theme.colours.secondary}80,${schedule_data.theme.colours.secondary}80)` : undefined}
	>
		<div
			class="flex w-full max-w-4xl flex-col items-center gap-4 sm:gap-6 md:gap-8 mb-4 {schedule_data.theme.image?.url ? 'md:flex-row md:items-start' : ''}"
		>
						<!-- schedule section -->
			<div class="w-full max-w-2xl {schedule_data.theme.image?.url ? 'md:max-w-none' : ''} flex-1"
				style:order={schedule_data.theme.layout.image_position === 'left' ? '1' : '0'}>
				<div class="mb-4">
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
						<div class="p-2 max-w-32 sm:max-w-32 text-center w-full sm:w-auto flex-shrink-0"
							style:background-color={schedule_data.theme.colours.accent}
							style:border-radius={`${schedule_data.theme.item_theme.border_radius}px`}
						>
							<StyledText 
								theme={schedule_data.theme}
								typography={schedule_data.theme.typography.body}
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
								{#if animate}
									<div transition:fade={{ delay: i * 150}}>
										<ScheduleListItem {item} theme={schedule_data.theme} settings={schedule_data.schedule_settings.settings} />
									</div>
								{/if}
							{/each}
						</div>
					{:else if schedule_data.theme.layout.items === 'grid'}
						<div class="grid grid-cols-2 md:grid-cols-3"
								style:gap={`${2 * schedule_data.theme.layout.gap}px`}
						>
							{#each schedule_data.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item, i (item.id)}
								{#if animate}
									<div transition:fade={{ delay: i * 150}}>
										<ScheduleGridItem {item} theme={schedule_data.theme} settings={schedule_data.schedule_settings.settings} />
									</div>
								{/if}
							{/each}
						</div>
					{/if}
				{:else}
					<div class="flex flex-col items-center justify-center min-h-[400px] py-16">
						<StyledText 
							theme={schedule_data.theme}
							typography={schedule_data.theme.typography.empty_day}
							colour={schedule_data.theme.colours.text}
						>
							{m['_schedule.no_items_scheduled']()}
						</StyledText>
					</div>
				{/if}
			</div>

			<!-- image section... -->
			{#if schedule_data.theme.image?.url}
				{#if animate}
					<div class="sticky top-4 flex-1 items-start w-full md:min-w-0 md:max-w-md lg:max-w-lg hidden md:block overflow-hidden"
						style:border={`1px ${schedule_data.theme.colours.text} solid`}
						style:order={schedule_data.theme.layout.image_position === 'left' ? '0' : '1'}
						style:border-radius={`${schedule_data.theme.item_theme.border_radius}px`}
						transition:blur={{ duration: 500 }}
					>
						<img src={schedule_data.theme.image.url} alt={schedule_data.theme.image.alt} class="object-cover" loading="lazy" 
						/>
						<span class="absolute bottom-1 right-1 p-1"
							style:background-color={schedule_data.theme.colours.secondary} >
							<StyledText 
								theme={schedule_data.theme}
								typography={schedule_data.theme.typography.body}
							>
								<a href={schedule_data.theme.image.artist_url}>
									@{schedule_data.theme.image?.artist_name}
								</a>
							</StyledText>
						</span>
					</div>
				{/if}
			{/if}
		</div>
		{#if schedule_data.schedule_settings.settings.show_social_links && data.user_settings?.social_links}
			<div class="flex flex-wrap gap-3 justify-center mt-4 sm:mt-6 lg:mt-8 sm:mb-4">
				{#each data.user_settings.social_links as { platform, url }, index (index)}
					<a 
						href={url} 
						target="_blank" 
						rel="noopener noreferrer" 
						class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
						style:background-color={schedule_data.theme.colours.secondary}
						style:color={schedule_data.theme.colours.text}
						style:border={`1px ${schedule_data.theme.colours.text}20 solid`}
					>
						<span class="capitalize">{platform}</span>
						<svg class="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
						</svg>
					</a>
				{/each}
			</div>
		{/if}
		{#if schedule_data.schedule_settings.settings.show_logo}
			<footer class="z-10">
				<a class={`rounded-full px-5 py-3 text-sm shadow-lg text-white transition-colors`} href="/"
					style:background-color={schedule_data.theme.colours.secondary}
					style:color={schedule_data.theme.colours.text}>
					schedule.com
				</a>
			</footer>
		{/if}
	</div>
{:catch error}
	{error.message}
{/await}