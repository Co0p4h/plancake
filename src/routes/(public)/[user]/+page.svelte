<script lang="ts">
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import weekday from 'dayjs/plugin/weekday';
	import ScheduleListItem from './ScheduleListItem.svelte';
	import { fontSize } from '$lib/utils/font';
	import { boolean } from 'drizzle-orm/gel-core';
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

<div class="flex flex-col items-center p-8 min-h-svh w-full justify-between"
		 style:background-color={data.theme.colours.background}
>
	<div
		class="flex w-full max-w-4xl flex-col items-start gap-8 lg:flex-row"
		style:color={data.theme.colours.text}
	>
		<!-- schedule section -->
		<div class="mx-auto w-full max-w-2xl flex-1"
				 style:order={data.theme.layout.image_position === 'left' ? '1' : '0'}
		>
			<!-- can add flex-1 here for even image to schedule ratio....  -->
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h1
						style:color={data.theme.colours.primary}
						style:font-size={fontSize(data.theme.typography.header_title.size)}
					>
						{page.params.user}'s schedule
					</h1>
					<!-- <h1 style:font-size={data.theme?.typography.headingSize}>{data.schedule.title}</h1> -->
					<p style:font-size={fontSize(data.theme.typography.header_description.size)}>
						<!-- TODO: if schedule description is too long then it looks terrible :D -->
						{data.schedule.description}
					</p>
				</div>
				<div
					class="p-2"
					style:color={data.theme.colours.secondary}
					style:background-color={data.theme.colours.accent}
				>
					{dayjs().weekday(1).format('DD')} →
					{dayjs().weekday(7).format('DD')}
				</div>
			</div>

			{#if data.theme.layout.items === 'list'}
				<div class="flex flex-col"
						 style:gap={`${2 * parseInt(data.theme.layout.gap)}px`}>
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
						 style:gap={`${2 * parseInt(data.theme.layout.gap)}px`}
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
		 {#if animate}
		<div
			style:border={`1px ${data.theme.colours.text} solid`}
			class="sticky top-4 hidden flex-1 items-start lg:block"
			style:order={data.theme.layout.image_position === 'left' ? '0' : '1'}
			transition:blur={{ duration: 500 }}
		>
			<!-- can add flex-1 here for even image to schedule ratio....  -->
			<img src={data.theme.image?.url} alt={data.theme.image?.alt} class="object-cover" />
			<span
				class="absolute bottom-1 right-1 p-1"
				style:background-color={data.theme.colours.secondary}
			>
				@{data.theme.image?.artistAtribution}
			</span>
		</div>
					{/if}
	</div>
	<footer class="">
		<a class={`rounded-full px-5 py-3 text-sm shadow-lg text-white transition-colors`} href="/"
			 style:background-color={data.theme.colours.secondary}
			 style:color={data.theme.colours.text}>
		schedule.com
	</a>
	</footer>
</div>
