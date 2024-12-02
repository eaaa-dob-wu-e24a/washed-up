export type MachineStatus = {
	text: string;
	class: string;
};

export const MACHINE_STATUS = {
	OFFLINE: 0,
	AVAILABLE: 1,
	IN_USE: 2,
	MAINTENANCE: 3
} as const;

export function getMachineStatus(status: number): MachineStatus {
	switch (status) {
		case MACHINE_STATUS.OFFLINE:
			return {
				text: 'Offline',
				class: 'bg-red-500'
			};
		case MACHINE_STATUS.AVAILABLE:
			return {
				text: 'Available',
				class: 'bg-green-500'
			};
		case MACHINE_STATUS.IN_USE:
			return {
				text: 'In Use',
				class: 'bg-yellow-500'
			};
		case MACHINE_STATUS.MAINTENANCE:
			return {
				text: 'Maintenance',
				class: 'bg-blue-500'
			};
		default:
			return {
				text: 'Unknown',
				class: 'bg-gray-500'
			};
	}
}
