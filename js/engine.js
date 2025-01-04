class ChessEngine {
    constructor() {
        this.stockfish = new Worker('stockfish.js');
        this.currentLevel = 0;
        this.isThinking = false;
        this.initialized = false;
    }

    init() {
        return new Promise((resolve) => {
            this.stockfish.onmessage = (event) => {
                if (event.data === 'uciok') {
                    this.initialized = true;
                    this.setDifficulty(this.currentLevel);
                    resolve();
                }
            };
            this.stockfish.postMessage('uci');
        });
    }

    setDifficulty(level) {
        this.currentLevel = level;
        const skillLevel = Math.min(20, Math.max(0, level * 4)); // Convert 0-5 to 0-20 range
        const depth = Math.min(20, Math.max(1, level * 4)); // Adjust search depth based on level
        
        this.stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`);
        this.stockfish.postMessage(`setoption name Search Depth value ${depth}`);
    }

    async getMove(fen) {
        if (this.isThinking) return null;
        
        return new Promise((resolve) => {
            this.isThinking = true;
            
            this.stockfish.onmessage = (event) => {
                const message = event.data;
                
                if (message.startsWith('bestmove')) {
                    this.isThinking = false;
                    const move = message.split(' ')[1];
                    resolve(move);
                }
            };

            this.stockfish.postMessage(`position fen ${fen}`);
            this.stockfish.postMessage('go movetime 1000'); // Adjust thinking time based on level
        });
    }

    async evaluatePosition(fen) {
        return new Promise((resolve) => {
            this.stockfish.onmessage = (event) => {
                const message = event.data;
                if (message.startsWith('info') && message.includes('score cp')) {
                    const score = parseInt(message.split('score cp ')[1]);
                    resolve(score / 100); // Convert centipawns to pawns
                }
            };

            this.stockfish.postMessage(`position fen ${fen}`);
            this.stockfish.postMessage('go depth 15');
        });
    }

    stop() {
        this.stockfish.postMessage('stop');
        this.isThinking = false;
    }

    quit() {
        this.stockfish.postMessage('quit');
    }
}

// Initialize engine
const engine = new ChessEngine();
engine.init();