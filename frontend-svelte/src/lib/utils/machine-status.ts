// Utility function for getting the machine status

import type { BadgeVariant } from '@/components/ui/badge';

export type MachineStatus = {
	text: string;
	variant: BadgeVariant;
};

export const MACHINE_STATUS = {
	OFFLINE: 0,
	AVAILABLE: 1
} as const;

export function getMachineStatus(status: number): MachineStatus {
	switch (status) {
		case MACHINE_STATUS.OFFLINE:
			return {
				text: 'Offline',
				variant: 'destructive'
			};
		case MACHINE_STATUS.AVAILABLE:
			return {
				text: 'Available',
				variant: 'default'
			};
		default:
			return {
				text: 'Unknown',
				variant: 'default'
			};
	}
}
