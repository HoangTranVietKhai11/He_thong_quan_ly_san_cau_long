const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const shifts = [
  {
    "id": 1,
    "staff_id": 2,
    "start_time": "2026-03-25T00:51:21.799Z",
    "end_time": null,
    "start_cash": "80.00",
    "end_cash": null,
    "notes": null,
    "status": "Open"
  }
];

try {
    const rendered = shifts.map(s => {
        const endCash = parseFloat(s.end_cash) || 0;
        const startCash = parseFloat(s.start_cash) || 0;
        const diff = endCash - startCash;
        return {
            dateStr: s.start_time ? new Date(s.start_time).toLocaleString('vi-VN') : '—',
            endDateStr: s.end_time ? new Date(s.end_time).toLocaleString('vi-VN') : null,
            startFmt: fmt(s.start_cash || 0),
            endFmt: s.end_time ? fmt(s.end_cash || 0) : null,
            diffFmt: fmt(diff)
        };
    });
    console.log("SUCCESS:", rendered);
    
    // Test activeShift logic
    const activeShift = shifts.find(s => s.status === 'Open') || null;
    if (activeShift) {
        console.log("ACTIVE START FMT:", fmt(activeShift.start_cash));
        console.log("ACTIVE START TIME:", new Date(activeShift.start_time).toLocaleString('vi-VN'));
    }
} catch (e) {
    console.error("CRASH:", e);
}
