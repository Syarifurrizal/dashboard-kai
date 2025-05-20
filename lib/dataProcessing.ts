export function parseDataStructure(rawData: string[][]) {
    const [headers, ...rows] = rawData;

    return rows.map(row => {
        const obj: Record<string, string> = {};

        headers.forEach((key, idx) => {
            obj[key.toLowerCase()] = row[idx] || "";
        });

        return obj;
    });
}