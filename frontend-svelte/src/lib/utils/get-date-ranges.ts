// Utility function for formatting dates to a specific format that is used in the backend

export function getDateRanges(start: Date, end: Date) {
	const startDate = formatDate(start);
	const endDate = formatDate(end);

	return {
		start: startDate,
		end: endDate
	};
}

export function formatDate(date: Date) {
	const string = new Date(date).toLocaleDateString('da-DK').split('.');

	const formattedDate = `${string[2]}-${string[1].padStart(2, '0')}-${string[0].padStart(2, '0')}`;

	return formattedDate;
}
