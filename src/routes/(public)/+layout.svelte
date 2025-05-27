<script lang="ts">
	let { children } = $props();
	console.log('(public) layout');
</script>

{@render children()}
