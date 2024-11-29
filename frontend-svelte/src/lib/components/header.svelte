<script lang="ts">
	import type { Session } from '@auth/sveltekit';
	import Button from './ui/button/button.svelte';
	import { signOut } from '@auth/sveltekit/client';

	let { session }: { session: Session | null } = $props();
</script>

<header>
	<nav>
		<ul>
			<li>
				<a href="/">Home</a>
			</li>
		</ul>
	</nav>

	{#if session}
		<Button onclick={() => signOut()}>Sign Out</Button>
	{/if}
</header>
