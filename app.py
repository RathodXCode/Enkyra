# Dependencies
from flask import Flask, render_template, request, jsonify
from Backend.Functions import encrypt_message, decrypt_message, save_message, load_message, clear_encryptions

app = Flask(__name__, template_folder='Frontend/templates', static_folder='Frontend/Static')

@app.route('/')
def home():
    return render_template('landing.html')

@app.route('/app')
def app_page():
    return render_template('index.html')

@app.route('/api/encrypt', methods=['POST'])
def encrypt():
    data = request.get_json()
    message = data.get('message')
    password = data.get('password')

    result, error = encrypt_message(message, password)

    if error:
        return jsonify({'success': False, 'error': error}), 400

    return jsonify({'success': True, 'encrypted_message': result})

@app.route('/api/decrypt', methods=['POST'])
def decrypt():
    data = request.get_json()
    encrypted_message = data.get('encrypted_message')
    password = data.get('password')

    result, error = decrypt_message(encrypted_message, password)

    if error:
        return jsonify({'success': False, 'error': error}), 400

    return jsonify({'success': True, 'decrypted_message': result})

@app.route('/api/save', methods=['POST'])
def save():
    data = request.get_json()
    encrypted_message = data.get('encrypted_message')
    file_path = data.get('file_path')

    result, error = save_message(encrypted_message, file_path)

    if error:
        return jsonify({'success': False, 'error': error}), 400

    return jsonify({'success': True, 'message': result})

@app.route('/api/load', methods=['POST'])
def load():
    data = request.get_json()
    file_path = data.get('file_path')

    result, error = load_message(file_path)

    if error:
        return jsonify({'success': False, 'error': error}), 400

    return jsonify({'success': True, 'encrypted_message': result})

@app.route('/api/clear', methods=['POST'])
def clear():
    result, error = clear_encryptions()

    if error:
        return jsonify({'success': False, 'error': error}), 400

    return jsonify({'success': True, 'message': result})

if __name__ == '__main__':
    app.run(debug=True)