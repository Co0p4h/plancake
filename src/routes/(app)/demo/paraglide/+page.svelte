<script lang="ts">
	import { isLocale, setLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
	import type { PageServerData } from '../$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>{m.hello_world({ name: data.user.username })}</h1>
<p>{m.hello()}</p>
<div>
	<button onclick={() => setLocale('en')}>en</button>
	<button onclick={() => setLocale('ja')}>ja</button>
</div>
