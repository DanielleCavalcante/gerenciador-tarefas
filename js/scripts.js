document.addEventListener('DOMContentLoaded', () => {
    const botaoAdicionarTarefa = document.getElementById('adicionar-tarefa-btn');
    const tituloTarefa = document.getElementById('titulo-tarefa');
    const listaTarefasHoje = document.getElementById('lista-tarefas-hoje');
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
    let tarefas = [];
    let tarefaSelecionada = null;

    // Exibir a data atual
    const dataAtual = new Date();
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const MesesDoAno = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const dataAtualFormatada = `${diasDaSemana[dataAtual.getDay()]}, ${dataAtual.getDate()} de ${MesesDoAno[dataAtual.getMonth()]}`;
    document.getElementById('data-atual').textContent = dataAtualFormatada;

    // jQuery para detalhes de data na tarefa
    $(detalheData).datepicker({
        dateFormat: 'dd-MM-yyyy',
    });

        botaoAdicionarTarefa.addEventListener('click', () => {
        const titulo = tituloTarefa.value.trim();
        if (titulo !== '') {
            adicionarTarefa(titulo);
            tituloTarefa.value = '';
        }
    });

    function adicionarTarefa(titulo) {
        const tarefa = {
            id: new Date().getTime(),
            titulo: titulo,
            importante: false,
            data: '',
            lembrete: false,
            anotacoes: '',
            status: 'em aberto'
        };
        tarefas.push(tarefa);
        renderizarTarefa(tarefa);
    }

    function renderizarTarefa(tarefa) {
        const tarefaItem = document.createElement('li');
        tarefaItem.classList.add('list-group-item');
        tarefaItem.dataset.id = tarefa.id;
        tarefaItem.innerHTML = `
            <span>${tarefa.titulo}</span>
            <button class="btn btn-outline-secondary"><i class="${tarefa.importante ? 'fas' : 'far'} fa-star"></i></button>
        `;
        tarefaItem.addEventListener('click', () => selecionarTarefa(tarefa));
        listaTarefasHoje.appendChild(tarefaItem);
    }

    function selecionarTarefa(tarefa) {
        tarefaSelecionada = tarefa;
        detalheTitulo.textContent = tarefa.titulo;
        detalheImportancia.innerHTML = tarefa.importante ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        detalheData.value = tarefa.data;
        detalheLembrete.classList.toggle('active', tarefa.lembrete);
        detalheAnotacoes.value = tarefa.anotacoes;
        asideDireito.classList.remove('d-none');

        detalheImportancia.onclick = () => {
            tarefa.importante = !tarefa.importante;
            detalheImportancia.innerHTML = tarefa.importante ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        };
    }

    botaoSalvarDetalhes.addEventListener('click', salvarDetalhes);

    function salvarDetalhes() {
        if (tarefaSelecionada) {
            tarefaSelecionada.data = detalheData.value;
            tarefaSelecionada.lembrete = detalheLembrete.classList.contains('active');
            tarefaSelecionada.anotacoes = detalheAnotacoes.value;
            tarefaSelecionada.titulo = detalheTitulo.textContent;
            tarefaSelecionada.importante = detalheImportancia.querySelector('i').classList.contains('fas');

            atualizarTarefaNoDOM(tarefaSelecionada);
        }
    }

    function atualizarTarefaNoDOM(tarefa) {
        const tarefaItem = listaTarefasHoje.querySelector(`[data-id="${tarefa.id}"]`);
        if (tarefaItem) {
            tarefaItem.querySelector('span').textContent = tarefa.titulo;
            tarefaItem.querySelector('button i').className = tarefa.importante ? 'fas fa-star' : 'far fa-star';
        }
    }

    fecharAsideDireito.addEventListener('click', () => {
        asideDireito.classList.add('d-none');
    });

    botaoExcluirTarefa.addEventListener('click', excluirTarefa);

    function excluirTarefa() {
        if (tarefaSelecionada) {
            tarefas = tarefas.filter(t => t.id !== tarefaSelecionada.id);
            const tarefaItem = listaTarefasHoje.querySelector(`[data-id="${tarefaSelecionada.id}"]`);
            if (tarefaItem) {
                tarefaItem.remove();
            }
            asideDireito.classList.add('d-none');
        }
    }
});

