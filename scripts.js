// Perguntas do questionário
const perguntas = [
    { pergunta: "Qual é o seu objetivo principal?", opcoes: ["Ganho de Massa Muscular", "Perda de Peso", "Flexibilidade", "Resistência"] },
    { pergunta: "Quantas vezes por semana você pode treinar?", opcoes: ["1-2 vezes", "3-4 vezes", "5-7 vezes"] },
    { pergunta: "Qual é o seu nível de condicionamento físico atual?", opcoes: ["Iniciante", "Intermediário", "Avançado"] },
    { pergunta: "Qual tipo de treino você prefere?", opcoes: ["Individual", "Em Grupo", "Com Personal Trainer"] },
    { pergunta: "Quanto tempo você tem disponível para cada treino?", opcoes: ["Menos de 30 minutos", "30-60 minutos", "Mais de 60 minutos"] },
    { pergunta: "Qual o seu nível de motivação para treinar?", opcoes: ["Baixo", "Médio", "Alto"] },
    { pergunta: "Você tem alguma lesão ou limitação física?", opcoes: ["Não", "Sim"] },
    { pergunta: "Qual é a sua idade?", opcoes: ["Menos de 20 anos", "20-40 anos", "Mais de 40 anos"] },
    { pergunta: "Qual é o seu horário preferido para treinar?", opcoes: ["Manhã", "Tarde", "Noite"] },
    { pergunta: "Você prefere treinos ao ar livre ou em ambientes fechados?", opcoes: ["Ao Ar Livre", "Ambientes Fechados"] }
];

let respostas = [];
let perguntaAtual = 0;

document.addEventListener('DOMContentLoaded', function() {
    mostrarPergunta();
});

function mostrarPergunta() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    if (perguntaAtual < perguntas.length) {
        const perguntaObj = perguntas[perguntaAtual];
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('question');

        const perguntaLabel = document.createElement('label');
        perguntaLabel.textContent = perguntaObj.pergunta;
        perguntaDiv.appendChild(perguntaLabel);

        perguntaObj.opcoes.forEach(opcao => {
            const opcaoLabel = document.createElement('label');
            const opcaoInput = document.createElement('input');
            opcaoInput.type = 'radio';
            opcaoInput.name = 'resposta';
            opcaoInput.value = opcao;
            opcaoLabel.appendChild(opcaoInput);
            opcaoLabel.appendChild(document.createTextNode(opcao));
            perguntaDiv.appendChild(opcaoLabel);
        });

        const botaoProximo = document.createElement('button');
        botaoProximo.textContent = 'Próximo';
        botaoProximo.addEventListener('click', proximaPergunta);
        perguntaDiv.appendChild(botaoProximo);

        quizContainer.appendChild(perguntaDiv);
    } else {
        mostrarResultado();
    }
}

function proximaPergunta() {
    const respostaSelecionada = document.querySelector('input[name="resposta"]:checked');
    if (respostaSelecionada) {
        respostas.push(respostaSelecionada.value);
        perguntaAtual++;
        mostrarPergunta();
    } else {
        alert('Por favor, selecione uma resposta.');
    }
}

function mostrarResultado() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    // Lógica para determinar o estilo de treino com base nas respostas
    let resultado = '';

    if (respostas[0] === 'Ganho de Massa Muscular' && respostas[2] === 'Avançado') {
        resultado = 'Seu estilo de treino é Musculação Avançada!';
    } else if (respostas[0] === 'Perda de Peso' && respostas[1] === '5-7 vezes') {
        resultado = 'Seu estilo de treino é Cardio Intenso!';
    } else if (respostas[0] === 'Flexibilidade' && respostas[3] === 'Individual') {
        resultado = 'Seu estilo de treino é Yoga Individual!';
    } else if (respostas[0] === 'Resistência' && respostas[4] === 'Mais de 60 minutos') {
        resultado = 'Seu estilo de treino é Treinamento de Resistência!';
    } else {
        resultado = 'Seu estilo de treino é uma combinação personalizada!';
    }

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('resultado');
    resultadoDiv.textContent = resultado;
    quizContainer.appendChild(resultadoDiv);
}