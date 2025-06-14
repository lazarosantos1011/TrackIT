import { carregarEquipamentos, salvarEquipamentos, excluirEquipamentoPorId } from "./crud.js";

let equipamentos = [];
let currentId = 1;
let currentPage = 1;
const itemsPerPage = 5;
let metricsChart;
let availabilityChart;

async function carregarMetricas() {
    const total = equipamentos.length;
    const available = equipamentos.filter(e => e.status === 'Disponível').length;
    const maintenance = equipamentos.filter(e => e.status === 'Em Manutenção').length;

    if (metricsChart) {
        metricsChart.data.datasets[0].data = [total, available, maintenance];
        metricsChart.update();
    }

    if (availabilityChart) {
        availabilityChart.data.datasets[0].data = [available, maintenance];
        availabilityChart.update();
    }
}

function inicializarGraficos() {
    const metricsCtx = document.getElementById('metrics_chart').getContext('2d');
    metricsChart = new Chart(metricsCtx, {
        type: 'bar',
        data: {
            labels: ['Total', 'Disponíveis', 'Em Manutenção'],
            datasets: [{
                label: 'Equipamentos',
                data: [0, 0, 0],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                borderColor: ['#2980b9', '#27ae60', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    const availabilityCtx = document.getElementById('availability_chart').getContext('2d');
    availabilityChart = new Chart(availabilityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Disponíveis', 'Em Manutenção'],
            datasets: [{
                label: 'Equipamentos',
                data: [0, 0],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderColor: ['#27ae60', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

async function carregarListaDeEquipamentos() {
    const tbody = document.getElementById('equipment_list');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = equipamentos.slice(start, end);

    for (const equipment of paginated) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.id}</td>
            <td>${equipment.nome}</td>
            <td>${equipment.tipo}</td>
            <td>${equipment.status}</td>
            <td>
                <button class="edit" onclick="abrirModal('edit', ${equipment.id})">Editar</button>
                <button class="delete" onclick="excluirEquipamento(${equipment.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    }

    document.getElementById('page_info').textContent = `Página ${currentPage} de ${Math.ceil(equipamentos.length / itemsPerPage)}`;
    await carregarMetricas();
}

async function filtrarEquipamentos() {
    const query = document.getElementById('search_input').value.toLowerCase();
    const all = await carregarEquipamentos();
    equipamentos = all.filter(e => e.nome.toLowerCase().includes(query) || e.tipo.toLowerCase().includes(query));
    currentPage = 1;
    await carregarListaDeEquipamentos();
}

function ordenarTabela(column) {
    equipamentos.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    carregarListaDeEquipamentos();
}

function proximaPagina() {
    if (currentPage * itemsPerPage < equipamentos.length) {
        currentPage++;
        carregarListaDeEquipamentos();
    }
}

function anteriorPagina() {
    if (currentPage > 1) {
        currentPage--;
        carregarListaDeEquipamentos();
    }
}

function abrirModal(mode, id = null) {
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
        const equipment = equipamentos.find(e => e.id === id);
        if (!equipment) return;
        document.getElementById('nome').value = equipment.nome;
        document.getElementById('tipo').value = equipment.tipo;
        document.getElementById('status').value = equipment.status;
        equipmentIdInput.value = id;
    }
}

function fecharModal() {
    document.getElementById('equipment_modal').style.display = 'none';
}

document.getElementById('equipment_form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('equipment_id').value;
    const equipment = {
        id: id ? parseInt(id) : null,
        nome: document.getElementById('nome').value,
        tipo: document.getElementById('tipo').value,
        status: document.getElementById('status').value
    };

    if (id) {
        const index = equipamentos.findIndex(e => e.id === parseInt(id));
        equipamentos[index] = equipment;
    } else {
        equipamentos.push(equipment);
    }

    await salvarEquipamentos([equipment]);
    equipamentos = await carregarEquipamentos();
    await carregarListaDeEquipamentos();
    fecharModal();
});

async function excluirEquipamento(id) {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        await excluirEquipamentoPorId(id);
        equipamentos = await carregarEquipamentos();
        await carregarListaDeEquipamentos();
    }
}

function logout() {
    alert('Você saiu com sucesso!');
    window.location.href = './';
}

window.onload = async () => {
    inicializarGraficos();
    equipamentos = await carregarEquipamentos();
    currentId = equipamentos.length ? Math.max(...equipamentos.map(e => e.id)) + 1 : 1;
    await carregarListaDeEquipamentos();
    await carregarMetricas();
};

window.logout = logout;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.excluirEquipamento = excluirEquipamento;
window.ordenarTabela = ordenarTabela;
window.proximaPagina = proximaPagina;
window.anteriorPagina = anteriorPagina;
window.filtrarEquipamentos = filtrarEquipamentos;
