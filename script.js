// Array para representar o tabuleiro do jogo
let board = ['', '', '', '', '', '', '', '', ''];

// Variáveis para rastrear o placar agregado
let userScore = 0;
let aiScore = 0;
let tieScore = 0;

// Adiciona evento de clique para as células do tabuleiro
document.querySelectorAll('.game button').forEach((button, index) => {
    button.addEventListener('click', () => {
        // Verifica se a célula está vazia e se o jogo ainda está em andamento
        if (board[index] === '' && checkWinner(board) === null) {
            // Marca a célula clicada pelo usuário como 'O'
            board[index] = 'O';
            // Renderiza o tabuleiro atualizado na tela
            renderBoard();
            // Verifica se há um vencedor após a jogada do usuário e exibe a mensagem correspondente
            checkWinnerAndDisplayMessage();
            // Se o jogo ainda estiver em andamento, a IA faz sua jogada
            if (checkWinner(board) === null) {
                makeAIMove();
            }
        }
    });
});

// Função para renderizar o tabuleiro atualizado na tela
function renderBoard() {
    const buttons = document.querySelectorAll('.game button'); // Obtém TODOS os botões do tabuleiro e atribui a "buttons"
    // Itera sobre todas as células do tabuleiro e atualiza o texto de cada botão
    board.forEach((cell, index) => {
        buttons[index].textContent = cell;
    });
}

// Função para verificar se há um vencedor ou empate
function checkWinner(board) {
    // Define as combinações vencedoras possíveis no jogo da velha
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    // Itera sobre cada combinação vencedora
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        // Verifica se há uma vitória para o jogador 'O' ou 'X' em cada combinação
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Retorna o vencedor (X ou O)
        }
    }

    // Verifica se todas as células estão preenchidas, mas não há vencedor
    if (board.every(cell => cell !== '')) {
        return 'tie'; // Retorna 'empate' se não houver vencedor e todas as células estiverem preenchidas
    }

    return null; // Retorna nulo se o jogo ainda estiver em andamento
}

// Função para verificar o vencedor e exibir uma mensagem
function checkWinnerAndDisplayMessage() {
    const winner = checkWinner(board); // Chama a função para verificar o vencedor
    const messageElement = document.getElementById('message'); // Obtém o elemento de mensagem do HTML
    // Define a mensagem com base no vencedor ou empate
    if (winner === 'O') {
        messageElement.textContent = 'Você venceu!'; // Exibe mensagem de vitória do jogador
    } else if (winner === 'X') {
        messageElement.textContent = 'A IA venceu!'; // Exibe mensagem de vitória da IA
    } else if (winner === 'tie') {
        messageElement.textContent = 'Empate!'; // Exibe mensagem de empate
    } else {
        messageElement.textContent = ''; // Limpa a mensagem se o jogo estiver em andamento
    }
    updateScore(winner); // Chama a função para atualizar o placar com base no vencedor
}

// Função para atualizar e exibir o placar agregado
function updateScore(winner) {
    // Atualiza o placar agregado com base no vencedor do jogo
    if (winner === 'O') {
        userScore++; // Incrementa o placar do usuário se ele vencer
    } else if (winner === 'X') {
        aiScore++; // Incrementa o placar da IA se ela vencer
    } else if (winner === 'tie') {
        tieScore++; // Incrementa o placar de empate se não houver vencedor
    }
    // Exibe o placar agregado atualizado na tela
    document.getElementById('score').textContent = `Usuário: ${userScore} - IA: ${aiScore} - Empates: ${tieScore}`;
}

// Função para resetar o jogo
function resetGame() {
    // Reinicia o tabuleiro do jogo
    board = ['', '', '', '', '', '', '', '', ''];
    // Renderiza o tabuleiro atualizado na tela
    renderBoard();
    // Limpa a mensagem de resultado do jogo
    document.getElementById('message').textContent = '';
}

