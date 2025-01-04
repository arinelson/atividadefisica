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

    async function makeBestMove() {
        const difficulty = parseInt(difficultySelect.value);
        const bestMove = await getBestMoveFromAPI(game.fen(), difficulty);
        if (bestMove) {
            game.move(bestMove);
            board.position(game.fen());
        }
    }

    async function getBestMoveFromAPI(fen, difficulty) {
        const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=${difficulty}`);
        const data = await response.json();
        if (data.pvs && data.pvs.length > 0) {
            // Select the best move based on difficulty level
            const moves = data.pvs.slice(0, difficulty).map(pv => pv.moves.split(' ')[0]);
            return moves[Math.floor(Math.random() * moves.length)];
        }
        return null;
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