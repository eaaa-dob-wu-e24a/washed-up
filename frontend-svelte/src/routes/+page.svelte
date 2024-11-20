<script>
	import Button from '@/components/ui/button/button.svelte';
	let count = $state(0);
</script>

<h1>Welcome to SvelteKit</h1>

<a href="/about">Go to About</a>

<Button onclick={() => count++}>
	Press me baby! {count} more times
</Button>
