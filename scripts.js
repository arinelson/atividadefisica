document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const difficultySelect = document.getElementById('difficulty');
    const startBtn = document.getElementById('startBtn');
    
    let board, game;

    function initGame() {
        game = new Chess();
        
        board = Chessboard(boardElement, {
            draggable: true,
            position: 'start',
            onDrop: handleMove,
            onMouseoutSquare: removeGreySquares,
            onMouseoverSquare: highlightLegalMoves
        });
    }

    function handleMove(source, target) {
        const move = game.move({ from: source, to: target, promotion: 'q' });

        if (move === null) return 'snapback';

        window.setTimeout(makeBestMove, 250);
    }

    function makeBestMove() {
        const difficulty = parseInt(difficultySelect.value);
        const bestMove = calculateBestMove(game, difficulty);
        game.move(bestMove);
        board.position(game.fen());
    }

    function calculateBestMove(game, difficulty) {
        // Simulação de IA simples baseada na dificuldade
        let possibleMoves = game.ugly_moves();
        if (difficulty === 0) {
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
            // Implementar lógica de IA mais avançada aqui
            // Para este exemplo, vamos apenas retornar um movimento aleatório
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
    }

    function removeGreySquares() {
        $('#board .square-55d63').css('background', '');
    }

    function highlightLegalMoves(square) {
        const moves = game.moves({
            square: square,
            verbose: true
        });

        if (moves.length === 0) return;

        highlightSquare(square);

        moves.forEach(move => highlightSquare(move.to));
    }

    function highlightSquare(square) {
        const squareEl = $('#board .square-' + square);

        const background = '#a9a9a9';
        if (squareEl.hasClass('black-3c85d') === true) {
            squareEl.css('background', '#696969');
        } else {
            squareEl.css('background', background);
        }
    }

    startBtn.addEventListener('click', initGame);
});