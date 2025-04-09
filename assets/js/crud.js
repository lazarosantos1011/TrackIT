function carregarEquipamentos() {
    return JSON.parse(localStorage.getItem('equipamentos')) || [];
}

function salvarEquipamentos(equipamentos) {
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
}

function excluirEquipamentoPorId(equipamentos, id) {
    return equipamentos.filter(e => e.id !== id);
}

export { carregarEquipamentos, salvarEquipamentos, excluirEquipamentoPorId };