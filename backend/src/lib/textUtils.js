export function generateSummary(text, maxLength = 160) {
    if (!text) return "";
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (clean.length <= maxLength) return clean;
    return clean.slice(0, maxLength - 1).trimEnd() + "…";
}

export function suggestTags(text, maxTags = 5) {
    if (!text) return [];
    const normalized = String(text).toLowerCase();
    const candidates = new Set();

    // naive keyword extraction
    const words = normalized
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .filter((w) => w.length >= 4 && w.length <= 20);

    const stop = new Set([
        "this","that","with","from","have","there","their","about","which","would","these","those","into","your","been","were","what","when","where","then","them","they","themself","also","just","like","some","more","than","because","could","should","while","after","before","within","using","make","made","many","much","very","such"
    ]);

    const freq = new Map();
    for (const w of words) {
        if (stop.has(w)) continue;
        freq.set(w, (freq.get(w) || 0) + 1);
    }

    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
    for (const [w] of sorted) {
        candidates.add(w);
        if (candidates.size >= maxTags) break;
    }
    return Array.from(candidates);
}


