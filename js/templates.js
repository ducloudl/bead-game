// Template management and image processing
export class Templates {
  constructor(board, tools) {
    this.board = board;
    this.tools = tools;
    this.templates = this.loadDefaultTemplates();
  }
  
  loadDefaultTemplates() {
    return {
      'heart': [
        [0,1,1,0,0,0,1,1,0],
        [1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,0,0,0]
      ],
      'star': [
        [0,0,1,0,0,0,1,0,0],
        [0,0,0,1,0,1,0,0,0],
        [1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,0,0,0],
        [0,0,1,0,0,0,1,0,0]
      ]
    };
  }
  
  loadTemplates() {
    // Populate template selection UI
    const templateSelect = document.getElementById('template-select');
    if (templateSelect) {
      Object.keys(this.templates).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        templateSelect.appendChild(option);
      });
    }
  }
  
  applyTemplate(templateName, color) {
    const template = this.templates[templateName];
    if (!template) return;
    
    this.tools.state?.saveState?.(); // Save before applying template
    
    const rows = template.length;
    const cols = template[0].length;
    const startRow = Math.floor((this.board.rows - rows) / 2);
    const startCol = Math.floor((this.board.cols - cols) / 2);
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (template[r][c]) {
          this.board.setCell(startRow + r, startCol + c, color);
        }
      }
    }
  }
  
  processImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize image to fit board
        const maxSize = Math.min(this.board.rows, this.board.cols);
        canvas.width = maxSize;
        canvas.height = maxSize;
        ctx.drawImage(img, 0, 0, maxSize, maxSize);
        
        const imageData = ctx.getImageData(0, 0, maxSize, maxSize);
        const grid = this.quantizeImage(imageData);
        
        // Clear board and apply processed image
        this.board.clear();
        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < cols; c++) {
            if (grid[r][c]) {
              this.board.setCell(r, c, grid[r][c]);
            }
          }
        }
        
        callback(grid);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  quantizeImage(imageData) {
    const { width, height, data } = imageData;
    const grid = Array(height).fill(null).map(() => Array(width).fill(null));
    
    // Simple color quantization
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        if (a > 128) {
          // Convert to nearest palette color
          const color = this.findClosestColor(r, g, b);
          grid[y][x] = color;
        }
      }
    }
    
    return grid;
  }
  
  findClosestColor(r, g, b) {
    // Simple RGB distance to predefined colors
    const colors = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
      '#FFFFFF', '#000000', '#FF6600', '#FF9900', '#CC0000', '#990000',
      '#FF3300', '#FF6633', '#FF9966', '#FFCC99', '#FFCCCC', '#996633',
      '#663300', '#996600', '#CC9900', '#FFCC00', '#FFFF99', '#CCCC99',
      '#999999', '#666666', '#333333', '#CCCCCC', '#99CCFF', '#6699FF',
      '#3366FF', '#0033CC', '#006699', '#0099CC', '#00CC99', '#009966',
      '#006633'
    ];
    
    let minDistance = Infinity;
    let closestColor = colors[0];
    
    for (const color of colors) {
      const cr = parseInt(color.substr(1, 2), 16);
      const cg = parseInt(color.substr(3, 2), 16);
      const cb = parseInt(color.substr(5, 2), 16);
      
      const distance = Math.sqrt(
        Math.pow(r - cr, 2) + 
        Math.pow(g - cg, 2) + 
        Math.pow(b - cb, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
    
    return closestColor;
  }
}