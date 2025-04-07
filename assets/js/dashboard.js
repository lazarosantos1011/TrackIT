// Dados iniciais (simulação de banco de dados com localStorage)
let equipamentos = JSON.parse(localStorage.getItem('equipamentos')) || [];
let currentId = equipamentos.length ? Math.max(...equipamentos.map(e => e.id)) + 1 : 1;
let currentPage = 1;
const itemsPerPage = 5;
let metricsChart;
let availabilityChart;

// Função para carregar métricas e atualizar os gráficos
function carregarMetricas() {
    const total = equipamentos.length;
    const available = equipamentos.filter(e => e.status === 'Disponível').length;
    const maintenance = equipamentos.filter(e => e.status === 'Em Manutenção').length;

    // Atualizar os números no gráfico de barras
    if (metricsChart) {
        metricsChart.data.datasets[0].data = [total, available, maintenance];
        metricsChart.update();
    }

    // Atualizar os números no gráfico de "roda"
    if (availabilityChart) {
        availabilityChart.data.datasets[0].data = [available, maintenance];
        availabilityChart.update();
    }

    document.getElementById('total_equipment').textContent = total;
    document.getElementById('available_equipment').textContent = available;
    document.getElementById('maintenance_equipment').textContent = maintenance;
}

// Função para inicializar os gráficos
function inicializarGraficos() {
    const metricsCtx = document.getElementById('metrics_chart').getContext('2d');
    metricsChart = new Chart(metricsCtx, {
        type: 'bar',
        data: {
            labels: ['Total', 'Disponíveis', 'Em Manutenção'],
            datasets: [{
                label: 'Equipamentos',
                data: [0, 0, 0], // Dados iniciais
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                borderColor: ['#2980b9', '#27ae60', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const availabilityCtx = document.getElementById('availability_chart').getContext('2d');
    availabilityChart = new Chart(availabilityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Disponíveis', 'Em Manutenção'],
            datasets: [{
                label: 'Equipamentos',
                data: [0, 0], // Dados iniciais
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderColor: ['#27ae60', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Função para listar equipamentos na tabela com paginação
function carregarListaDeEquipamentos() {
    const tbody = document.getElementById('equipment_list');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedequipamentos = equipamentos.slice(start, end);

    paginatedequipamentos.forEach(equipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.id}</td>
            <td>${equipment.name}</td>
            <td>${equipment.type}</td>
            <td>${equipment.status}</td>
            <td>
                <button class="edit" onclick="abrirModal('edit', ${equipment.id})">Editar</button>
                <button class="delete" onclick="excluirEquipamento(${equipment.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('page_info').textContent = `Página ${currentPage} de ${Math.ceil(equipamentos.length / itemsPerPage)}`;
    carregarMetricas();
}

// Função para buscar equipamentos
function filtrarEquipamentos() {
    const query = document.getElementById('search_input').value.toLowerCase();
    equipamentos = JSON.parse(localStorage.getItem('equipamentos')) || [];
    equipamentos = equipamentos.filter(e => e.name.toLowerCase().includes(query) || e.type.toLowerCase().includes(query));
    currentPage = 1;
    carregarListaDeEquipamentos();
}

// Função para ordenar equipamentos
function ordernarTabela(column) {
    equipamentos.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    carregarListaDeEquipamentos();
}

// Paginação
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

// Abrir o modal para criar ou editar
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
        document.getElementById('name').value = equipment.name;
        document.getElementById('type').value = equipment.type;
        document.getElementById('status').value = equipment.status;
        equipmentIdInput.value = id;
    }
}

function fecharModal() {
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
        const index = equipamentos.findIndex(e => e.id === parseInt(id));
        equipamentos[index] = equipment;
    } else {
        // Adicionar novo equipamento
        equipamentos.push(equipment);
    }

    localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
    carregarListaDeEquipamentos();
    fecharModal();
});

// Excluir equipamento
function excluirEquipamento(id) {
    // crud.excluirEquipamento(id);
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        equipamentos = equipamentos.filter(e => e.id !== id);
        localStorage.setItem('equipamentos', JSON.stringify(equipamentos));
        carregarListaDeEquipamentos();
    }
}

// Logout
function logout() {
    alert('Você saiu com sucesso!');
    window.location.href = './index.html';
}

// Inicializar os gráficos ao carregar a página
window.onload = () => {
    inicializarGraficos();
    carregarListaDeEquipamentos();
    carregarMetricas();
};