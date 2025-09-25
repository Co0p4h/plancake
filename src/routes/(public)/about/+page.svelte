<svelte:head>
	<title>About</title>
	<meta name="description" content="About plancake" />
</svelte:head>

<section class="min-h-[75vh] z-10 gap-6">
	<div class="flex flex-col text-left gap-6 px-4 w-full max-w-2xl justify-center items-center">
		<h1 class="text-5xl font-bold tracking-wide text-left w-full">about <span id="underline">plancake</span></h1>
		<div class="font-light text-left w-full space-y-4">
			<p>we built plancake because sharing schedules shouldn't be complicated.</p>
			<p>whether you're streaming, creating content, or just want to let people know when you're around - we've got you covered.</p>
			<p>no fancy features you don't need. just clean, customisable schedules that actually work.</p>
		</div>
	</div>
</section>

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
