<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
	const { user } = data;

	// Get user initials for avatar fallback
	const initials = user?.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase();

	// Format date helper
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('da-DK', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const now = new Date();
	const sortedSchedules = $derived(
		[...(user?.schedules || [])].sort(
			(a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
		)
	);

	const runningNow = $derived(
		sortedSchedules.filter(
			(schedule) => new Date(schedule.start_time) <= now && new Date(schedule.end_time) > now
		)
	);

	const upcomingSessions = $derived(
		sortedSchedules.filter((schedule) => new Date(schedule.start_time) > now)
	);
	const pastSessions = $derived(
		sortedSchedules.filter((schedule) => new Date(schedule.start_time) <= now)
	);
</script>

<div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
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
						<Button variant="outline" size="sm">Cancel</Button>
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
						<Button variant="outline" size="sm">Cancel</Button>
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
