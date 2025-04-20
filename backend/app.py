from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

equipamentos = []
current_id = 1

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

if __name__ == '__main__':
    app.run(debug=True)
