let tarefas = [];
        let termoBusca = "";

        // ---------- SALVAR E CARREGAR ----------
        function salvarTarefas() {
            localStorage.setItem("tarefas", JSON.stringify(tarefas));
        }

        function carregarTarefas() {
            const tarefasSalvas = localStorage.getItem("tarefas");
            if (tarefasSalvas) tarefas = JSON.parse(tarefasSalvas);
        }

        // ---------- TEMA ESCURO ----------
        function aplicarTema() {
            const tema = localStorage.getItem("tema") || "claro";
            document.body.classList.toggle("dark", tema === "escuro");
        }

        function alternarTema() {
            const corpo = document.body;
            const modoEscuroAtivo = corpo.classList.toggle("dark");
            localStorage.setItem("tema", modoEscuroAtivo ? "escuro" : "claro");
        }

        // ---------- ADICIONAR TAREFA ----------
        function adicionarTarefa() {
            const inputTarefa = document.getElementById("inputTarefa");
            let tarefaTexto = inputTarefa.value.trim();
            let mensagem = document.getElementById("mensagem");

            if (tarefaTexto === "") {
                mensagem.textContent = "Por favor, digite uma tarefa antes de adicionar.";
                return;
            }

            tarefas.push({
                texto: tarefaTexto,
                concluida: false
            });

            salvarTarefas();
            renderizarTarefas();
            mensagem.textContent = "Tarefa adicionada com sucesso!";
            inputTarefa.value = "";
            verificarListaVazia();
        }

        // ---------- RENDERIZAR ----------
        function renderizarTarefas() {
            const listaTarefas = document.getElementById("listaTarefas");
            listaTarefas.innerHTML = "";

            const tarefasFiltradas = tarefas.filter(t =>
                t.texto.toLowerCase().includes(termoBusca.toLowerCase())
            );

            tarefasFiltradas.forEach((item, i) => {
                let indexReal = tarefas.indexOf(item);
                let novaTarefa = document.createElement("li");
                if (item.concluida) novaTarefa.classList.add("concluida");

                novaTarefa.textContent = item.texto;

                let divBotoes = document.createElement("div");
                divBotoes.classList.add("botoes");

                let btnConcluir = document.createElement("button");
                btnConcluir.textContent = item.concluida ? "Desfazer" : "Concluir";
                btnConcluir.classList.add("btn", "btn-concluir");
                btnConcluir.onclick = () => marcarConcluida(indexReal);

                let btnExcluir = document.createElement("button");
                btnExcluir.textContent = "Excluir";
                btnExcluir.classList.add("btn", "btn-excluir");
                btnExcluir.onclick = () => animarExclusao(indexReal, novaTarefa);

                divBotoes.appendChild(btnConcluir);
                divBotoes.appendChild(btnExcluir);

                novaTarefa.appendChild(divBotoes);
                listaTarefas.appendChild(novaTarefa);
            });

            salvarTarefas();
            atualizarContador();
        }

        // ---------- ANIMAÇÃO DE EXCLUSÃO ----------
        function animarExclusao(index, elemento) {
            elemento.style.animation = "fadeOut 0.3s forwards";
            setTimeout(() => {
                excluirTarefa(index);
            }, 300);
        }

        // ---------- FUNÇÕES AUXILIARES ----------
        function marcarConcluida(index) {
            tarefas[index].concluida = !tarefas[index].concluida;
            salvarTarefas();
            renderizarTarefas();
        }

        function excluirTarefa(index) {
            tarefas.splice(index, 1);
            salvarTarefas();
            renderizarTarefas();
            verificarListaVazia();
        }

        function limparTudo() {
            if (tarefas.length === 0) {
                alert("Não há tarefas para limpar.");
                return;
            }
            const confirmar = confirm("Tem certeza que deseja apagar todas as tarefas?");
            if (confirmar) {
                tarefas = [];
                salvarTarefas();
                renderizarTarefas();
                verificarListaVazia();
                document.getElementById("mensagem").textContent = "Todas as tarefas foram apagadas.";
            }
        }

        function verificarListaVazia() {
            const aviso = document.getElementById("avisoVazio");
            aviso.textContent = tarefas.length === 0 ? "Não tem nada adicionado." : "";
        }

        function filtrarTarefas() {
            termoBusca = document.getElementById("inputBusca").value.trim();
            renderizarTarefas();
        }

        function atualizarContador() {
            const contador = document.getElementById("contador");
            const total = tarefas.length;
            const concluidas = tarefas.filter(t => t.concluida).length;
            const pendentes = total - concluidas;

            contador.textContent = total === 0
                ? "Nenhuma tarefa adicionada ainda."
                : `Total: ${total} | Pendentes: ${pendentes} | Concluídas: ${concluidas}`;
        }

        // ---------- INICIALIZAÇÃO ----------
        carregarTarefas();
        aplicarTema();
        renderizarTarefas();
        verificarListaVazia();