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
    this.tools = new Tools(this.board);
    this.state = new StateManager(this.board);
    this.ui = new UIManager(this.board, this.tools, this.state, this.templates);
    this.templates = new Templates(this.board, this.tools);
    
    this.init();
  }
  
  async init() {
    await this.ui.initialize();
    this.board.render();
    this.tools.selectTool('pen');
    this.templates.loadTemplates();
    this.state.restoreState();
  }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});