// Adiciona evento de clique para o botão de reiniciar
document.getElementById('reset').addEventListener('click', resetGame);

// Função para resetar o placar e o jogo
function resetScoreAndGame() {
    // Reseta os placares do usuário, da IA e de empate
    userScore = 0;
    aiScore = 0;
    tieScore = 0;
    // Atualiza e exibe o placar agregado na tela
    document.getElementById('score').textContent = `Usuário: ${userScore} - IA: ${aiScore} - Empates: ${tieScore}`;
    // Reseta o jogo
    resetGame();
}

// Adiciona evento de clique para o botão de resetar o placar
document.getElementById('resetScoreAndGame').addEventListener('click', resetScoreAndGame);

// ---------------------------------------------------------------------------------------------------- //

// Função para fazer a jogada da IA
function makeAIMove() {
    let bestScore = -Infinity;
    let bestMove;

    // Percorre e avalia todas as células do tabuleiro 
    for (let i = 0; i < board.length; i++) {
        // Verifica se a célula está vazia (jogadas possíveis)
        if (board[i] === '') {
            // Estipula um estado inicial no tabuleiro
            board[i] = 'X';
            // Calcula a pontuação para a jogada utilizando o algoritmo Minimax
            const score = minimax(board, 0, false);
            // Desfaz a jogada simulada
            board[i] = '';
            // Atualiza a melhor pontuação e a melhor jogada
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    // Realiza a jogada da IA na posição determinada como a melhor
    board[bestMove] = 'X';
    // Renderiza o tabuleiro atualizado na tela
    renderBoard();
    // Verifica se há um vencedor e exibe a mensagem correspondente
    checkWinnerAndDisplayMessage();
}

// Função que implementa o algoritmo Minimax
function minimax(board, depth, maximizingPlayer) {
    // Define os valores de pontuação para o jogador 'X', 'O' e empate
    const scores = {
        'X': 1,
        'O': -1,
        'tie': 0
    };

    // Verifica se há um vencedor ou empate (Nó folha ou Estado Final)
    const winner = checkWinner(board);

    // Condição de parada: Se houver um vencedor ou se a profundidade for igual a 9
    // retorna a pontuação correspondente
    if (winner !== null || depth === 9) {
        return scores[winner];
    }

    // Se for a vez da IA: jogador maximizador ('X')
    if (maximizingPlayer) {
        let bestScore = -Infinity;
        // Percorre todas as céluals do tabuleiro
        for (let i = 0; i < board.length; i++) {
            // Verifica se a célula está vazia (Jogadas Possíveis)
            if (board[i] === '') {
                // Simula todas as jogadas do jogador 'X'
                board[i] = 'X';
                // Chama recursivamente a função minimax para determinar a melhor pontuação
                const score = minimax(board, depth + 1, false);
                // Desfaz a jogada simulada
                board[i] = '';
                // Atualiza a melhor pontuação com o máximo entre a pontuação atual e a melhor pontuação
                bestScore = Math.max(score, bestScore);
                
            }
        }
        // Retorna a melhor pontuação para o jogador 'X'
        return bestScore;
    } else { // Se for a vez do jogador minimizador ('O')
        let bestScore = Infinity;
        // Percorre todas as células do tabuleiro
        for (let i = 0; i < board.length; i++) {
            // Verifica se a célula está vazia
            if (board[i] === '') {
                // Simula a jogada do jogador 'O'
                board[i] = 'O';
                // Chama recursivamente a função minimax para determinar a melhor pontuação
                const score = minimax(board, depth + 1, true);
                // Desfaz a jogada simulada
                board[i] = '';
                // Atualiza a melhor pontuação com o mínimo entre a pontuação atual e a melhor pontuação
                bestScore = Math.min(score, bestScore);
            }
        }
        // Retorna a melhor pontuação para o jogador 'O'
        return bestScore;
    }
}

// ---------------------------------------------------------------------------------------------------- //
