let perguntas = [];
let bancoDeDados;
let indicePerguntaAtual = 0;
let pontuacao = 0;

function abrirBancoDeDados() {
    const request = indexedDB.open('quizDB', 3); // Certifique-se de que a versão é a mesma que no questao.js

    request.onupgradeneeded = function(evento) {
        bancoDeDados = evento.target.result;
        if (!bancoDeDados.objectStoreNames.contains('perguntas')) {
            bancoDeDados.createObjectStore('perguntas', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function(evento) {
        bancoDeDados = evento.target.result;
        carregarPerguntas();
    };

    request.onerror = function(evento) {
        console.error('Erro ao abrir o banco de dados:', evento.target.errorCode);
    };
}

function carregarPerguntas() {
    const transacao = bancoDeDados.transaction(['perguntas'], 'readonly');
    const store = transacao.objectStore('perguntas');
    const request = store.getAll();

    request.onsuccess = function(evento) {
        perguntas = evento.target.result;
        if (perguntas.length > 0) {
            iniciarQuiz();
        } else {
            console.log('Nenhuma pergunta encontrada.');
        }
    };

    request.onerror = function() {
        console.log('Erro ao carregar perguntas.');
    };
}

function iniciarQuiz() {
    indicePerguntaAtual = 0;
    pontuacao = 0;
    document.getElementById('next-btn').innerHTML = 'Próxima';
    exibirPergunta();
}

function exibirPergunta() {
    resetarEstado();
    const perguntaAtual = perguntas[indicePerguntaAtual];
    const numeroPergunta = indicePerguntaAtual + 1;
    document.getElementById('question').innerHTML = `${numeroPergunta}. ${perguntaAtual.pergunta}`;

    perguntaAtual.opcoes.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.innerHTML = opcao;
        botao.classList.add('btn');
        document.getElementById('answerButtons').appendChild(botao);
        if (index === perguntaAtual.respostaCorreta) {
            botao.dataset.correct = true;
        }
        botao.addEventListener('click', selecionarResposta);
    });
}

function resetarEstado() {
    document.getElementById('next-btn').style.display = 'none';
    const answerButtons = document.getElementById('answerButtons');
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selecionarResposta(e) {
    const botaoSelecionado = e.target;
    const respostaCorreta = botaoSelecionado.dataset.correct === 'true';
    if (respostaCorreta) {
        botaoSelecionado.classList.add('correct');
        pontuacao++;
    } else {
        botaoSelecionado.classList.add('incorrect');
    }
    Array.from(document.getElementById('answerButtons').children).forEach(botao => {
        if (botao.dataset.correct === 'true') {
            botao.classList.add('correct');
        }
        botao.disabled = true;
    });
    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').addEventListener('click', () => {
    indicePerguntaAtual++;
    if (indicePerguntaAtual < perguntas.length) {
        exibirPergunta();
    } else {
        exibirPontuacao();
    }
});

function exibirPontuacao() {
    resetarEstado();
    document.getElementById('question').innerHTML = `Você acertou ${pontuacao} de ${perguntas.length}!`;
    exibirNotificacao();
}

function exibirNotificacao() {
    const notificacao = document.createElement('div');
    notificacao.classList.add('notification');
    notificacao.innerHTML = `
        <h3>Quiz Finalizado!</h3>
        <p><strong>Mais Projetos:</strong> <a href="https://seulink.com" target="_blank">Clique aqui</a></p>
        <p><strong>Sobre Mim:</strong> Informações sobre você.</p>
        <p><strong>Jogar Novamente:</strong> <a href="index.html">Clique aqui</a></p>
    `;
    document.body.appendChild(notificacao);
    setTimeout(() => {
        notificacao.remove();
    }, 10000); // Remove a notificação após 10 segundos
}

// Chamar a função para abrir o banco de dados ao carregar a página
abrirBancoDeDados();
