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
    const tituloCategoria = document.getElementById('titulo-categoria');
    let importancia = false;
    let categorias = JSON.parse(localStorage.getItem('categorias')) || ['Pessoal', 'Profissional', 'Acadêmico'];
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    let categoriaAtual = localStorage.getItem('categoriaAtual') || 'Meu Dia';

    // Exibir a data atual
    const dataAtual = new Date();
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const MesesDoAno = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const dataAtualFormatada = `${diasDaSemana[dataAtual.getDay()]}, ${dataAtual.getDate()} de ${MesesDoAno[dataAtual.getMonth()]}`;
    document.getElementById('data-atual').textContent = dataAtualFormatada;

    function salvarCategorias() {
        localStorage.setItem('categorias', JSON.stringify(categorias));
    }    

    // Adicionar categorias ao select e à navbar
    function atualizarCategorias() {
        detalheCategoria.innerHTML = '';
        listaCategorias.innerHTML = '';

        ['Meu Dia', 'Importantes', 'Concluídas'].forEach(categoria => {
            const navItem = document.createElement('li');
            navItem.classList.add('nav-item');
            navItem.innerHTML = `<a class="nav-link" href="#" data-categoria="${categoria}">${categoria}</a>`;
            listaCategorias.appendChild(navItem);
        });

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            detalheCategoria.appendChild(option);

            const navItem = document.createElement('li');
            navItem.classList.add('nav-item');
            navItem.innerHTML = `<a class="nav-link" href="#" data-categoria="${categoria}">${categoria}</a>`;
            listaCategorias.appendChild(navItem);
        });

        document.querySelectorAll('#lista-categorias a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoria = link.getAttribute('data-categoria');
                tituloCategoria.textContent = categoria;
                categoriaAtual = categoria;
                localStorage.setItem('categoriaAtual', categoria);
                exibirTarefas(categoria);
            });
        });
    }

    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function exibirTarefas(categoria) {
        listaTarefasHoje.innerHTML = '';
        const hoje = new Date().toISOString().split('T')[0];
        let tarefasFiltradas = [];

        if (categoria === 'Meu Dia') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.data === hoje && !tarefa.concluida);
        } else if (categoria === 'Importantes') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.importancia && !tarefa.concluida);
        } else if (categoria === 'Concluídas') {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.concluida);
        } else {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.categoria === categoria && !tarefa.concluida);
        }

        tarefasFiltradas.forEach(tarefa => adicionarTarefaNaLista(tarefa));
        asideDireito.classList.add('d-none');
    }

    atualizarCategorias();
    exibirTarefas(categoriaAtual);

    // Adicionar nova categoria
    botaoAdicionarCategoria.addEventListener('click', () => {
        const novaCategoria = inputAdicionarCategoria.value.trim();
        if (novaCategoria && !categorias.includes(novaCategoria)) {
            categorias.push(novaCategoria);
            salvarCategorias();
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
                importancia: categoriaAtual === 'Importantes',
                concluida: false,
                data: categoriaAtual === 'Meu Dia' ? new Date().toISOString().split('T')[0] : '',
                lembrete: '',
                anotacoes: '',
                categoria: categoriaAtual !== 'Meu Dia' && categoriaAtual !== 'Importantes' && categoriaAtual !== 'Concluídas' ? categoriaAtual : ''
            };
            tarefas.push(novaTarefa);
            salvarTarefas();
            exibirTarefas(categoriaAtual);
            tituloTarefa.value = '';
        }
    });

    // Adicionar tarefa na lista de tarefas
    function adicionarTarefaNaLista(tarefa) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'tarefa-item');
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="tarefa-${tarefa.id}" ${tarefa.concluida ? 'checked' : ''}>
                <label class="form-check-label" for="tarefa-${tarefa.id}">
                    ${tarefa.titulo}
                </label>
                <small class="text-muted">${tarefa.categoria}</small>
            </div>
        `;

        if (tarefa.importancia) {
            li.style.borderLeft = '4px solid yellow';
        }

        listaTarefasHoje.appendChild(li);

        const checkbox = li.querySelector('.form-check-input');
        checkbox.addEventListener('change', () => {
            tarefa.concluida = checkbox.checked;
            salvarTarefas();
            exibirTarefas(categoriaAtual);
        });

        if (!tarefa.concluida) {
            li.addEventListener('click', () => {
                abrirDetalhesTarefa(tarefa);
            });
        }
    }

    // Abrir detalhes da tarefa
    function abrirDetalhesTarefa(tarefa) {
        detalheTitulo.value = tarefa.titulo;
        detalheImportancia.checked = tarefa.importancia;
        detalheData.value = tarefa.data || '';
        detalheLembrete.value = tarefa.lembrete || '';
        detalheAnotacoes.value = tarefa.anotacoes || '';
        detalheCategoria.value = tarefa.categoria;
        importancia = tarefa.importancia;
        asideDireito.classList.remove('d-none');

        detalheImportancia.onchange = () => {
            importancia = detalheImportancia.checked;
        };

        botaoSalvarDetalhes.onclick = () => {
            tarefa.titulo = detalheTitulo.value;
            tarefa.importancia = importancia;
            tarefa.data = detalheData.value;
            tarefa.lembrete = detalheLembrete.value;
            tarefa.anotacoes = detalheAnotacoes.value;
            tarefa.categoria = detalheCategoria.value;
            tarefa.notificado = false; // Resetar notificação
            salvarTarefas();
            asideDireito.classList.add('d-none');
            exibirTarefas(categoriaAtual);
        };

        botaoExcluirTarefa.onclick = () => {
            tarefas = tarefas.filter(t => t.id !== tarefa.id);
            salvarTarefas();
            asideDireito.classList.add('d-none');
            exibirTarefas(categoriaAtual);
        };

        fecharAsideDireito.onclick = () => {
            asideDireito.classList.add('d-none');
        };
    }

    // Fechar aside ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!asideDireito.contains(event.target) && !event.target.closest('.tarefa-item')) {
            asideDireito.classList.add('d-none');
        }
    });

    // Verificar lembretes
    setInterval(() => {
        const agora = new Date();
        tarefas.forEach(tarefa => {
            if (tarefa.lembrete && tarefa.data) {
                const [lembreteHora, lembreteMinuto] = tarefa.lembrete.split(':').map(Number);
                const [ano, mes, dia] = tarefa.data.split('-').map(Number);
                const lembreteData = new Date(ano, mes - 1, dia, lembreteHora, lembreteMinuto);

                if (lembreteData <= agora && !tarefa.notificado) {
                    Push.create('Lembrete de Tarefa', {
                        body: `Lembrete: ${tarefa.titulo}`,
                        icon: '/path/to/icon.png', // Coloque o caminho para um ícone, se desejado
                        timeout: 4000,
                        onClick: function () {
                            window.focus();
                            this.close();
                        }
                    });
                    tarefa.notificado = true; // Marcar tarefa como notificada
                    salvarTarefas();
                }
            }
        });
    }, 60000); // Verificar a cada minuto
})