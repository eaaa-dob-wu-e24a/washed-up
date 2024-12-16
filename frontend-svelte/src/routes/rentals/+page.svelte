<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Loader2 } from 'lucide-svelte';

	let { data } = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString('da-DK', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	let formLoading: {
		loading: boolean;
		id: string | null;
	} = $state({
		loading: false,
		id: null
	});

	const now = new Date();

	let schedules = $state(
		[...data.schedules].sort(
			(a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
		)
	);

	// Get sessions that are running now
	const runningNow = $derived(
		schedules.filter(
			(schedule) => new Date(schedule.start_time) <= now && new Date(schedule.end_time) > now
		)
	);

	// Get sessions that are upcoming
	const upcomingSessions = $derived(
		schedules.filter((schedule) => new Date(schedule.start_time) > now)
	);

	// Get sessions that are past
	const pastSessions = $derived(
		schedules
			.filter((schedule) => new Date(schedule.end_time) <= now)
			.sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
	);
</script>

<div class="mx-auto mb-20 max-w-7xl">
	<div class="mb-4">
		<h2 class="mb-1 text-xl font-semibold">All Rentals</h2>
		<p class="text-muted-foreground text-sm">
			Here you can see and manage all past, ongoing and upcoming rentals.
		</p>
	</div>

	{#if runningNow.length > 0}
		<h3 class="mb-4 text-lg font-semibold">Running Now</h3>
		<div class="space-y-4">
			{#each runningNow as schedule}
				<div
					class="border-primary bg-primary/5 flex items-center justify-between rounded-lg border p-4"
				>
					<div>
						<p class="font-medium">Machine #{schedule.machine_id}</p>
						<p class="text-muted-foreground text-sm">
							Until {new Date(schedule.end_time).toLocaleTimeString('da-DK', {
								hour: 'numeric',
								minute: '2-digit'
							})}
						</p>
					</div>
					<form
						method="POST"
						action="?/cancel"
						use:enhance={() => {
							formLoading = {
								loading: true,
								id: schedule.id.toString()
							};
							return async ({ update }) => {
								await update();
								formLoading = {
									loading: false,
									id: null
								};
								schedules = schedules.filter((s) => s.id !== schedule.id);
							};
						}}
					>
						<input type="hidden" name="id" value={schedule.id} />
						<Button
							variant="outline"
							type="submit"
							size="sm"
							disabled={formLoading.loading && formLoading.id === schedule.id.toString()}
						>
							{#if formLoading.loading && formLoading.id === schedule.id.toString()}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								Cancel
							{/if}
						</Button>
					</form>
				</div>
			{/each}
		</div>
	{/if}

	{#if upcomingSessions.length > 0}
		<h3 class="mb-4 mt-8 text-lg font-semibold">Upcoming Sessions</h3>
		<div class="space-y-4">
			{#each upcomingSessions as schedule}
				<div class="flex items-center justify-between rounded-lg border p-4">
					<div>
						<p class="font-medium">Machine #{schedule.machine_id}</p>
						<p class="text-muted-foreground text-sm">
							{formatDate(schedule.start_time)} - {new Date(schedule.end_time).toLocaleTimeString(
								'da-DK',
								{
									hour: 'numeric',
									minute: '2-digit'
								}
							)}
						</p>
					</div>
					<form
						method="POST"
						action="?/cancel"
						use:enhance={() => {
							formLoading = {
								loading: true,
								id: schedule.id.toString()
							};
							return async ({ update }) => {
								await update();
								formLoading = {
									loading: false,
									id: null
								};
								schedules = schedules.filter((s) => s.id !== schedule.id);
							};
						}}
					>
						<input type="hidden" name="id" value={schedule.id} />
						<Button
							variant="outline"
							type="submit"
							size="sm"
							disabled={formLoading.loading && formLoading.id === schedule.id.toString()}
						>
							{#if formLoading.loading && formLoading.id === schedule.id.toString()}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								Cancel
							{/if}
						</Button>
					</form>
				</div>
			{/each}
		</div>
	{/if}

	{#if pastSessions.length > 0}
		<h3 class="mb-4 mt-8 text-lg font-semibold">Past Sessions</h3>
		<div class="space-y-4">
			{#each pastSessions as schedule}
				<div class="flex items-center justify-between rounded-lg border p-4">
					<div>
						<p class="font-medium">Machine #{schedule.machine_id}</p>
						<p class="text-muted-foreground text-sm">
							{formatDate(schedule.start_time)} - {new Date(schedule.end_time).toLocaleTimeString(
								'da-DK',
								{
									hour: 'numeric',
									minute: '2-digit'
								}
							)}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
