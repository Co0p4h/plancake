<script lang="ts">
	import { fontSize } from '$lib/utils/font';
	import type { ScheduleTheme, ElementTypography } from '$lib/server/db/schema';

	interface Props {
		theme: ScheduleTheme;
		typography: ElementTypography;
		colour?: string;
		class?: string;
		tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
	}

	let { theme, typography, colour, class: className = '', tag = 'div', children } = $props();

	// Create the style object with all the typography properties
	const styles = $derived({
		color: colour || theme.colours.text,
		'font-family': typography.font,
		'font-size': fontSize(typography.size),
		'font-weight': typography.weight,
		'font-style': typography.style,
		'text-transform': typography.capitalisation,
		'text-decoration': typography.decoration,
		'letter-spacing': typography.letter_spacing
	});

	// Convert styles object to CSS string
	const styleString = $derived(Object.entries(styles)
		.filter(([_, value]) => value !== undefined && value !== null)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; '));
</script>

<svelte:element this={tag} class={className} style={styleString}>
  {@render children()}
</svelte:element>
