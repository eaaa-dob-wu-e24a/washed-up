<script lang="ts">
	import type { Machine } from '@/types';

	let { data }: { data: { machines: Machine[] } } = $props();
</script>

<pre>{JSON.stringify(data.machines, null, 2)}</pre>
