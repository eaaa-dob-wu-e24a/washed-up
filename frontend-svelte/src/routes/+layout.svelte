<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import '../app.css';
	import { signOut } from '@auth/sveltekit/client';
	let { children, data } = $props();
</script>

<pre>{JSON.stringify(data.session, null, 2)}</pre>
{#if data.session}
	<Button onclick={() => signOut()}>Sign Out</Button>
{/if}

{@render children()}
