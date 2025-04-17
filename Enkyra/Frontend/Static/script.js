        // DOM Elements
        const messageInput = document.getElementById('message');
        const recipientInput = document.getElementById('recipient');
        const passwordInput = document.getElementById('password');
        const outputTextarea = document.getElementById('output');
        const statusMessage = document.getElementById('statusMessage');
        const encryptBtn = document.getElementById('encryptBtn');
        const decryptBtn = document.getElementById('decryptBtn');
        const saveBtn = document.getElementById('saveBtn');
        const loadBtn = document.getElementById('loadBtn');
        const copyBtn = document.getElementById('copyBtn');
        const togglePassword = document.getElementById('togglePassword');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        const clearEncryptionsBtn = document.getElementById('clearEncryptionsBtn');
        const encryptedCount = document.getElementById('encryptedCount');
        const decryptedCount = document.getElementById('decryptedCount');
        const savedCount = document.getElementById('savedCount');
        const historyTable = document.getElementById('historyTable');

        // Stats counters
        let stats = {
            encrypted: 0,
            decrypted: 0,
            saved: 0
        };

        // Message history
        let messageHistory = [];

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Load stats from localStorage if available
            const savedStats = localStorage.getItem('enkyraStats');
            if (savedStats) {
                stats = JSON.parse(savedStats);
                updateStats();
            }

            // Load history from localStorage if available
            const savedHistory = localStorage.getItem('enkyraHistory');
            if (savedHistory) {
                messageHistory = JSON.parse(savedHistory);
                updateHistoryTable();
            }
        });

        // Event Listeners
        encryptBtn.addEventListener('click', encryptMessage);
        decryptBtn.addEventListener('click', decryptMessage);
        saveBtn.addEventListener('click', saveMessage);
        loadBtn.addEventListener('click', loadMessage);
        copyBtn.addEventListener('click', copyOutput);
        togglePassword.addEventListener('click', togglePasswordVisibility);
        clearHistoryBtn.addEventListener('click', clearHistory);
        clearEncryptionsBtn.addEventListener('click', clearEncryptions);

        // Functions
        function encryptMessage() {
            const message = messageInput.value.trim();
            const password = passwordInput.value.trim();
            const recipient = recipientInput.value.trim();

            if (!message) {
                showStatus('Please enter a message to encrypt', 'error');
                return;
            }

            if (!password) {
                showStatus('Please enter an encryption password', 'error');
                return;
            }

            // Show loading status
            showStatus('Encrypting message...', 'info');

            // Call the backend API
            fetch('/api/encrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    outputTextarea.value = data.encrypted_message;
                    stats.encrypted++;
                    updateStats();

                    // Add to history
                    addToHistory('encrypted', recipient);

                    showStatus('Message encrypted successfully!', 'success');
                } else {
                    showStatus('Encryption failed: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showStatus('Error: ' + error.message, 'error');
            });
        }

        function decryptMessage() {
            const message = messageInput.value.trim();
            const password = passwordInput.value.trim();
            const recipient = recipientInput.value.trim();

            if (!message) {
                showStatus('Please enter a message to decrypt', 'error');
                return;
            }

            if (!password) {
                showStatus('Please enter the decryption password', 'error');
                return;
            }

            // Show loading status
            showStatus('Decrypting message...', 'info');

            // Call the backend API
            fetch('/api/decrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    encrypted_message: message,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    outputTextarea.value = data.decrypted_message;
                    stats.decrypted++;
                    updateStats();

                    // Add to history
                    addToHistory('decrypted', recipient);

                    showStatus('Message decrypted successfully!', 'success');
                } else {
                    showStatus('Decryption failed: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showStatus('Error: ' + error.message, 'error');
            });
        }

        function saveMessage() {
            const output = outputTextarea.value.trim();
            const recipient = recipientInput.value.trim();

            if (!output) {
                showStatus('Nothing to save. Please encrypt a message first.', 'error');
                return;
            }

            // Prompt for file path
            const fileName = prompt('Enter a file name to save the encrypted message:', 'encrypted_message.txt');

            if (!fileName) {
                showStatus('Save cancelled', 'info');
                return;
            }

            // Show loading status
            showStatus('Saving encrypted message...', 'info');

            // Call the backend API
            fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    encrypted_message: output,
                    file_path: fileName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    stats.saved++;
                    updateStats();

                    // Add to history
                    addToHistory('saved', recipient);

                    showStatus('Message saved successfully!', 'success');
                } else {
                    showStatus('Save failed: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showStatus('Error: ' + error.message, 'error');
            });
        }

        function loadMessage() {
            // Prompt for file path
            const fileName = prompt('Enter the file name to load the encrypted message from:', 'encrypted_message.txt');

            if (!fileName) {
                showStatus('Load cancelled', 'info');
                return;
            }

            // Show loading status
            showStatus('Loading encrypted message...', 'info');

            // Call the backend API
            fetch('/api/load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_path: fileName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageInput.value = data.encrypted_message;
                    showStatus('Message loaded successfully! You can now decrypt it.', 'success');
                } else {
                    showStatus('Load failed: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showStatus('Error: ' + error.message, 'error');
            });
        }

        function copyOutput() {
            const output = outputTextarea.value;
            if (!output) {
                showStatus('Nothing to copy', 'error');
                return;
            }

            navigator.clipboard.writeText(output)
                .then(() => {
                    showStatus('Copied to clipboard!', 'success');
                })
                .catch(err => {
                    showStatus('Failed to copy: ' + err, 'error');
                });
        }

        function togglePasswordVisibility() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        }

        function showStatus(message, type) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message text-sm p-3 rounded-lg fade-in ${getStatusClass(type)}`;
            statusMessage.classList.remove('hidden');

            // Hide after 5 seconds
            setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }

        function getStatusClass(type) {
            switch(type) {
                case 'success': return 'bg-green-900/50 text-green-300';
                case 'error': return 'bg-red-900/50 text-red-300';
                case 'info': return 'bg-blue-900/50 text-blue-300';
                default: return 'bg-slate-800/50 text-slate-300';
            }
        }

        function updateStats() {
            encryptedCount.textContent = stats.encrypted;
            decryptedCount.textContent = stats.decrypted;
            savedCount.textContent = stats.saved;

            // Save to localStorage
            localStorage.setItem('enkyraStats', JSON.stringify(stats));
        }

        function addToHistory(action, recipient) {
            const now = new Date();
            const historyItem = {
                id: Date.now(),
                date: now.toLocaleString(),
                action: action,
                recipient: recipient || 'Anonymous',
                message: messageInput.value.substring(0, 30) + (messageInput.value.length > 30 ? '...' : '')
            };

            messageHistory.unshift(historyItem);

            // Keep only last 10 items
            if (messageHistory.length > 10) {
                messageHistory = messageHistory.slice(0, 10);
            }

            updateHistoryTable();

            // Save to localStorage
            localStorage.setItem('enkyraHistory', JSON.stringify(messageHistory));
        }

        function updateHistoryTable() {
            historyTable.innerHTML = '';

            if (messageHistory.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="4" class="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm text-slate-400">No history yet. Encrypt or decrypt a message to get started.</td>
                `;
                historyTable.appendChild(row);
                return;
            }

            messageHistory.forEach(item => {
                const row = document.createElement('tr');

                let actionBadge = '';
                switch(item.action) {
                    case 'encrypted':
                        actionBadge = '<span class="px-1 sm:px-2 py-1 text-xs rounded-full bg-indigo-900/50 text-indigo-300">Encrypted</span>';
                        break;
                    case 'decrypted':
                        actionBadge = '<span class="px-1 sm:px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-300">Decrypted</span>';
                        break;
                    case 'saved':
                        actionBadge = '<span class="px-1 sm:px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300">Saved</span>';
                        break;
                }

                row.innerHTML = `
                    <td class="px-2 sm:px-4 py-2 sm:py-3">${item.date}</td>
                    <td class="px-2 sm:px-4 py-2 sm:py-3">${item.recipient}</td>
                    <td class="px-2 sm:px-4 py-2 sm:py-3">${actionBadge}</td>
                    <td class="px-2 sm:px-4 py-2 sm:py-3">
                        <button onclick="loadHistoryItem(${item.id})" class="text-indigo-400 hover:text-indigo-300 text-xs sm:text-sm">
                            <i class="fas fa-redo mr-1"></i> Reload
                        </button>
                    </td>
                `;

                historyTable.appendChild(row);
            });
        }

        function loadHistoryItem(id) {
            const item = messageHistory.find(i => i.id === id);
            if (item) {
                messageInput.value = item.message;
                recipientInput.value = item.recipient;
                showStatus(`Loaded message from history (${item.action})`, 'info');
            }
        }

        function clearHistory() {
            if (confirm('Are you sure you want to clear your message history? This cannot be undone.')) {
                // Clear history array
                messageHistory = [];

                // Update the history table
                updateHistoryTable();

                // Clear localStorage
                localStorage.removeItem('enkyraHistory');

                // Reset stats
                stats = {
                    encrypted: 0,
                    decrypted: 0,
                    saved: 0
                };

                // Update stats display
                updateStats();

                // Clear localStorage stats
                localStorage.removeItem('enkyraStats');

                showStatus('Message history and stats cleared successfully!', 'success');
            }
        }

        function clearEncryptions() {
            if (confirm('Are you sure you want to clear all encrypted files? This cannot be undone.')) {
                // Show loading status
                showStatus('Clearing encrypted files...', 'info');

                // Call the backend API
                fetch('/api/clear', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showStatus(data.message, 'success');
                    } else {
                        showStatus('Failed to clear encrypted files: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    showStatus('Error: ' + error.message, 'error');
                });
            }
        }

