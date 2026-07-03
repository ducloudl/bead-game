// Drawing tools and utilities
export class Tools {
  constructor(board) {
    this.board = board;
    this.currentTool = 'pen';
    this.selectedColor = '#000000';
    this.isDrawing = false;
    this.lastCell = null;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Drag to draw
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
  }
  
  handleCellInteraction(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    // Avoid processing the same cell twice during drag
    if (this.lastCell && this.lastCell[0] === row && this.lastCell[1] === col) {
      return;
    }
    
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
      return true;
    }
    return false;
  }
  
  removeBead(row, col) {
    if (this.board.getCell(row, col)) {
      this.board.setCell(row, col, null);
      return true;
    }
    return false;
  }
  
  pickColor(row, col) {
    const color = this.board.getCell(row, col);
    if (color) {
      this.selectedColor = color;
      this.updateColorUI();
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
  }
  
  selectTool(tool) {
    this.currentTool = tool;
    this.updateToolUI();
  }
  
  selectColor(color) {
    this.selectedColor = color;
    this.updateColorUI();
  }
  
  updateToolUI() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === this.currentTool);
    });
  }
  
  updateColorUI() {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.toggle('selected', swatch.dataset.color === this.selectedColor);
    });
  }
}