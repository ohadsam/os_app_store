// Applies the saved theme before first paint (external file: the CSP forbids inline scripts).
try { const v = localStorage.getItem('os.theme'); if (v === 'light' || v === 'dark') document.documentElement.dataset.theme = v; } catch { /* storage blocked: follow the system */ }
