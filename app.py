from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app) # Fondamentale per Vite!

JSON_FILE = 'anime.json'

# Funzione per leggere il JSON
def load_data():
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Errore lettura file: {e}")
        return []
    
def save_data(data):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
# ROTTA 1: Test rapido per vedere se il server risponde
@app.route('/')
def home():
    return "Il server Flask è attivo! Prova /api/anime"

# ROTTA 2: Quella che serve al tuo frontend
@app.route('/api/anime', methods=['GET'])
def get_anime():
    data = load_data()
    print(f"Caricati {len(data)} anime") # Lo vedrai nel terminale
    return jsonify(data)

@app.route('/api/anime/<int:anime_id>', methods=['PUT'])
def update_anime(anime_id):
    data = load_data()
    updated_anime = request.json
    
    # Cerchiamo l'anime tramite l'indice (o ID se lo hai salvato nel JSON)
    if 0 <= anime_id < len(data):
        data[anime_id] = updated_anime
        save_data(data)
        return jsonify({"status": "success"})
    return jsonify({"status": "error"}), 404

@app.route('/api/anime/<int:anime_id>', methods=['DELETE'])
def delete_anime(anime_id):
    data = load_data()
    if 0 <= anime_id < len(data):
        data.pop(anime_id)
        save_data(data)
        return jsonify({"status": "success"})
    return jsonify({"status": "error"}), 404

if __name__ == '__main__':
    # debug=True riavvia il server da solo quando salvi il file
    app.run(debug=True, host='0.0.0.0', port=5000)
