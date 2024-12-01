<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';

	let { ref = $bindable(null), children, ...restProps }: Button.Props = $props();
</script>

<Button.Root type="submit" bind:ref {...restProps} />
