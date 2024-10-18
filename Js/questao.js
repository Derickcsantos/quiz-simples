let db;

document.addEventListener("DOMContentLoaded", () => {
    // Exclui o banco de dados existente para garantir que começamos do zero
    const deleteRequest = indexedDB.deleteDatabase('quizDB');

    deleteRequest.onsuccess = function() {
        console.log('Banco de dados excluído com sucesso.');

        // Agora, abre um novo banco de dados
        let request = indexedDB.open("quizDB", 1);

        request.onupgradeneeded = function(e) {
            db = e.target.result;
            console.log('Criando lojas de objetos...');

            // Cria a loja de objetos
            db.createObjectStore("perguntas", { keyPath: "id", autoIncrement: true });
            console.log('Loja de objetos "perguntas" criada.');
        };

        request.onsuccess = function(e) {
            db = e.target.result;
            console.log('Banco de dados aberto com sucesso.');
            mostrarPerguntasSalvas(); // Exibe as perguntas salvas ao abrir o banco de dados
        };

        request.onerror = function(e) {
            console.error("Erro ao abrir o banco de dados:", e.target.errorCode);
        };

        document.getElementById("formPerguntas").addEventListener("submit", salvarPergunta);
    };

    deleteRequest.onerror = function() {
        console.error('Erro ao excluir o banco de dados.');
    };
});

function salvarPergunta(e) {
    e.preventDefault();

    let pergunta = document.getElementById("pergunta").value;
    let opcoes = [
        document.getElementById("opcao1").value,
        document.getElementById("opcao2").value,
        document.getElementById("opcao3").value,
        document.getElementById("opcao4").value
    ];
    let respostaCorreta = parseInt(document.getElementById("resposta").value);

    // Certifique-se de que o objeto que você está adicionando tem a estrutura correta
    let novaPergunta = {
        pergunta: pergunta,
        opcoes: opcoes,
        respostaCorreta: respostaCorreta
    };

    if (db) {
        try {
            let transaction = db.transaction(["perguntas"], "readwrite");
            let store = transaction.objectStore("perguntas");
            let request = store.add(novaPergunta); // O id será gerado automaticamente.

            request.onsuccess = function() {
                console.log('Pergunta salva com sucesso!');
                mostrarPerguntasSalvas();
                document.getElementById("formPerguntas").reset();
            };

            request.onerror = function(e) {
                console.error("Erro ao salvar pergunta:", e.target.errorCode);
            };
        } catch (error) {
            console.error("Erro ao iniciar transação:", error);
        }
    } else {
        console.error("Banco de dados não está disponível.");
    }
}

function mostrarPerguntasSalvas() {
    let lista = document.getElementById("listaPerguntas");
    lista.innerHTML = "";

    if (db) {
        let transaction = db.transaction(["perguntas"], "readonly");
        let store = transaction.objectStore("perguntas");
        let request = store.openCursor();

        request.onsuccess = function(e) {
            let cursor = e.target.result;
            if (cursor) {
                let li = document.createElement("li");
                li.textContent = `${cursor.value.pergunta} - [${cursor.value.opcoes.join(", ")}]`;
                li.classList.add("minha-classe-li");
                lista.appendChild(li);
                cursor.continue();
            } else {
                console.log('Nenhuma pergunta encontrada.');
            }
        };

        request.onerror = function(e) {
            console.error("Erro ao mostrar perguntas:", e.target.errorCode);
        };
    } else {
        console.error("Banco de dados não está disponível.");
    }
}
