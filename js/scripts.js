document.addEventListener('DOMContentLoaded', () => {
    const botaoAdicionarTarefa = document.getElementById('adicionar-tarefa-btn');
    const tituloTarefa = document.getElementById('titulo-tarefa');
    const listaTarefasHoje = document.getElementById('lista-tarefas-hoje');
    const estrelaTarefaBtn = document.getElementById('estrela-tarefa-btn');
    const detalheTitulo = document.getElementById('titulo-detalhe');
    const detalheImportancia = document.getElementById('importancia-detalhe');
    const detalheData = document.getElementById('data-detalhe');
    const detalheLembrete = document.getElementById('lembrete-detalhe');
    const detalheAnotacoes = document.getElementById('anotacoes-detalhe');
    const botaoSalvarDetalhes = document.getElementById('salvar-detalhes');
    const asideDireito = document.getElementById('aside-direito');
    const fecharAsideDireito = document.getElementById('fechar-aside-direito');
    const botaoExcluirTarefa = document.getElementById('excluir-tarefa');
    let importancia = false;

    // Exibir a data atual
    const dataAtual = new Date();
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dataAtualFormatada = `${dataAtual.getDate()}, ${diasDaSemana[dataAtual.getDay()]}`;
    document.getElementById('data-atual').textContent = dataAtualFormatada;

    // jQuery UI datepicker
    $(detalheData).datepicker({
        dateFormat: 'yy-mm-dd',
    });

    estrelaTarefaBtn.addEventListener('click', () => {
        importancia = !importancia;
        estrelaTarefaBtn.innerHTML = importancia ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    });

    botaoAdicionarTarefa.addEventListener('click', () => {
        adicionarTarefa(tituloTarefa.value, importancia);
        tituloTarefa.value = '';
        importancia = false;
        estrelaTarefaBtn.innerHTML = '<i class="far fa-star"></i>';
    });

    function adicionarTarefa(titulo, importante) {
        const tarefaItem = document.createElement('li');
        tarefaItem.classList.add('list-group-item');
        tarefaItem.innerHTML = `
            <span>${titulo}</span>
            <button class="btn btn-outline-secondary"><i class="${importante ? 'fas' : 'far'} fa-star"></i></button>
        `;
        tarefaItem.addEventListener('click', () => selecionarTarefa(tarefaItem, titulo, importante));
        listaTarefasHoje.appendChild(tarefaItem);
    }

    function selecionarTarefa(elemento, titulo, importante) {
        detalheTitulo.textContent = titulo;
        detalheImportancia.innerHTML = importante ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        asideDireito.classList.remove('d-none');
        detalheImportancia.onclick = () => {
            importante = !importante;
            detalheImportancia.innerHTML = importante ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        };
    }

    botaoSalvarDetalhes.addEventListener('click', salvarDetalhes);

    function salvarDetalhes() {
        // Salvando os detalhes da tarefa
    }

    fecharAsideDireito.addEventListener('click', () => {
        asideDireito.classList.add('d-none');
    });

    botaoExcluirTarefa.addEventListener('click', excluirTarefa);

    function excluirTarefa() {
        // Excluir a tarefa
    }
});
