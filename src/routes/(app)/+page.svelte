<script lang="ts">
	import Counter from './Counter.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<picture>
		<img src="https://i.pinimg.com/736x/8c/34/dd/8c34ddbe9d9c3f5b0af2b14bfe989a2c.jpg" alt="Welcome" />
	</picture>
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

	img {
		width: 100%;
		height: auto;
		max-width: 400px;
		border-radius: 10px;
	}
</style>
