

export function logMessages(message) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.push(`[${new Date().toISOString()}] ${ message }`);
    localStorage.setItem('logs', JSON.stringify(logs));
    console.log(message);
}

export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}