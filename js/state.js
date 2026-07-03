// State management - undo/redo, save/load
export class StateManager {
  constructor(board) {
    this.board = board;
    this.history = [];
    this.future = [];
    this.maxHistory = 50;
    this.isRestoring = false;
    
    this.setupAutoSave();
  }
  
  saveState() {
    if (this.isRestoring) return;
    
    // Remove any future states when a new action is made
    this.future = [];
    
    // Add current state to history
    this.history.push(this.cloneGrid());
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }
  
  undo() {
    if (this.history.length <= 1) return;
    
    // Save current state to future
    this.future.push(this.history.pop());
    
    // Restore previous state
    const previousState = this.history[this.history.length - 1];
    this.restoreGrid(previousState);
  }
  
  redo() {
    if (this.future.length === 0) return;
    
    // Get state from future
    const nextState = this.future.pop();
    
    // Save to history
    this.history.push(nextState);
    
    // Restore the state
    this.restoreGrid(nextState);
  }
  
  cloneGrid() {
    return this.board.grid.map(row => [...row]);
  }
  
  restoreGrid(grid) {
    this.isRestoring = true;
    this.board.grid = grid;
    this.board.render();
    this.isRestoring = false;
  }
  
  setupAutoSave() {
    // Auto-save to localStorage every 30 seconds
    setInterval(() => {
      this.saveToLocalStorage();
    }, 30000);
    
    // Save before leaving page
    window.addEventListener('beforeunload', () => {
      this.saveToLocalStorage();
    });
  }
  
  saveToLocalStorage() {
    const data = {
      grid: this.board.grid,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('bead-game-state', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }
  
  restoreState() {
    try {
      const data = localStorage.getItem('bead-game-state');
      if (data) {
        const parsed = JSON.parse(data);
        this.board.grid = parsed.grid;
        this.board.render();
        
        // Initialize history with restored state
        this.history = [this.cloneGrid()];
      }
    } catch (e) {
      console.error('Failed to restore state:', e);
    }
  }
  
  clearHistory() {
    this.history = [];
    this.future = [];
  }
}