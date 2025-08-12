<script lang="ts">
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import weekday from 'dayjs/plugin/weekday';
	import ScheduleListItem from './ScheduleListItem.svelte';
	import { fontSize } from '$lib/utils/font';
	import { blur, fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ScheduleGridItem from './ScheduleGridItem.svelte';
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
						<h1
							style:color={data.theme.colours.primary}
							style:font-size={fontSize(data.theme.typography.header_title.size)}
						>
							{page.params.user}'s schedule
						</h1>
						<div class="p-2 max-w-32 text-center w-full"
							style:color={data.theme.colours.secondary}
							style:background-color={data.theme.colours.accent}
						>
							{dayjs().isoWeekday(1).format('DD/MM')} →
							{dayjs().isoWeekday(7).format('DD/MM')}
						</div>
					</div>
					{#if data.schedule.description}
						<p style:font-size={fontSize(data.theme.typography.header_description.size)}>
							{data.schedule.description}
						</p>
					{/if}
				</div>

				{#if data.theme.layout.items === 'list'}
					<div class="flex flex-col"
							style:gap={`${2 * data.theme.layout.gap}px`}>
						{#each data.items as item, i (item.id)}
							{#if animate}
								<div transition:fade={{ delay: i * 150}}>
									<ScheduleListItem {item} theme={data.theme} />
								</div>
							{/if}
						{/each}
					</div>
				{:else if data.theme.layout.items === 'grid'}
					<div class="grid gap-4 grid-cols-2 md:grid-cols-3"
							style:gap={`${2 * data.theme.layout.gap}px`}
					>
						{#each data.items as item, i (item.id)}
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
			{#if data.theme.image}
				{#if animate}
					<div class="sticky top-4 flex-1 items-start min-w-[384px] md:min-w-0 hidden md:block"
						style:border={`1px ${data.theme.colours.text} solid`}
						style:order={data.theme.layout.image_position === 'left' ? '0' : '1'}
						transition:blur={{ duration: 500 }}
					>

						<img src={data.theme.image.url} alt={data.theme.image.alt} class="object-cover" loading="lazy" />
						<span
							class="absolute bottom-1 right-1 p-1"
							style:background-color={data.theme.colours.secondary}
						>
							@{data.theme.image?.artist_name}
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