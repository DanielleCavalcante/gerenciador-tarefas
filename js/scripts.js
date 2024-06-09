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
    const detalheCategoria = document.getElementById('categoria-detalhe');
    const botaoSalvarDetalhes = document.getElementById('salvar-detalhes');
    const asideDireito = document.getElementById('aside-direito');
    const fecharAsideDireito = document.getElementById('fechar-aside-direito');
    const botaoExcluirTarefa = document.getElementById('excluir-tarefa');
    const botaoAdicionarCategoria = document.getElementById('adicionar-categoria-btn');
    const inputAdicionarCategoria = document.getElementById('adicionar-categoria-input');
    const listaCategorias = document.getElementById('lista-categorias');
    let importancia = false;
    let categorias = ['Meu Dia', 'Importantes', 'Concluídas', 'Pessoal', 'Profissional', 'Acadêmico'];
    let tarefas = [];

    // Exibir a data atual
    const dataAtual = new Date();
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dataAtualFormatada = `${dataAtual.getDate()}, ${diasDaSemana[dataAtual.getDay()]}`;
    document.getElementById('data-atual').textContent = dataAtualFormatada;

    // Adicionar categorias ao select e à navbar
    function atualizarCategorias() {
        detalheCategoria.innerHTML = '';
        listaCategorias.innerHTML = '';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            detalheCategoria.appendChild(option);

            const navItem = document.createElement('li');
            navItem.classList.add('nav-item');
            navItem.innerHTML = `<a class="nav-link" href="#tarefa-${categoria.toLowerCase()}" id="categoria-${categoria.toLowerCase()}">${categoria}</a>`;
            listaCategorias.appendChild(navItem);
        });
    }

    atualizarCategorias();

    // Adicionar nova categoria
    botaoAdicionarCategoria.addEventListener('click', () => {
        const novaCategoria = inputAdicionarCategoria.value.trim();
        if (novaCategoria && !categorias.includes(novaCategoria)) {
            categorias.push(novaCategoria);
            atualizarCategorias();
            inputAdicionarCategoria.value = '';
        }
    });

    // Adicionar nova tarefa
    botaoAdicionarTarefa.addEventListener('click', () => {
        const titulo = tituloTarefa.value.trim();
        if (titulo) {
            const novaTarefa = {
                id: Date.now(),
                titulo: titulo,
                importancia: false,
                concluida: false,
                categoria: 'Meu Dia'
            };
            tarefas.push(novaTarefa);
            adicionarTarefaNaLista(novaTarefa);
            tituloTarefa.value = '';
        }
    });

    // Adicionar tarefa na lista de tarefas
    function adicionarTarefaNaLista(tarefa) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="tarefa-concluida" id="tarefa-${tarefa.id}">
                <label class="form-check-label" for="tarefa-${tarefa.id}">
                    ${tarefa.titulo}
                </label>
            </div>
        `;
        listaTarefasHoje.appendChild(li);

        const radio = li.querySelector('.form-check-input');
        radio.addEventListener('change', () => {
            tarefa.concluida = radio.checked;
            if (tarefa.concluida) {
                li.classList.add('concluida');
            } else {
                li.classList.remove('concluida');
            }
        });

        li.addEventListener('click', () => {
            abrirDetalhesTarefa(tarefa);
        });
    }

    // Abrir detalhes da tarefa
    function abrirDetalhesTarefa(tarefa) {
        detalheTitulo.value = tarefa.titulo;
        detalheImportancia.innerHTML = tarefa.importancia ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        detalheData.value = tarefa.data || '';
        detalheLembrete.value = tarefa.lembrete || '';
        detalheAnotacoes.value = tarefa.anotacoes || '';
        detalheCategoria.value = tarefa.categoria;
        importancia = tarefa.importancia;
        asideDireito.classList.remove('d-none');

        detalheImportancia.onclick = () => {
            importancia = !importancia;
            detalheImportancia.innerHTML = importancia ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        };

        botaoSalvarDetalhes.onclick = () => {
            tarefa.titulo = detalheTitulo.value;
            tarefa.importancia = importancia;
            tarefa.data = detalheData.value;
            tarefa.lembrete = detalheLembrete.value;
            tarefa.anotacoes = detalheAnotacoes.value;
            tarefa.categoria = detalheCategoria.value;

            li.querySelector('.form-check-label').textContent = tarefa.titulo;
            asideDireito.classList.add('d-none');

            if (tarefa.lembrete) {
                definirLembrete(tarefa);
            }
        };

        botaoExcluirTarefa.onclick = () => {
            tarefas = tarefas.filter(t => t.id !== tarefa.id);
            li.remove();
            asideDireito.classList.add('d-none');
        };
    }

    // Definir lembrete
    function definirLembrete(tarefa) {
        const [hora, minuto] = tarefa.lembrete.split(':');
        const agora = moment();
        const momentoLembrete = moment().hours(hora).minutes(minuto);

        if (momentoLembrete.isAfter(agora)) {
            const diferenca = momentoLembrete.diff(agora);
            setTimeout(() => {
                Push.create("Lembrete de Tarefa", {
                    body: `Está na hora de: ${tarefa.titulo}`,
                    icon: 'images/icon.png',
                    timeout: 5000
                });
            }, diferenca);
        }
    }

    fecharAsideDireito.addEventListener('click', () => {
        asideDireito.classList.add('d-none');
    });
});
