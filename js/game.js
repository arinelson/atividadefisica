let game = new Chess();
let currentDifficulty = '';
let stockfish = new Worker('path-to-stockfish.js');

// Game initialization
function initGame() {
    // Initialize the board with starting position
    board = ChessBoard('chessboard', {
        position: 'start',
        draggable: true,
        onDrop: onPieceDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare
    });
}

// Set difficulty level
function setDifficulty(level) {
    currentDifficulty = level;
    const depths = {
        'beginner': 1,
        'easy': 2,
        'medium': 3,
        'hard': 5,
        'expert': 8
    };
    
    stockfish.postMessage(`setoption name Skill Level value ${depths[level]}`);
}

// Start the game
function startGame() {
    if (!currentDifficulty) {
        alert('Please select a difficulty level first!');
        return;
    }
    
    document.getElementById('difficulty-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initGame();
}

// Helper functions
function undoMove() {
    game.undo();
    board.position(game.fen());
    updateStatus();
}

function getHint() {
    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage('go depth 15');
    
    stockfish.onmessage = function(event) {
        if (event.data.includes('bestmove')) {
            const move = event.data.split(' ')[1];
            highlightSquare(move.substring(0, 2));
            highlightSquare(move.substring(2, 4));
        }
    };
}

function toggleLegalMoves() {
    // Implementation for showing/hiding legal moves
}

function analyzePosition() {
    // Implementation for position analysis
}

function resignGame() {
    if (confirm('Are you sure you want to resign?')) {
        game = new Chess();
        board.start();
        updateStatus();
    }
}

function restartGame() {
    game = new Chess();
    board.start();
    updateStatus();
}

// Game state updates
function updateStatus() {
    let status = '';
    
    if (game.in_checkmate()) {
        status = 'Game Over - Checkmate!';
    } else if (game.in_draw()) {
        status = 'Game Over - Draw!';
    } else {
        status = game.turn() === 'w' ? 'White to move' : 'Black to move';
        if (game.in_check()) {
            status += ' (Check)';
        }
    }
    
    document.getElementById('status').textContent = status;
    updateMoveHistory();
}

function updateMoveHistory() {
    const history = game.history({ verbose: true });
    const historyElement = document.getElementById('move-history');
    historyElement.innerHTML = '';
    
    history.forEach((move, index) => {
        if (index % 2 === 0) {
            historyElement.innerHTML += `${Math.floor(index/2 + 1)}. ${move.san} `;
        } else {
            historyElement.innerHTML += `${move.san} `;
        }

        
    });
}