# 📤 NowShare
Link:- https://nowshare.onrender.com/

NowShare is a secure file-sharing web application that allows users to upload, encrypt, and share files with a unique code or QR. It is built using **Flask**, integrates **MongoDB**, and uses **AES encryption** with the `cryptography` library to ensure secure transfers.

---

## 🚀 Features

- 🔐 **File Encryption**: Files are encrypted before sharing.
- 📎 **Unique Codes**: Every upload generates a unique access code.
- 📷 **QR Code Sharing**: Share access easily with scannable QR codes.
- 🧾 **Temporary History**: Tracks recent uploads in session.
- 🌐 **Deployed on Render**: Can be accessed via a public URL.

---

## 🛠 Tech Stack

- **Backend**: Python (Flask)
- **Frontend**: HTML, CSS, JavaScript (Jinja templates)
- **Database**: MongoDB (via MongoDB Atlas)
- **Security**: AES encryption (`cryptography.Fernet`)
- **Others**: QR Code generation (`qrcode`), File handling

---

## 📂 Project Structure

nowshare-master/
│
├── app.py # Main application file
├── requirements.txt # Dependencies
├── render.yaml # Deployment configuration (Render)
├── static/ # Static files (CSS, JS)
├── templates/ # HTML templates
├── uploads/ # Directory to temporarily store uploaded files
