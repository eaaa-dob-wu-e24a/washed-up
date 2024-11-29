<script lang="ts">
	import Header from '@/components/header.svelte';
	import '../app.css';
	let { children, data } = $props();
</script>

{#if data.session}
	<Header session={data.session} />
{/if}

{@render children()}
