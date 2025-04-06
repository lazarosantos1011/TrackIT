// Dados iniciais (simulação de banco de dados com localStorage)
let equipments = JSON.parse(localStorage.getItem('equipments')) || [];
let currentId = equipments.length ? Math.max(...equipments.map(e => e.id)) + 1 : 1;

// Função para listar equipamentos na tabela
function loadEquipmentList() {
    const tbody = document.getElementById('equipment_list');
    tbody.innerHTML = '';
    equipments.forEach(equipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.id}</td>
            <td>${equipment.name}</td>
            <td>${equipment.type}</td>
            <td>${equipment.status}</td>
            <td>
                <button class="edit" onclick="openModal('edit', ${equipment.id})">Editar</button>
                <button class="delete" onclick="deleteEquipment(${equipment.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Abrir o modal para criar ou editar
function openModal(mode, id = null) {
    const modal = document.getElementById('equipment_modal');
    const form = document.getElementById('equipment_form');
    const title = document.getElementById('modal_title');
    const equipmentIdInput = document.getElementById('equipment_id');

    modal.style.display = 'block';
    form.reset();

    if (mode === 'create') {
        title.textContent = 'Adicionar Equipamento';
        equipmentIdInput.value = '';
    } else if (mode === 'edit' && id) {
        title.textContent = 'Editar Equipamento';
        const equipment = equipments.find(e => e.id === id);
        document.getElementById('name').value = equipment.name;
        document.getElementById('type').value = equipment.type;
        document.getElementById('status').value = equipment.status;
        equipmentIdInput.value = id;
    }
}

function closeModal() {
    document.getElementById('equipment_modal').style.display = 'none';
}

// Salvar equipamento (criar ou atualizar)
document.getElementById('equipment_form').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('equipment_id').value;
    const equipment = {
        id: id ? parseInt(id) : currentId++,
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        status: document.getElementById('status').value
    };

    if (id) {
        // Atualizar equipamento existente
        const index = equipments.findIndex(e => e.id === parseInt(id));
        equipments[index] = equipment;
    } else {
        // Adicionar novo equipamento
        equipments.push(equipment);
    }

    localStorage.setItem('equipments', JSON.stringify(equipments));
    loadEquipmentList();
    closeModal();
});

// Excluir equipamento
function deleteEquipment(id) {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        equipments = equipments.filter(e => e.id !== id);
        localStorage.setItem('equipments', JSON.stringify(equipments));
        loadEquipmentList();
    }
}

// Carregar a lista ao abrir o dashboard
window.onload = loadEquipmentList;