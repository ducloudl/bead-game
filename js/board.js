// Board management and rendering
export class Board {
  constructor(rows = 24, cols = 30) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyGrid();
    this.cellSize = 22;
    this.element = document.getElementById('board');
    this.wrapper = this.element?.parentElement;
    
    if (this.element) {
      this.updateGridStyle();
    }
  }
  
  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
  }
  
  updateGridStyle() {
    if (!this.element) return;
    this.element.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
  }
  
  render() {
    if (!this.element) return;
    this.element.innerHTML = '';
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        const color = this.grid[r][c];
        if (color) {
          cell.style.backgroundColor = color;
          cell.classList.add('has-bead');
        }
        
        this.element.appendChild(cell);
      }
    }
  }
  
  setCell(row, col, color) {
    this.grid[row][col] = color;
    const cell = this.element?.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      cell.style.backgroundColor = color || '';
      cell.classList.toggle('has-bead', !!color);
    }
  }
  
  getCell(row, col) {
    return this.grid[row]?.[col] || null;
  }
  
  clear() {
    this.grid = this.createEmptyGrid();
    this.render();
  }
  
  countBeads() {
    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) count++;
      }
    }
    return count;
  }
}
