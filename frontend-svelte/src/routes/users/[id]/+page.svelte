<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Loader2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	const { user } = data;

	// Get user initials for avatar fallback
	const initials = user?.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	// Format date helper
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('da-DK', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const now = new Date();

	// Sort the schedules by start time
	let sortedSchedules = $state(
		[...(user?.schedules || [])].sort(
			(a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
		)
	);

	// Get running now schedules
	const runningNow = $derived(
		sortedSchedules.filter(
			(schedule) => new Date(schedule.start_time) <= now && new Date(schedule.end_time) > now
		)
	);

	// Get upcoming schedules
	const upcomingSessions = $derived(
		sortedSchedules.filter((schedule) => new Date(schedule.start_time) > now)
	);

	// Get past schedules
	const pastSessions = $derived(
		sortedSchedules.filter((schedule) => new Date(schedule.end_time) <= now)
	);

	// Define form loading state
	let formLoading: {
		loading: boolean;
		id: string | null;
	} = $state({
		loading: false,
		id: null
	});
</script>

<div class="mx-auto max-w-7xl">
	<!-- User Header -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-4">
				<Avatar.Root>
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<h1 class="text-2xl font-bold">{user?.name}</h1>
					<div class="flex items-center gap-2">
						<span class="text-muted-foreground">{user?.email}</span>
						<Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
							{user?.role}
						</Badge>
					</div>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<!-- User Stats -->
			<div class="grid gap-4 md:grid-cols-3">
				<div class="rounded-lg border p-4">
					<h3 class="text-muted-foreground text-sm font-medium">Credits</h3>
					<p class="mt-2 text-2xl font-bold">{user?.credits.amount}</p>
				</div>
				<div class="rounded-lg border p-4">
					<h3 class="text-muted-foreground text-sm font-medium">Member Since</h3>
					<p class="mt-2 font-medium">{formatDate(user?.created_at ?? '')}</p>
				</div>
				<div class="rounded-lg border p-4">
					<h3 class="text-muted-foreground text-sm font-medium">Scheduled Sessions</h3>
					<p class="mt-2 text-2xl font-bold">{user?.schedules.length}</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
	<!-- Schedules -->
	<div>
		{#if runningNow.length > 0}
			<h2 class="mb-4 mt-16 text-xl font-semibold">Running Now</h2>
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
									sortedSchedules = sortedSchedules.filter((s) => s.id !== schedule.id);
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
			<h2 class="mb-4 mt-16 text-xl font-semibold">Upcoming Sessions</h2>
			<div class="space-y-4">
				{#each upcomingSessions as schedule}
					<div class="flex items-center justify-between rounded-lg border p-4">
						<div>
							<p class="font-medium">Machine #{schedule.machine_id}</p>
							<p class="text-muted-foreground text-sm">
								{new Date(schedule.start_time).toLocaleString('da-DK', {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric',
									hour: 'numeric',
									minute: '2-digit'
								})} - {new Date(schedule.end_time).toLocaleTimeString('da-DK', {
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
									sortedSchedules = sortedSchedules.filter((s) => s.id !== schedule.id);
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
			<h2 class="mb-4 mt-16 text-xl font-semibold">Past Sessions</h2>
			<div class="space-y-4">
				{#each pastSessions as schedule}
					<div class="flex items-center justify-between rounded-lg border p-4">
						<div>
							<p class="font-medium">Machine #{schedule.machine_id}</p>
							<p class="text-muted-foreground text-sm">
								{new Date(schedule.start_time).toLocaleString('da-DK', {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric',
									hour: 'numeric',
									minute: '2-digit'
								})} - {new Date(schedule.end_time).toLocaleTimeString('da-DK', {
									hour: 'numeric',
									minute: '2-digit'
								})}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
