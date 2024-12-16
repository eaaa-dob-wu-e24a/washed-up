<script lang="ts">
	// This component is from Shadcn Svelte
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { page } from '$app/stores';
	import { cn } from '@/utils';
	import type { MenuItems } from '@/types';

	let {
		items
	}: {
		items: MenuItems[];
	} = $props();

	const pathname = $derived($page.url.pathname);
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						{#if mainItem.items}
							<Collapsible.Trigger class="hover:bg-muted">
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										{#snippet tooltipContent()}
											{mainItem.title}
										{/snippet}
										{#if mainItem.icon}
											<mainItem.icon />
										{/if}
										<span>{mainItem.title} </span>
										<ChevronRight
											class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
						{:else}
							<a href={mainItem.url}>
								<Sidebar.MenuButton
									{...props}
									class={cn('hover:bg-muted', pathname === mainItem.url && 'bg-muted')}
								>
									{#snippet tooltipContent()}
										{mainItem.title}
									{/snippet}
									{#if mainItem.icon}
										<mainItem.icon />
									{/if}
									<span>{mainItem.title}</span>
								</Sidebar.MenuButton>
							</a>
						{/if}
						<Collapsible.Content>
							{#if mainItem.items}
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem
											class={cn(
												'hover:bg-muted rounded-sm',
												pathname === subItem.url && 'bg-muted'
											)}
										>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
