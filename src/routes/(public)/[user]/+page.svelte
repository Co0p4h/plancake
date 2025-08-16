<script lang="ts">
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import weekday from 'dayjs/plugin/weekday';
	import ScheduleListItem from './ScheduleListItem.svelte';
	import { blur, fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ScheduleGridItem from './ScheduleGridItem.svelte';
	import StyledText from '../../StyledText.svelte';
	import { getCurrentWeekDates } from '$lib/utils/date';
	dayjs.extend(weekday);

	let { data } = $props();

	let animate = $state(false);

	onMount(() => {
		animate = true;
	});
</script>

{#await data.schedule_data}
	loading schedule...
{:then data}
	{@const items = data.items}
	{@const items_with_empty_days = (() => {
		const { start: startDate, end: endDate } = getCurrentWeekDates(data.schedule_settings.settings.first_day_of_week);

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
					title: data.schedule_settings.settings.empty_day_text || 'Nothing scheduled',
					description: null,
					startTime: day,
					endTime: day,
					scheduleId: data.schedule.id,
					externalUrl: null,
				}
			}

			return dayItems;
		}).flat();
		
		return items_with_empty_days;
	})()}

	<div class="flex flex-col items-center p-8 min-h-svh w-full justify-between"
			style:background-color={data.theme.colours.background}
	>
		<div
			class="flex w-full max-w-4xl flex-col items-start gap-8 md:flex-row"
			style:color={data.theme.colours.text}
		>
			<!-- schedule section -->
			<div class="mx-auto w-full min-w-sm lg:min-w-xs lg:max-w-xl flex-1"
					style:order={data.theme.layout.image_position === 'left' ? '1' : '0'}>
				<div class="mb-4">
					<div class="flex justify-between mb-4 items-center">
						<StyledText 
							theme={data.theme}
							typography={data.theme.typography.header_title}
							colour={data.theme.colours.primary}
							tag="h1"
						>
							{page.params.user}'s schedule
						</StyledText>
						<div class="p-2 max-w-32 text-center w-full"
							style:background-color={data.theme.colours.accent}
						>
							<StyledText 
								theme={data.theme}
								typography={data.theme.typography.body}
								colour={data.theme.colours.secondary}
							>
								{dayjs().isoWeekday(1).format('DD/MM')} →
								{dayjs().isoWeekday(7).format('DD/MM')}
							</StyledText>
						</div>
					</div>
					{#if data.schedule.description}
						<StyledText 
							theme={data.theme}
							typography={data.theme.typography.header_description}
							colour={data.theme.colours.text}
							tag="p"
						>
							{data.schedule.description}
						</StyledText>
					{/if}
				</div>

				{#if data.theme.layout.items === 'list'}
					<div class="flex flex-col"
							style:gap={`${2 * data.theme.layout.gap}px`}>
						{#each data.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item, i (item.id)}
							{#if animate}
								<div transition:fade={{ delay: i * 150}}>
									<ScheduleListItem {item} theme={data.theme} settings={data.schedule_settings.settings} />
								</div>
							{/if}
						{/each}
					</div>
				{:else if data.theme.layout.items === 'grid'}
					<div class="grid gap-4 grid-cols-2 md:grid-cols-3"
							style:gap={`${2 * data.theme.layout.gap}px`}
					>
						{#each data.schedule_settings.settings.show_empty_days ? items_with_empty_days : items as item, i (item.id)}
							{#if animate}
								<div transition:fade={{ delay: i * 150}}>
									<ScheduleGridItem {item} theme={data.theme} />
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- image section... -->
			{#if data.theme.image?.url}
				{#if animate}
					<div class="sticky top-4 flex-1 items-start min-w-[384px] md:min-w-0 hidden md:block"
						style:border={`1px ${data.theme.colours.text} solid`}
						style:order={data.theme.layout.image_position === 'left' ? '0' : '1'}
						transition:blur={{ duration: 500 }}
					>
						<img src={data.theme.image.url} alt={data.theme.image.alt} class="object-cover" loading="lazy" />
						<span class="absolute bottom-1 right-1 p-1"
							style:background-color={data.theme.colours.secondary} >
							<StyledText 
								theme={data.theme}
								typography={data.theme.typography.body}
							>
								<a href={data.theme.image.artist_url}>
									@{data.theme.image?.artist_name}
								</a>
							</StyledText>
						</span>
					</div>
				{/if}
			{/if}
		</div>
		<footer class="z-10">
			<a class={`rounded-full px-5 py-3 text-sm shadow-lg text-white transition-colors`} href="/"
				style:background-color={data.theme.colours.secondary}
				style:color={data.theme.colours.text}>
			schedule.com
		</a>
		</footer>
	</div>
	{:catch error}
	{error.message}
{/await}