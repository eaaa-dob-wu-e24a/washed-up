<script lang="ts">
	const { data } = $props();
</script>

<a href="/">Go back to Home</a>

<pre>{JSON.stringify(data.books, null, 2)}</pre>
