<script>
	import SignInForm from './sign-in-form.svelte';

	let { data } = $props();
</script>

<SignInForm data={data.form} />
