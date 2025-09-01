<script lang="ts">
	import Counter from './Counter.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="showcase-gradient min-h-[80vh]">
	<div class="flex flex-col text-left gap-4 p-8 w-full justify-center items-center">
		<h1 class="text-5xl font-bold tracking-wide">your content schedule, simplified.</h1>
		<p class="font-light">share your schedule with your audience worldwide—no more timezone confusion, no more missed connections</p>
	</div>
	<!-- <picture>
		<img src="https://i.pinimg.com/736x/8c/34/dd/8c34ddbe9d9c3f5b0af2b14bfe989a2c.jpg" alt="Welcome" />
	</picture> -->
	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
	
	.showcase-gradient {
		background-image: linear-gradient(180deg,#fafafa 0,hsla(0,0%,98%,0) 50%),
											radial-gradient(51% 51% at -11% 9%,#8c00ffa1 1%,#ff57dd00 100%),
											radial-gradient(51% 67% at 115% 96%,#8c00ffa1 0,#ff57dd00 100%),
											radial-gradient(50% 66% at 50% 50%,#e9d5ffa3 0,#ff57dd00 100%),
											radial-gradient(22% 117% at 2% 87%,#00f3ba00 20%,#e9d5ffa3 100%),
											linear-gradient(0deg,#61cdffa3,#61cdffa3);
		}

	/* img {
		width: 100%;
		height: auto;
		max-width: 400px;
		border-radius: 10px;
	} */
</style>
