export async function checkPoint({ x, y, r }) {

    const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, r }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed: ${res.status} ${text}`);
    }

    const data = await res.json();

    return data;
}

export async function getPoints() {
    const res = await fetch("/api/get/points");
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed: ${res.status} ${text}`);
    }

    const data = await res.json();

    return data.points;
}