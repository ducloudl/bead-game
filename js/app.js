// bead-game - Modular Structure
// Main entry point

import { Board } from './board.js';
import { Tools } from './tools.js';
import { StateManager } from './state.js';
import { UIManager } from './ui.js';
import { Templates } from './templates.js';

class App {
  constructor() {
    this.board = new Board();
    this.uiManager = new UIManager(this.board, null, null, null);
    this.templates = new Templates(this.board, null);
    this.tools = new Tools(this.board, this.uiManager);
    this.state = new StateManager(this.board);
    
    // Wire up dependencies
    this.uiManager.board = this.board;
    this.uiManager.tools = this.tools;
    this.uiManager.state = this.state;
    this.uiManager.templates = this.templates;
    this.tools.uiManager = this.uiManager;
    this.templates.tools = this.tools;
    
    this.init();
  }
  
  async init() {
    await this.uiManager.initialize();
    this.board.render();
    this.tools.selectTool('pen');
    this.state.restoreState();
  }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
