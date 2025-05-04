from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='../assets')
CORS(app)

equipamentos = []
current_id = 1

# Rota para servir o index.html
@app.route('/')
def index():
    return send_from_directory('../', 'index.html')

# Rota para servir o dashboard.html
@app.route('/dashboard')
def dashboard():
    return send_from_directory('../', 'dashboard.html')

# Rota para servir os arquivos estáticos (CSS, JS, imagens...)
@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory(app.static_folder, path)

@app.route('/equipamentos', methods=['GET'])
def listar_equipamentos():
    return jsonify(equipamentos)

@app.route('/equipamentos/<int:id>', methods=['GET'])
def obter_equipamento(id):
    for e in equipamentos:
        if e['id'] == id:
            return jsonify(e)
    return jsonify({'erro': 'Equipamento não encontrado'}), 404

@app.route('/equipamentos', methods=['POST'])
def adicionar_equipamento():
    global current_id
    data = request.json
    data['id'] = current_id
    equipamentos.append(data)
    current_id += 1
    return jsonify(data), 201

@app.route('/equipamentos/<int:id>', methods=['PUT'])
def atualizar_equipamento(id):
    data = request.json
    for i, e in enumerate(equipamentos):
        if e['id'] == id:
            data['id'] = id
            equipamentos[i] = data
            return jsonify(data)
    return jsonify({'erro': 'Equipamento não encontrado'}), 404

@app.route('/equipamentos/<int:id>', methods=['DELETE'])
def excluir_equipamento(id):
    global equipamentos
    equipamentos = [e for e in equipamentos if e['id'] != id]
    return jsonify({'msg': 'Removido'}), 204

# Rota para capturar todas as rotas desconhecidas e redirecionar para o index.html
@app.route('/<path:path>')
def catch_all(path):
    if path == "dashboard":
        return send_from_directory('../', 'dashboard.html')
    return send_from_directory('../', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
