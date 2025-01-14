

export function logMessages(message) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.push(`[${new Date().toISOString()}] ${ message }`);
    localStorage.setItem('logs', JSON.stringify(logs));
    console.log(message);
}

export function showToast(message, type = "success") {
    const container = document.querySelector(".toast-container") || createToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    // Remove the toast after the animation ends
    setTimeout(() => {
        toast.remove();
    }, 4000); // Match the animation duration
}

function createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
}