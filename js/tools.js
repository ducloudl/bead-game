// Drawing tools and utilities
export class Tools {
  constructor(board, uiManager) {
    this.board = board;
    this.uiManager = uiManager;
    this.currentTool = 'pen';
    this.selectedColor = '#000000';
    this.isDrawing = false;
    this.lastCell = null;
    
    this.setupEventListeners();
    this.updateColorPreview();
  }
  
  setupEventListeners() {
    if (!this.board.element) return;
    
    // Touch events for mobile drawing
    this.board.element.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('cell')) {
        e.preventDefault();
        this.isDrawing = true;
        this.handleCellInteraction(e.touches[0]);
      }
    }, { passive: false });
    
    this.board.element.addEventListener('touchmove', (e) => {
      if (this.isDrawing && e.target.classList.contains('cell')) {
        e.preventDefault();
        this.handleCellInteraction(e.touches[0]);
      }
    }, { passive: false });
    
    this.board.element.addEventListener('touchend', () => {
      this.isDrawing = false;
      this.lastCell = null;
    });
    
    // Mouse events for desktop
    this.board.element.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('cell')) {
        this.isDrawing = true;
        this.handleCellInteraction(e);
      }
    });
    
    document.addEventListener('mouseup', () => {
      this.isDrawing = false;
      this.lastCell = null;
    });
    
    this.board.element.addEventListener('mousemove', (e) => {
      if (this.isDrawing && e.target.classList.contains('cell')) {
        this.handleCellInteraction(e);
      }
    });
    
    // Tool buttons
    document.querySelectorAll('.tool-item[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTool(btn.dataset.tool);
      });
    });
  }
  
  handleCellInteraction(e) {
    const rect = this.board.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellWidth = rect.width / this.board.cols;
    const cellHeight = rect.height / this.board.rows;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    
    if (row < 0 || row >= this.board.rows || col < 0 || col >= this.board.cols) return;
    
    if (this.lastCell && this.lastCell[0] === row && this.lastCell[1] === col) return;
    
    this.lastCell = [row, col];
    
    switch (this.currentTool) {
      case 'pen':
        this.placeBead(row, col);
        break;
      case 'eraser':
        this.removeBead(row, col);
        break;
      case 'picker':
        this.pickColor(row, col);
        break;
      case 'fill':
        this.floodFill(row, col);
        break;
    }
  }
  
  placeBead(row, col) {
    if (this.board.getCell(row, col) !== this.selectedColor) {
      this.board.setCell(row, col, this.selectedColor);
      this.uiManager?.saveState && this.uiManager.saveState();
      return true;
    }
    return false;
  }
  
  removeBead(row, col) {
    if (this.board.getCell(row, col)) {
      this.board.setCell(row, col, null);
      this.uiManager?.saveState && this.uiManager.saveState();
      return true;
    }
    return false;
  }
  
  pickColor(row, col) {
    const color = this.board.getCell(row, col);
    if (color) {
      this.selectedColor = color;
      this.updateColorPreview();
      this.selectTool('pen');
      return true;
    }
    return false;
  }
  
  floodFill(startRow, startCol) {
    const targetColor = this.board.getCell(startRow, startCol);
    if (!targetColor) return;
    
    const queue = [[startRow, startCol]];
    const visited = new Set();
    visited.add(`${startRow},${startCol}`);
    
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        
        if (nr >= 0 && nr < this.board.rows && 
            nc >= 0 && nc < this.board.cols && 
            !visited.has(`${nr},${nc}`) && 
            this.board.getCell(nr, nc) === targetColor) {
          
          visited.add(`${nr},${nc}`);
          this.board.setCell(nr, nc, this.selectedColor);
          queue.push([nr, nc]);
        }
      }
    }
    
    this.uiManager?.saveState && this.uiManager.saveState();
  }
  
  selectTool(tool) {
    this.currentTool = tool;
    document.querySelectorAll('.tool-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
  }
  
  selectColor(color) {
    this.selectedColor = color;
    this.updateColorPreview();
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.toggle('selected', swatch.dataset.color === color);
    });
    // Auto switch to pen when selecting color
    this.selectTool('pen');
  }
  
  updateColorPreview() {
    const preview = document.getElementById('current-color-preview');
    if (preview) {
      preview.style.background = this.selectedColor;
    }
  }
}
