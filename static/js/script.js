async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert("Upload failed: " + errorText);
            return;
        }

        const data = await response.json();
        document.getElementById("transferCode").innerText = data.code;
        document.getElementById("qrCodeImage").src = data.qr_code_url;
        startCountdown(600); // Start 10-minute countdown

        // Update the history dynamically
        updateHistory();

        showScanPopup();
    } catch (error) {
        alert("Upload failed: " + error);
    }
}

async function downloadFile() {
    const code = document.getElementById("codeInput").value.trim();
    if (!code) {
        alert("Enter the code to download the file.");
        return;
    }

    try {
        const response = await fetch(`/download/${code}`);
        if (!response.ok) {
            const errorText = await response.text();
            alert("Error: " + errorText);
            return;
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'downloaded_file';

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match && match[1]) {
                filename = match[1];
            }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        // After successful download, update the history dynamically
        await updateHistory();
    } catch (error) {
        alert("Download failed: " + error);
    }
}
//update histroy
async function updateHistory() {
    try {
        const res = await fetch("/get_history");
        const history = await res.json();
        const container = document.getElementById("historyContainer");

        container.innerHTML = ""; // Clear the existing history content

        if (history.length === 0) {
            container.innerHTML = "No history available."; // Show message when there is no history
        }

        history.forEach(entry => {
            const div = document.createElement("div");
            div.className = "history-entry";

            const isSender = entry.sender_ip === currentUserIp;
            const isReceiver = entry.receiver_ip === currentUserIp;

            const senderIp = isSender ? entry.sender_ip : 'Hidden';
            const receiverIp = isReceiver ? entry.receiver_ip : 'Hidden';

            div.innerHTML = `
                <strong>Sender IP:</strong> ${entry.sender_ip}<br>
                <strong>Receiver IP:</strong> ${entry.receiver_ip || 'Pending'}<br>
                <strong>Filename:</strong> ${entry.filename}
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Failed to update history:", error);
    }
}

// Automatically update history on page load
window.addEventListener("DOMContentLoaded", updateHistory);
//his end
function copyCode() {
    const code = document.getElementById("transferCode").innerText;
    navigator.clipboard.writeText(code);
    const btn = document.getElementById("copyCodeButton");
    btn.classList.add("copied");
    setTimeout(() => btn.classList.remove("copied"), 1000);
}

function showScanPopup() {
    document.getElementById("scan").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function hideScanPopup() {
    document.getElementById("scan").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Time countdown function
function startCountdown(durationInSeconds) {
    const expiryTimeElement = document.getElementById("expiryTime");
    let remaining = durationInSeconds;

    const interval = setInterval(() => {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        expiryTimeElement.textContent = `Expires in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (remaining <= 0) {
            clearInterval(interval);
            expiryTimeElement.textContent = "File expired.";
        }

        remaining--;
    }, 1000);
}
//qr
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Get 'code' from the URL parameters
    if (code) {
        const receiveInput = document.getElementById('codeInput'); // Get the input field by id
        if (receiveInput) {
            receiveInput.value = code; // Paste the code into the codeInput field
        }
    }
});
//database connection
