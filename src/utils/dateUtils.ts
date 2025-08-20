// Utility functions for date and period calculations
export const getNZTDateTime = () => {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Auckland' })).toISOString();
};

export const getNZTDayString = (iso: string) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

export const getPeriodRange = (date: Date, frequency: string) => {
    let start: Date, end: Date;
    if (frequency === 'weekly') {
        const dayOfWeek = date.getDay();
        start = new Date(date);
        start.setDate(date.getDate() - ((dayOfWeek + 6) % 7)); // Monday
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Sunday
    } else if (frequency === 'fortnightly') {
        const dayOfWeek = date.getDay();
        start = new Date(date);
        start.setDate(date.getDate() - ((dayOfWeek + 6) % 7)); // Monday
        end = new Date(start);
        end.setDate(start.getDate() + 13); // 2 Sundays
    } else if (frequency === 'monthly') {
        start = new Date(date.getFullYear(), date.getMonth(), 1);
        end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else {
        start = date;
        end = date;
    }
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    return { start, end };
};
