<script>
	import SignUpForm from './sign-up-form.svelte';

	let { data } = $props();
</script>

<SignUpForm data={data.form} />
