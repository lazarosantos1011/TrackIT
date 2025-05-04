const API_URL = 'http://localhost:5000/equipamentos';

async function carregarEquipamentos() {
    const response = await fetch(API_URL);
    return await response.json();
}

async function salvarEquipamentos(equipamentos) {
    // Detecta se é criação ou atualização com base no id
    for (const equipamento of equipamentos) {
        if (equipamento.id) {
            await fetch(`${API_URL}/${equipamento.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(equipamento)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(equipamento)
            });
        }
    }
}

async function excluirEquipamentoPorId(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}

export {
    carregarEquipamentos,
    salvarEquipamentos,
    excluirEquipamentoPorId
};
