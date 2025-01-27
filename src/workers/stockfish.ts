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

  public analyzePosition(fen: string): void {
    this.worker.postMessage('stop');
    this.worker.postMessage('position fen ' + fen);
    this.worker.postMessage('go movetime 50 depth 12'); // Much faster analysis
  }

  public onMessage(callback: (message: string) => void): void {
    this.messageCallback = callback;
  }

  public stop(): void {
    this.worker.postMessage('stop');
  }

  public terminate(): void {
    this.worker.terminate();
  }
}