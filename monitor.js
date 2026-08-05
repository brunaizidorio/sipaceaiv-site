// config.js ou direto no HTML
const CONFIG = {
    // Use o ID da sua planilha
    spreadsheetId: '2PACX-1vSX7s4aSmpcMzQZp6m3bASQkjLZjXG337Fsc9SwUbA6j5Fqj4ifgdL5g8KsWpZB1Oi1M2PAW9V40O5x',
    // Use '0' para a primeira planilha (geralmente é a 'GERAL')
    sheetId: '0',
    // Intervalo de dados, ex: 'A1:F20' ou 'A:F' para todas
    range: 'A1:F20', 
    // Tempo em milissegundos para atualizar (ex: 5000 = 5 segundos)
    updateInterval: 5000 
};

async function fetchSheetData() {
    try {
        // URL para buscar dados como JSON usando a API v4
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${CONFIG.range}?key=SEU_API_KEY`;
        // Substitua 'SEU_API_KEY' por uma chave de API criada no Google Cloud Console.
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data.values; // Retorna um array de arrays (linhas e colunas)
    } catch (error) {
        console.error('Erro ao buscar dados da planilha:', error);
        return null;
    }
}

// Função para atualizar a tabela na página
function updateTable(data) {
    const tableBody = document.getElementById('tabela-monitor');
    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10">Nenhum dado encontrado.</td></tr>';
        return;
    }

    // Limpa a tabela
    tableBody.innerHTML = '';

    // Itera sobre as linhas (pule o índice 0 se for o cabeçalho)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const tr = document.createElement('tr');
        
        // Cria células para cada coluna
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || ''; // Se célula vazia, mostra string vazia
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    }
}

// Função principal para buscar e atualizar
async function refreshData() {
    const data = await fetchSheetData();
    updateTable(data);
}

// Inicia o monitoramento
function startMonitoring() {
    // Primeira carga imediata
    refreshData();
    
    // Configura o intervalo de atualização
    setInterval(refreshData, CONFIG.updateInterval);
}

// Aguarda o DOM carregar para iniciar
document.addEventListener('DOMContentLoaded', startMonitoring);
