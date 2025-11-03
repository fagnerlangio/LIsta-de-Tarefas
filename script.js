let tarefas = [];
let temaEscuro = false;
let termoBusca = "";
let filtroAtivo = "todas"; // todas, pendentes, concluidas

// ---------- SALVAR E CARREGAR ----------
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
}

// ---------- ADICIONAR ----------
function adicionarTarefa() {
    const inputTarefa = document.getElementById("inputTarefa");
    const tarefaTexto = inputTarefa.value.trim();
    const mensagem = document.getElementById("mensagem");

    if (tarefaTexto === "") {
        mensagem.textContent = "Por favor, digite uma tarefa.";
        return;
    }

    tarefas.push({ texto: tarefaTexto, editando: false, concluida: false });
    salvarTarefas();
    inputTarefa.value = "";
    mensagem.textContent = "Tarefa adicionada!";
    setTimeout(() => mensagem.textContent = "", 2000);
    renderizarTarefas();
}

// ---------- RENDERIZAR ----------
function renderizarTarefas() {
    const listaTarefas = document.getElementById("listaTarefas");
    listaTarefas.innerHTML = "";

    // Filtrar por busca
    let tarefasFiltradas = tarefas.filter(t =>
        t.texto.toLowerCase().includes(termoBusca.toLowerCase())
    );

    // Filtrar por status
    if (filtroAtivo === "pendentes") {
        tarefasFiltradas = tarefasFiltradas.filter(t => !t.concluida);
    } else if (filtroAtivo === "concluidas") {
        tarefasFiltradas = tarefasFiltradas.filter(t => t.concluida);
    }

    tarefasFiltradas.forEach((tarefa, i) => {
        const indiceOriginal = tarefas.indexOf(tarefa);
        const li = document.createElement("li");
        li.className = "tarefa-item";

        if (tarefa.editando) {
            const inputEdit = document.createElement("input");
            inputEdit.type = "text";
            inputEdit.value = tarefa.texto;
            inputEdit.id = `edit-input-${indiceOriginal}`;
            li.appendChild(inputEdit);

            const salvarBtn = document.createElement("button");
            salvarBtn.textContent = "Salvar";
            salvarBtn.classList.add("editar");
            salvarBtn.onclick = () => salvarEdicao(indiceOriginal);
            li.appendChild(salvarBtn);
        } else {
            const divContent = document.createElement("div");
            divContent.className = "tarefa-content";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = tarefa.concluida;
            checkbox.className = "checkbox-concluida";
            checkbox.onchange = () => alternarConclusao(indiceOriginal);
            divContent.appendChild(checkbox);

            const span = document.createElement("span");
            span.textContent = tarefa.texto;
            if (tarefa.concluida) span.classList.add("concluida");
            divContent.appendChild(span);

            li.appendChild(divContent);

            const divBotoes = document.createElement("div");
            divBotoes.classList.add("botoes");

            const concluirBtn = document.createElement("button");
            concluirBtn.textContent = tarefa.concluida ? "✓ Concluída" : "Concluir";
            concluirBtn.className = tarefa.concluida ? "btn-concluir concluida-btn" : "btn-concluir";
            concluirBtn.onclick = () => alternarConclusao(indiceOriginal);
            divBotoes.appendChild(concluirBtn);

            const editarBtn = document.createElement("button");
            editarBtn.textContent = "Editar";
            editarBtn.classList.add("editar");
            editarBtn.onclick = () => editarTarefa(indiceOriginal);
            divBotoes.appendChild(editarBtn);

            const excluirBtn = document.createElement("button");
            excluirBtn.textContent = "Excluir";
            excluirBtn.onclick = () => animarExclusao(indiceOriginal, li);
            divBotoes.appendChild(excluirBtn);

            li.appendChild(divBotoes);
        }

        listaTarefas.appendChild(li);
    });

    verificarListaVazia();
    atualizarContadores();
    atualizarFiltros();
}

// ---------- FILTRAR ----------
function filtrarTarefas() {
    termoBusca = document.getElementById("busca").value;
    renderizarTarefas();
}

function setFiltro(tipo) {
    filtroAtivo = tipo;
    renderizarTarefas();
}

function atualizarFiltros() {
    const botoes = {
        todas: document.getElementById("filtroTodas"),
        pendentes: document.getElementById("filtroPendentes"),
        concluidas: document.getElementById("filtroConcluidas")
    };

    Object.keys(botoes).forEach(tipo => {
        if (tipo === filtroAtivo) {
            botoes[tipo].className = "filtro-ativo";
        } else {
            botoes[tipo].className = "filtro-btn";
        }
    });
}

