<script lang="ts">
	import '../app.css';
	import dayjs from "dayjs";
	import { getLocale } from '$lib/paraglide/runtime';
  import ja from "dayjs/locale/ja";
	import isoWeek from 'dayjs/plugin/isoWeek';
	import weekday from 'dayjs/plugin/weekday';
	import { Toaster } from 'svelte-french-toast';
	import { page } from '$app/state';

	dayjs.extend(weekday);
	dayjs.extend(isoWeek);
	
	// TODO: come up with a better way to handle locales ? 
	const locale = getLocale();
  dayjs.locale(locale);

	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>

<Toaster position="bottom-center" />

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #F9F8FA;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
	}
</style>
