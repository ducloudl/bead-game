// Board management and rendering
export class Board {
  constructor(rows = 24, cols = 30) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyGrid();
    this.cellSize = 22;
    this.element = document.getElementById('board');
  }
  
  createEmptyGrid() {
    return Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
  }
  
  render() {
    this.element.innerHTML = '';
    this.element.style.gridTemplateColumns = `repeat(${this.cols}, ${this.cellSize}px)`;
    this.element.style.gridTemplateRows = `repeat(${this.rows}, ${this.cellSize}px)`;
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.style.width = `${this.cellSize}px`;
        cell.style.height = `${this.cellSize}px`;
        
        if (this.grid[r][c]) {
          cell.style.backgroundColor = this.grid[r][c];
          cell.classList.add('has-bead');
        }
        
        this.element.appendChild(cell);
      }
    }
  }
  
  updateCell(row, col, color) {
    const cell = this.element.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      if (color) {
        cell.style.backgroundColor = color;
        cell.classList.add('has-bead');
        this.grid[row][col] = color;
      } else {
        cell.style.backgroundColor = '';
        cell.classList.remove('has-bead');
        this.grid[row][col] = null;
      }
    }
  }
  
  getCell(row, col) {
    return this.grid[row][col];
  }
  
  setCell(row, col, color) {
    this.grid[row][col] = color;
    this.updateCell(row, col, color);
  }
  
  clear() {
    this.grid = this.createEmptyGrid();
    this.render();
  }
  
  resize(newRows, newCols) {
    this.rows = newRows;
    this.cols = newCols;
    this.clear();
  }
}