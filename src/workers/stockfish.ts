/**
 * Stockfish class manages the Stockfish chess engine Web Worker.
 */
export class Stockfish {
  private worker: Worker;
  private messageCallback: ((message: string) => void) | null = null;

  constructor() {
    this.worker = new Worker('/stockfish.js');
    this.worker.onmessage = (e) => {
      if (this.messageCallback) {
        this.messageCallback(e.data);
      }
    };

    // Configure Stockfish for faster analysis with lower accuracy
    this.worker.postMessage('uci');
    this.worker.postMessage('setoption name MultiPV value 3');
    this.worker.postMessage('setoption name Threads value 1');
    this.worker.postMessage('setoption name Hash value 16');
    this.worker.postMessage('setoption name Skill Level value 10');
    this.worker.postMessage('setoption name Move Overhead value 10');
    this.worker.postMessage('setoption name Minimum Thinking Time value 20');
    this.worker.postMessage('setoption name Slow Mover value 80');
    this.worker.postMessage('isready');
  }

  /**
   * analyzePosition method sends a position to the engine for analysis.
   * @param fen - The FEN string of the position to analyze.
   */
  public analyzePosition(fen: string): void {
    this.worker.postMessage('stop');
    this.worker.postMessage('position fen ' + fen);
    this.worker.postMessage('go movetime 50 depth 12'); // Much faster analysis
  }

  /**
   * onMessage method sets a callback function to receive messages from the engine.
   * @param callback - The callback function to be called when a message is received.
   */
  public onMessage(callback: (message: string) => void): void {
    this.messageCallback = callback;
  }

  /**
   * stop method stops the engine from analyzing.
   */
  public stop(): void {
    this.worker.postMessage('stop');
  }

  /**
   * terminate method terminates the engine worker.
   */
  public terminate(): void {
    this.worker.terminate();
  }
}
