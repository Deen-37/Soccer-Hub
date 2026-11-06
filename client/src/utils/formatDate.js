// Exact timestamp, shown on hover as a tooltip — e.g. "Aug 2, 2026, 3:45 PM"
export const formatExact = (value) =>
    new Date(value).toLocaleString(undefined, {   // read the stored creation time
        month: "short",    // "Aug"
        day: "numeric",    // "2"
        year: "numeric",   // "2026"
        hour: "numeric",   // "3"
        minute: "2-digit", // "45"
    });

// Friendly relative label — e.g. "3 hours ago"
export const formatRelative = (value) => {
    const then = new Date(value);                            // the post's creation time
    const seconds = Math.floor((Date.now() - then) / 1000); // how many seconds ago that was

    // units from largest to smallest, with how many seconds each one holds
    const units = [
        ["year", 31536000],  // 365 days
        ["month", 2592000],  // 30 days
        ["day", 86400],      // 24 hours
        ["hour", 3600],      // 60 minutes
        ["minute", 60],      // 60 seconds
    ];

    // Intl formatter that turns (-3, "hour") into the text "3 hours ago"
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    // walk from the biggest unit down; use the first one that fits at least once
    for (const [unit, secondsInUnit] of units) {
        const amount = Math.floor(seconds / secondsInUnit); // how many of this unit have passed
        if (amount >= 1) return rtf.format(-amount, unit);  // negative = in the past -> "... ago"
    }
    return "just now"; // under a minute old
};
