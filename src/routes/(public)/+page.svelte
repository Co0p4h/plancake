<script lang="ts">
	let username = $state('');
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="min-h-[75vh] z-10 gap-6">
	<div class="flex flex-col text-left gap-6 px-4 w-full max-w-2xl justify-center items-center">
		<h1 class="text-5xl font-bold tracking-wide text-left w-full">your content schedule, <span id="underline">simplified.</span></h1>
		<p class="font-light text-left w-full">share your schedule with your audience worldwide—no more timezone confusion, no more missed connections</p>
	</div>
	<form method="get" action={`/signup?username=${username}`} class="flex flex-col gap-3 w-full max-w-2xl px-4 sm:flex-row" >
		<label for="username-input" class="sr-only">Username</label>

		<input 
			id="username-input"
			name="username"
			bind:value={username} 
			type="text" 
			placeholder="username" 
			class="flex-1 rounded border focus:border-purple-500 focus:outline-none px-4 py-2" 
		/>
		<button 
			type="submit"
			class="px-6 py-2 rounded-md bg-purple-default text-base sm:text-lg text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap">
			claim your schedule now!
		</button>  
	</form>
</section>
<!-- <div class="h-1/2 showcase-gradient fixed bottom-0 left-0 w-full z-1"></div> -->
<div class="h-1/2 showcase-gradient absolute bottom-0 left-0 w-full z-1"></div>

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

		#underline {
			position: relative;
		}

		#underline::after {
			content: "";
			width: 100%;
			height: 10px;
			background-repeat: no-repeat;
			z-index: -1;
			position: absolute;
			bottom: 0;
			left: 0;
			background-image: url("../../lib/images/underline.svg");
		}
</style>