// ---------- CONTADORES ----------
function atualizarContadores() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = total - concluidas;

    document.getElementById("contTodas").textContent = total;
    document.getElementById("contPendentes").textContent = pendentes;
    document.getElementById("contConcluidas").textContent = concluidas;

    const contador = document.getElementById("contador");
    if (total > 0) {
        contador.textContent = `${concluidas} concluída${concluidas !== 1 ? 's' : ''} / ${total} total`;
    } else {
        contador.textContent = "";
    }

    // Habilitar/desabilitar botão limpar concluídas
    const btnLimparConcluidas = document.getElementById("limparConcluidasBtn");
    btnLimparConcluidas.disabled = concluidas === 0;
}

// ---------- EDITAR ----------
function editarTarefa(index) {
    tarefas[index].editando = true;
    renderizarTarefas();
}

function salvarEdicao(index) {
    const novoTexto = document.getElementById(`edit-input-${index}`).value.trim();
    if (novoTexto === "") {
        alert("O texto não pode estar vazio!");
        return;
    }
    tarefas[index].texto = novoTexto;
    tarefas[index].editando = false;
    salvarTarefas();
    renderizarTarefas();
}

// ---------- ALTERNAR CONCLUSÃO ----------
function alternarConclusao(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarTarefas();
    renderizarTarefas();
}

// ---------- EXCLUIR ----------
function animarExclusao(index, li) {
    li.classList.add("fadeOut");
    setTimeout(() => {
        tarefas.splice(index, 1);
        salvarTarefas();
        renderizarTarefas();
    }, 300);
}

function limparTodas() {
    if (tarefas.length === 0) {
        alert("Não há tarefas para limpar!");
        return;
    }
    if (confirm("Tem certeza que deseja apagar todas as tarefas?")) {
        tarefas = [];
        salvarTarefas();
        renderizarTarefas();
    }
}

function limparConcluidas() {
    const tarefasConcluidas = tarefas.filter(t => t.concluida);
    if (tarefasConcluidas.length === 0) {
        alert("Não há tarefas concluídas para limpar!");
        return;
    }
    if (confirm(`Tem certeza que deseja apagar ${tarefasConcluidas.length} tarefa(s) concluída(s)?`)) {
        tarefas = tarefas.filter(t => !t.concluida);
        salvarTarefas();
        const mensagem = document.getElementById("mensagem");
        mensagem.textContent = "Tarefas concluídas removidas!";
        setTimeout(() => mensagem.textContent = "", 2000);
        renderizarTarefas();
    }
}

// ---------- LISTA VAZIA ----------
function verificarListaVazia() {
    const aviso = document.getElementById("avisoVazio");
    if (tarefas.length === 0) {
        aviso.textContent = "Nenhuma tarefa adicionada.";
    } else {
        const tarefasFiltradas = tarefas.filter(t =>
            t.texto.toLowerCase().includes(termoBusca.toLowerCase())
        );

        let filtradas = tarefasFiltradas;
        if (filtroAtivo === "pendentes") {
            filtradas = filtradas.filter(t => !t.concluida);
        } else if (filtroAtivo === "concluidas") {
            filtradas = filtradas.filter(t => t.concluida);
        }

        if (filtradas.length === 0 && tarefas.length > 0) {
            aviso.textContent = `Nenhuma tarefa ${filtroAtivo === "pendentes" ? "pendente" : "concluída"} encontrada.`;
        } else {
            aviso.textContent = "";
        }
    }
}

// ---------- TEMA ----------
function alternarTema() {
    temaEscuro = !temaEscuro;
    document.body.classList.toggle("dark", temaEscuro);
    document.getElementById("temaBtn").textContent = temaEscuro ? "☀️ Tema Claro" : "🌙 Tema Escuro";
    localStorage.setItem("temaEscuro", temaEscuro);
}

function carregarTema() {
    const temaSalvo = localStorage.getItem("temaEscuro") === "true";
    temaEscuro = temaSalvo;
    document.body.classList.toggle("dark", temaEscuro);
    document.getElementById("temaBtn").textContent = temaEscuro ? "☀️ Tema Claro" : "🌙 Tema Escuro";
}

// ---------- ENTER PARA ADICIONAR ----------
document.getElementById("inputTarefa").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        adicionarTarefa();
    }
});

// ---------- INICIALIZAÇÃO ----------
carregarTarefas();
carregarTema();
renderizarTarefas();