<script>
	import SignInForm from './sign-in-form.svelte';
	import { page } from '$app/stores';

	const urlError = $derived($page.url.searchParams.get('error'));
</script>

<div class="flex h-screen w-full flex-col items-center justify-center px-4">
	{#if urlError}
		<div class="mx-auto mb-4 max-w-md rounded-md bg-red-50 p-4 text-red-700">
			Invalid credentials, please try again.
		</div>
	{/if}

	<SignInForm />
</div>
