// UI handling and interactions
class ChessUI {
    constructor() {
        this.highlightedSquares = [];
        this.boardTheme = 'default';
        this.soundEnabled = true;
    }

    init() {
        this.bindUIEvents();
        this.setupSoundEffects();
    }

    bindUIEvents() {
        document.querySelectorAll('.square-55d63').forEach(square => {
            square.addEventListener('mouseenter', (e) => this.onSquareHover(e));
            square.addEventListener('mouseleave', (e) => this.clearHighlights());
        });

        // Theme toggling
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sound toggling
        document.getElementById('sound-toggle')?.addEventListener('click', () => {
            this.toggleSound();
        });
    }

    setupSoundEffects() {
        this.sounds = {
            move: new Audio('assets/sounds/move.mp3'),
            capture: new Audio('assets/sounds/capture.mp3'),
            check: new Audio('assets/sounds/check.mp3'),
            castling: new Audio('assets/sounds/castling.mp3')
        };
    }

    playSound(soundType) {
        if (this.soundEnabled && this.sounds[soundType]) {
            this.sounds[soundType].play().catch(e => console.log('Sound playback failed:', e));
        }
    }

    highlightSquare(square, color = '#3498db66') {
        const squareEl = document.querySelector(`.square-${square}`);
        if (squareEl) {
            squareEl.style.backgroundColor = color;
            this.highlightedSquares.push(square);
        }
    }

    clearHighlights() {
        this.highlightedSquares.forEach(square => {
            const squareEl = document.querySelector(`.square-${square}`);
            if (squareEl) {
                squareEl.style.backgroundColor = '';
            }
        });
        this.highlightedSquares = [];
    }

    showLegalMoves(moves) {
        this.clearHighlights();
        moves.forEach(move => {
            this.highlightSquare(move.to, '#2ecc7166');
        });
    }

    updateStatusDisplay(status) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = status;
        }
    }

    toggleTheme() {
        const board = document.getElementById('chessboard');
        if (this.boardTheme === 'default') {
            board.classList.add('dark-theme');
            this.boardTheme = 'dark';
        } else {
            board.classList.remove('dark-theme');
            this.boardTheme = 'default';
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundToggleEl = document.getElementById('sound-toggle');
        if (soundToggleEl) {
            soundToggleEl.textContent = this.soundEnabled ? 'Sound: On' : 'Sound: Off';
        }
    }

    showGameOver(winner) {
        const gameOverModal = document.createElement('div');
        gameOverModal.className = 'game-over-modal';
        gameOverModal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over</h2>
                <p>${winner === 'draw' ? "It's a draw!" : `${winner} wins!`}</p>
                <button onclick="restartGame()">Play Again</button>
            </div>
        `;
        document.body.appendChild(gameOverModal);
    }
}

// Initialize UI
const ui = new ChessUI();
ui.init();