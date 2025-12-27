export async function getTime() {
    const res = await fetch("/api/get/time");
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }
    const data = await res.json();
    const dt = new Date(data.serverTime);
    const pretty = dt.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return pretty;
}