# Password Manager Chrome Extension

This Chrome extension provides a secure and user-friendly solution for managing passwords. It includes a powerful password generator and a secure password vault, ensuring your online accounts remain protected. The vault is encrypted and securely stored in Firebase, combining modern web technologies for functionality and security.

## Features

### 1. **Password Generator**
- Generate strong, secure passwords with customizable options (length, special characters, numbers, etc.).
- Avoid using weak or easily guessable passwords by utilizing the randomization algorithm.

### 2. **Secure Password Vault**
- Encrypted storage for all your passwords using AES encryption.
- Passwords are securely synced to Firebase for cloud-based accessibility.
- Accessible only through the extension with a master password.

### 3. **Master Password Protection**
- A single master password to unlock your password vault.
- Master password is not stored anywhere for enhanced security.

### 4. **Cross-Device Synchronization**
- Access your passwords from any device using Chrome with the extension installed.
- Firebase ensures seamless synchronization across devices.

### 5. **User-Friendly Interface**
- Built with React.js for a smooth, responsive user experience.
- Intuitive design for quick access and management of stored credentials.

### 6. **Browser Integration**
- Developed using Vanilla JS for web browser services, ensuring optimal performance and compatibility.
- Autofill functionality for easy login into websites.

### 7. **Lightweight and Secure**
- Minimal impact on browser performance.
- Regular updates and code audits to ensure security and reliability.

## Technologies Used
- **Frontend**: React.js for UI components.
- **Backend**: Firebase for encrypted storage and synchronization.
- **Browser Integration**: Vanilla JS for seamless Chrome API interactions.

<img width="640" alt="passvault" src="https://github.com/user-attachments/assets/6aeea496-ebbd-4446-bd21-4fdc09f01e81" />


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-manager-extension.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `build` folder.

## Usage
1. Set a master password when you first use the extension.
2. Add, view, and manage passwords in the secure vault.
3. Use the password generator to create strong passwords for new accounts.
4. Autofill passwords on websites directly from the extension.

## Security Practices
- Ensure your master password is strong and unique.
- Regularly back up your data.
- Use the latest version of the extension to benefit from security updates.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the [MIT License](LICENSE).
