// State management - undo/redo, save/load
export class StateManager {
  constructor(board) {
    this.board = board;
    this.history = [];
    this.future = [];
    this.maxHistory = 50;
    this.isProcessing = false;
    
    this.autoSaveInterval = setInterval(() => {
      this.saveToLocalStorage();
    }, 30000);
    
    this.restoreState();
  }
  
  saveState() {
    if (this.isProcessing) return;
    
    const state = this.board.grid.map(row => [...row]);
    this.history.push(state);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    this.future = [];
    this.saveToLocalStorage();
  }
  
  undo() {
    if (this.history.length <= 1) return;
    
    this.isProcessing = true;
    const currentState = this.history.pop();
    this.future.push(currentState);
    
    const prevState = this.history[this.history.length - 1];
    this.board.grid = prevState.map(row => [...row]);
    this.board.render();
    this.isProcessing = false;
    
    this.saveToLocalStorage();
  }
  
  redo() {
    if (this.future.length === 0) return;
    
    this.isProcessing = true;
    const nextState = this.future.pop();
    this.history.push(nextState);
    
    this.board.grid = nextState.map(row => [...row]);
    this.board.render();
    this.isProcessing = true;
    
    this.saveToLocalStorage();
  }
  
  saveToLocalStorage() {
    try {
      localStorage.setItem('bead-game-state', JSON.stringify(this.board.grid));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  }
  
  restoreState() {
    try {
      const saved = localStorage.getItem('bead-game-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length === this.board.rows && 
            parsed[0] && parsed[0].length === this.board.cols) {
          this.board.grid = parsed;
          this.board.render();
          this.history.push(parsed.map(row => [...row]));
        }
      }
    } catch (e) {
      console.warn('Restore failed:', e);
    }
  }
}
