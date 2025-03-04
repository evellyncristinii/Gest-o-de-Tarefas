function inicializarAplicacao() {
    document.addEventListener('DOMContentLoaded', () => {
        const listaTarefas = document.getElementById('tarefas');
        const formularioTarefa = document.getElementById('formulario-tarefa');
        const filtroUsuario = document.getElementById('filtroUsuario');
        const buscarTarefasBtn = document.getElementById('buscarTarefasBtn');
        
        const API_URL = "https://jsonplaceholder.typicode.com/todos";
    
        let todasTarefas = [];
    
        const carregarTarefas = async (userId = null) => {
            listaTarefas.innerHTML = "<p>Carregando...</p>";
            let url = userId ? `${API_URL}?userId=${userId}` : API_URL;
            
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Erro ao carregar tarefas');
                todasTarefas = await response.json();
                renderizarTarefas();
            } catch (error) {
                console.error("Erro ao carregar tarefas:", error);
                listaTarefas.innerHTML = "<p>Erro ao carregar as tarefas.</p>";
            }
        };
    
        const renderizarTarefas = () => {
            listaTarefas.innerHTML = "";
            todasTarefas.forEach(tarefa => exibirTarefa(tarefa));
        };
    
        const exibirTarefa = (tarefa) => {
            const tarefaDiv = document.createElement("div");
            tarefaDiv.classList.add("tarefa");
            tarefaDiv.setAttribute("data-id", tarefa.id);
            tarefaDiv.innerHTML = `
                <h3>${tarefa.title}</h3>
                <p><strong>ID do Usuário:</strong> ${tarefa.userId}</p>
                <p><strong>Status:</strong> ${tarefa.completed ? 'Concluída' : 'Pendente'}</p>
                <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
            `;
            listaTarefas.appendChild(tarefaDiv);
        };
    
        window.editarTarefa = async (id) => {
            const novoTitulo = prompt("Digite o novo título da tarefa:");
            if (!novoTitulo) return;
    
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: novoTitulo })
                });
                if (!response.ok) throw new Error("Erro ao editar tarefa");
                
                todasTarefas = todasTarefas.map(tarefa => 
                    tarefa.id === id ? { ...tarefa, title: novoTitulo } : tarefa
                );
                renderizarTarefas();
                alert("Tarefa editada com sucesso!");
            } catch (error) {
                console.error("Erro ao editar tarefa:", error);
            }
        };
    
        window.excluirTarefa = async (id) => {
            const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");
            if (!confirmar) return;
    
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Erro ao excluir tarefa");
                
                todasTarefas = todasTarefas.filter(tarefa => tarefa.id !== id);
                renderizarTarefas();
                alert("Tarefa excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);
            }
        };
    
        carregarTarefas();

        window.filtrarTarefas = () => {
            const userId = filtroUsuario.value;
            if (userId) {
                tarefasFiltradas = todasTarefas.filter(tarefa => tarefa.userId === parseInt(userId));
            } else {
                tarefasFiltradas = todasTarefas;
            }
            renderizarTarefas();
        };

        formularioTarefa.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const idUsuario = document.getElementById('idUsuario').value;
                const titulo = document.getElementById('titulo').value;
                const descricao = document.getElementById('descricao').value;

                const resposta = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: parseInt(idUsuario), title: titulo, description: descricao, completed: false })
                });
                if (!resposta.ok) throw new Error('Erro ao adicionar tarefa');

                const novaTarefa = await resposta.json();

                todasTarefas.unshift(novaTarefa);
                filtrarTarefas();

                renderizarTarefas();
                alert('Tarefa adicionada com sucesso!');
                formularioTarefa.reset();
            } catch (erro) {
                alert(`Erro: ${erro.message}`);
            }
        });

        async function editarTarefa(id) {
            const novoTitulo = prompt("Digite o novo título da tarefa:");

            if (!novoTitulo) return;

            try {
                await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ title: novoTitulo }),
                    headers: { "Content-Type": "application/json" }
                });

                alert("Tarefa editada com sucesso!");
                carregarTarefas(); 
            } catch (error) {
                console.error("Erro ao editar tarefa:", error);
            }
        }

        async function excluirTarefa(id) {
            const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");

            if (!confirmar) return;

            try {
                await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                alert("Tarefa excluída com sucesso!");
                carregarTarefas(); 
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);
            }
        }
        buscarTarefasBtn.addEventListener("click", () => {
            const idUsuario = filtroUsuario.value;
            if (idUsuario) {
                carregarTarefas(idUsuario);
            } else {
                alert("Digite um ID de usuário válido!");
            }
        });

        // Add event listener for input changes
        filtroUsuario.addEventListener("input", () => {
            const idUsuario = filtroUsuario.value;
            if (idUsuario) {
                tarefasFiltradas = todasTarefas.filter(tarefa => tarefa.userId === parseInt(idUsuario));
            } else {
                tarefasFiltradas = todasTarefas;
            }
            renderizarTarefas();
        });

        carregarTarefas();
    });
}
inicializarAplicacao();