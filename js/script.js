
let arrayTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
const containerLista = document.querySelector('#container-lista'); 
const btnAdicionar = document.querySelector('#btn-adicionar');

btnAdicionar.addEventListener('click', addTask); 

function addTask() {
    const inputBox = document.getElementById('input-box');
    const inputDesc = document.getElementById('input-desc');
    const selectPrioridade = document.getElementById('select-prioridade');

    // Validar o cadastro
    if (inputBox.value.trim() === '') {
        alert('Por favor, insira o título da tarefa!');
        return;
    }

    let novaTarefa = {
        id: Date.now(), //ID único
        titulo: inputBox.value,
        descricao: inputDesc.value,
        prioridade: selectPrioridade.value,
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        status: 'Pendente'
    };

    arrayTarefas.push(novaTarefa);

    // Limpar os campos após adicionar a tarefa
    inputBox.value = '';
    if(inputDesc) inputDesc.value = '';
    if(selectPrioridade) selectPrioridade.value = 'Média'; 

    // Salvar os dados e renderizar a lista
    saveData();
    renderizarTarefas();
}
function saveData() {
    // Trasnformar o array em texto
    localStorage.setItem('tarefas', JSON.stringify(arrayTarefas));
}
function renderizarTarefas() {
    containerLista.innerHTML = '';
    const mensagemVazia = document.getElementById('mensagem-vazia');
    
    let inputPesquisa = document.getElementById('input-pesquisa');
    let termoPesquisa = inputPesquisa ? inputPesquisa.value.toLowerCase() : '';

    // Filtrar a lista
    let tarefasParaMostrar = arrayTarefas.filter(function(tarefa) {
        return tarefa.titulo.toLowerCase().includes(termoPesquisa);
    });

    if (tarefasParaMostrar.length === 0) {
        mensagemVazia.style.display = 'block';
        return;
    } else {
        mensagemVazia.style.display = 'none';
    }

    tarefasParaMostrar.forEach(function(tarefa) {
        let li = document.createElement('li');

        if (tarefa.status === 'Concluída') {
            li.classList.add('checked');
        }

        li.innerHTML = `
            <div class="conteudo-tarefa">
                <h3>${tarefa.titulo}</h3>
                <p><strong>Descrição:</strong> ${tarefa.descricao}</p>
                <p><strong>Criado em:</strong> ${tarefa.dataCriacao}</p>
                <p><strong>Prioridade:</strong> ${tarefa.prioridade}</p>
                <p><strong>Status:</strong> ${tarefa.status}</p>
            </div>
            <div class="acoes-tarefa">
                <button class="concluir" onclick="concluirTarefa(${tarefa.id})">✔ Concluir</button>
                <button class="editar" onclick="editarTarefa(${tarefa.id})">✏️ Editar</button>
                <button class="excluir" onclick="apagarTarefa(${tarefa.id})">❌ Excluir</button>
            </div>
        `;

        containerLista.appendChild(li);
    });
}

function concluirTarefa(id) {
    // Procurar a tarefa pelo ID
    let tarefaEncontrada = arrayTarefas.find(function(tarefa) {
        return tarefa.id === id;
    });

    if (tarefaEncontrada) {
        if (tarefaEncontrada.status === 'Pendente') {
            tarefaEncontrada.status = 'Concluída';
        } else {
            tarefaEncontrada.status = 'Pendente';
        }
        
        // Salva a alteração no LocalStorage
        saveData();
        renderizarTarefas();
    }
}

function apagarTarefa(id) {
    // Cria um alerta na tela para confirmar a exclusão da tarefa
    let confirmar = confirm('Tem certeza que deseja excluir esta tarefa?');

    if (confirmar) {
        arrayTarefas = arrayTarefas.filter(function(tarefa) {
            return tarefa.id !== id;
        });

        saveData();
        renderizarTarefas();
    }
}

function editarTarefa(id) {
    let tarefaEncontrada = arrayTarefas.find(function(tarefa) {
        return tarefa.id === id;
    });

    if (tarefaEncontrada) {
        // Abre um prompt para o usuário editar o título da tarefa
        let novoTitulo = prompt("Edite o título da tarefa:", tarefaEncontrada.titulo);

        if (novoTitulo !== null && novoTitulo.trim() !== "") {
            tarefaEncontrada.titulo = novoTitulo;

            let novaDescricao = prompt("Edite a descrição:", tarefaEncontrada.descricao);
            if (novaDescricao !== null) {
                tarefaEncontrada.descricao = novaDescricao;
            }

            saveData();
            renderizarTarefas();
        } else if (novoTitulo !== null) {
            alert("O título não pode ficar vazio!");
        }
    }
}
renderizarTarefas();
