<script lang="ts">
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	// Get user initials for avatar fallback
	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	// Format date helper
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex flex-col justify-between gap-6 sm:flex-row">
		<div>
			<h2 class="mb-1 text-xl font-semibold">Users</h2>
			<p class="text-muted-foreground text-sm">Here you can manage your users.</p>
		</div>
	</div>

	<div class="grid gap-4">
		{#each data.users as user}
			<a
				href={`/users/${user.id}`}
				class="bg-card flex items-center justify-between rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="flex items-start gap-4">
					<Avatar>
						<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
					</Avatar>
					<div>
						<h2 class="text-lg font-semibold">{user.name}</h2>
						<p class="text-muted-foreground text-sm">{user.email}</p>
						<div class="mt-1 flex items-center gap-2">
							<Badge variant="secondary" class="text-xs">
								{user.role}
							</Badge>
							<span class="text-muted-foreground text-xs">
								Joined {formatDate(user.created_at)}
							</span>
						</div>
					</div>
				</div>

				<Button variant="outline">View Profile</Button>
			</a>
		{/each}
	</div>
</div>
