from flask import Blueprint, request, jsonify
from models.database import db
from models.equipamento import Equipamento

equipamento_bp = Blueprint('equipamento', __name__)

@equipamento_bp.route('/equipamentos', methods=['GET'])
def listar_equipamentos():
    equipamentos = Equipamento.query.all()
    return jsonify([e.to_dict() for e in equipamentos])

@equipamento_bp.route('/equipamentos/<int:id>', methods=['GET'])
def obter_equipamento(id):
    equipamento = Equipamento.query.get(id)
    if not equipamento:
        return jsonify({'erro': 'Equipamento não encontrado'}), 404
    return jsonify(equipamento.to_dict())

@equipamento_bp.route('/equipamentos', methods=['POST'])
def adicionar_equipamento():
    data = request.json
    equipamento = Equipamento(nome=data['nome'], tipo=data['tipo'], status=data['status'])
    db.session.add(equipamento)
    db.session.commit()
    return jsonify(equipamento.to_dict()), 201

@equipamento_bp.route('/equipamentos/<int:id>', methods=['PUT'])
def atualizar_equipamento(id):
    data = request.json
    equipamento = Equipamento.query.get(id)
    if not equipamento:
        return jsonify({'erro': 'Equipamento não encontrado'}), 404
    equipamento.nome = data['nome']
    equipamento.tipo = data['tipo']
    equipamento.status = data['status']
    db.session.commit()
    return jsonify(equipamento.to_dict())

@equipamento_bp.route('/equipamentos/<int:id>', methods=['DELETE'])
def excluir_equipamento(id):
    equipamento = Equipamento.query.get(id)
    if not equipamento:
        return jsonify({'erro': 'Equipamento não encontrado'}), 404
    db.session.delete(equipamento)
    db.session.commit()
    return jsonify({'msg': 'Removido'}), 204