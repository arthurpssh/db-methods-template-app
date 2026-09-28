async function fetchHistory() {
  const dateInput = document.getElementById('dateInput').value;
  const statusMessage = document.getElementById('statusMessage');
  const jsonViewer = document.getElementById('jsonViewer');

  if (!dateInput) {
    statusMessage.innerHTML = '<span class="error">Por favor, insira uma data válida.</span>';
    return;
  }

  statusMessage.innerHTML = `Buscando histórico para <b>${dateInput}</b> no Drive...`;
  jsonViewer.textContent = 'Carregando...';

  try {
    console.log(dateInput)
    const response = await fetch(`/api/history?date=${dateInput}`);
    const result = await response.json();

    if (result.success) {
      statusMessage.innerHTML = `<span style="color: green;">✓ Sucesso! Dados de ${dateInput} carregados.</span>`;
      // Formata o JSON com indentação de 2 espaços para facilitar a visualização das tarefas e status
      jsonViewer.textContent = JSON.stringify(result.data, null, 2);
    } else {
      statusMessage.innerHTML = `<span class="error">Erro: ${result.message}</span>`;
      jsonViewer.textContent = '{}';
    }
  } catch (error) {
    statusMessage.innerHTML = `<span class="error">Erro de rede: ${error.message}</span>`;
    jsonViewer.textContent = '{}';
  }
}