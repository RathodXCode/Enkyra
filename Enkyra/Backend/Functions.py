import base64
import os
import json
import shutil
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from flask import jsonify

# Create a dedicated folder for encrypted files
ENCRYPTION_FOLDER = 'encrypted_files'
os.makedirs(ENCRYPTION_FOLDER, exist_ok=True)

# AES Encryption function
def encrypt_message(message, password):
    """Encrypt a message using AES encryption with the provided password"""
    if not message or not password:
        return None, "Message and password cannot be empty"

    try:
        # Convert inputs to bytes
        message_bytes = message.encode('utf-8')
        # Derive a key from the password (in a real app, use a proper key derivation function)
        key = password.encode('utf-8')
        key = key + b'0' * (32 - len(key)) if len(key) < 32 else key[:32]

        # Generate a random initialization vector
        iv = get_random_bytes(16)

        # Create cipher object and encrypt
        cipher = AES.new(key, AES.MODE_CBC, iv)
        ct_bytes = cipher.encrypt(pad(message_bytes, AES.block_size))

        # Encode the IV and ciphertext to base64
        iv_b64 = base64.b64encode(iv).decode('utf-8')
        ct_b64 = base64.b64encode(ct_bytes).decode('utf-8')

        # Return the IV and ciphertext as a JSON string
        result = json.dumps({'iv': iv_b64, 'ciphertext': ct_b64})
        return result, None
    except Exception as e:
        return None, f"Encryption error: {str(e)}"

# AES Decryption function
def decrypt_message(encrypted_data, password):
    """Decrypt a message using AES decryption with the provided password"""
    if not encrypted_data or not password:
        return None, "Encrypted message and password cannot be empty"

    try:
        # Parse the JSON string
        try:
            data = json.loads(encrypted_data)
            iv = base64.b64decode(data['iv'])
            ct = base64.b64decode(data['ciphertext'])
        except (json.JSONDecodeError, KeyError):
            return None, "Invalid encrypted message format"

        # Derive the key from the password
        key = password.encode('utf-8')
        key = key + b'0' * (32 - len(key)) if len(key) < 32 else key[:32]

        # Create cipher object and decrypt
        cipher = AES.new(key, AES.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(ct), AES.block_size)

        # Return the decrypted message
        return pt.decode('utf-8'), None
    except Exception as e:
        return None, f"Decryption error: {str(e)}"

# Save encrypted message to file
def save_message(encrypted_data, file_path):
    """Save an encrypted message to a file in the dedicated encryption folder"""
    if not file_path:
        return None, "File path cannot be empty"

    try:
        # Ensure we only use the filename, not any path that might be provided
        file_name = os.path.basename(file_path)
        full_path = os.path.join(ENCRYPTION_FOLDER, file_name)

        with open(full_path, 'w') as f:
            f.write(encrypted_data)
        return "Message saved successfully to encrypted_files folder", None
    except Exception as e:
        return None, f"Save error: {str(e)}"

# Load encrypted message from file
def load_message(file_path):
    """Load an encrypted message from a file in the dedicated encryption folder"""
    if not file_path:
        return None, "File path cannot be empty"

    try:
        # Ensure we only use the filename, not any path that might be provided
        file_name = os.path.basename(file_path)
        full_path = os.path.join(ENCRYPTION_FOLDER, file_name)

        if not os.path.exists(full_path):
            return None, f"File not found in encrypted_files folder: {file_name}"

        with open(full_path, 'r') as f:
            encrypted_data = f.read()
        return encrypted_data, None
    except Exception as e:
        return None, f"Load error: {str(e)}"

# Clear all encrypted files
def clear_encryptions():
    """Clear all encrypted files from the dedicated encryption folder"""
    try:
        # Check if the folder exists
        if not os.path.exists(ENCRYPTION_FOLDER):
            return None, "Encryption folder does not exist"

        # Remove all files in the folder
        for filename in os.listdir(ENCRYPTION_FOLDER):
            file_path = os.path.join(ENCRYPTION_FOLDER, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

        return "All encrypted files have been cleared", None
    except Exception as e:
        return None, f"Clear error: {str(e)}"
