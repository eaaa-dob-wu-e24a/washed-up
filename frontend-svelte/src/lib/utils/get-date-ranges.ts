export function getDateRanges(start: Date, end: Date) {
	const startDate = formatDate(start);
	const endDate = formatDate(end);

	return {
		start: startDate,
		end: endDate
	};
}

export function formatDate(date: Date) {
	const string = new Date(date.toLocaleString()).toLocaleDateString().split('/');
	return `${string[2]}-${string[0]}-${string[1]}`;
}
