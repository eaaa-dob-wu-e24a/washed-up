<script>
	import SignUpForm from './sign-up-form.svelte';

	let { data } = $props();
</script>

<SignUpForm locations={data.locations} data={data.form} />
