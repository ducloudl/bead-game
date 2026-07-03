// Templates management
export class Templates {
  constructor(board, tools) {
    this.board = board;
    this.tools = tools;
    this.templateDefs = this.getDefaultTemplates();
    // Don't call loadTemplates here — DOM might not be ready
  }
  
  loadTemplates() {
    const select = document.getElementById('template-select');
    if (!select) return;
    
    for (const [key, def] of Object.entries(this.templateDefs)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = def.name;
      select.appendChild(option);
    }
  }
  
  getDefaultTemplates() {
    return {
      'heart': {
        name: '❤️ 爱心',
        pattern: [
          [0,1,1,0,0,1,1,0],
          [1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1],
          [0,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,0,0],
          [0,0,0,1,1,0,0,0],
          [0,0,0,0,0,0,0,0],
        ]
      },
      'star': {
        name: '⭐ 星星',
        pattern: [
          [0,0,1,0,0,1,0,0],
          [0,0,0,1,1,0,0,0],
          [1,1,1,1,1,1,1,1],
          [0,1,1,1,1,1,1,0],
          [1,1,1,1,1,1,1,1],
          [0,0,0,1,1,0,0,0],
          [0,0,1,0,0,1,0,0],
          [0,0,0,0,0,0,0,0],
        ]
      },
      'smiley': {
        name: '😊 笑脸',
        pattern: [
          [0,0,1,1,1,1,0,0],
          [0,1,1,1,1,1,1,0],
          [1,1,0,1,1,0,1,1],
          [1,1,1,1,1,1,1,1],
          [1,1,0,1,1,0,1,1],
          [1,1,1,1,1,1,1,1],
          [0,1,0,1,1,0,1,0],
          [0,0,0,0,0,0,0,0],
        ]
      }
    };
  }
  
  applyTemplate(templateName, defaultColor = '#FF0000') {
    const def = this.templateDefs[templateName];
    if (!def) return;
    
    const pattern = def.pattern;
    const rows = pattern.length;
    const cols = pattern[0].length;
    
    const startRow = Math.floor((this.board.rows - rows) / 2);
    const startCol = Math.floor((this.board.cols - cols) / 2);
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pattern[r][c]) {
          const br = startRow + r;
          const bc = startCol + c;
          if (br >= 0 && br < this.board.rows && bc >= 0 && bc < this.board.cols) {
            this.board.setCell(br, bc, defaultColor);
          }
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
        
        const scale = Math.min(this.board.cols / img.width, this.board.rows / img.height);
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        this.board.clear();
        
        const cellW = this.board.cols / canvas.width;
        const cellH = this.board.rows / canvas.height;
        
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            
            if (r + g + b < 5) continue;
            
            const color = this.findClosestColor(r, g, b);
            const boardX = Math.floor(x * cellW);
            const boardY = Math.floor(y * cellH);
            
            if (boardY >= 0 && boardY < this.board.rows && boardX >= 0 && boardX < this.board.cols) {
              this.board.setCell(boardY, boardX, color);
            }
          }
        }
        
        callback?.();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  findClosestColor(r, g, b) {
    const palettes = [
      {r:255,g:0,b:0},{r:255,g:102,b:0},{r:255,g:153,b:0},{r:255,g:255,b:0},
      {r:255,g:255,b:153},{r:255,g:204,b:153},{r:153,g:102,b:51},{r:102,g:51,b:0},
      {r:204,g:153,b:0},{r:0,g:255,b:0},{r:0,g:153,b:102},{r:0,g:102,b:51},
      {r:0,g:255,b:255},{r:0,g:153,b:204},{r:0,g:0,b:255},{r:0,g:51,b:204},
      {r:102,g:153,b:255},{r:153,g:204,b:255},{r:255,g:0,b:255},{r:255,g:204,b:204},
      {r:204,g:0,b:0},{r:153,g:0,b:0},{r:255,g:51,b:0},{r:255,g:102,b:51},
      {r:255,g:153,b:102},{r:255,g:204,b:204},{r:153,g:153,b:153},{r:102,g:102,b:102},
      {r:51,g:51,b:51},{r:255,g:255,b:255},{r:0,g:0,b:0}
    ];
    
    let minDist = Infinity;
    let closest = palettes[0];
    
    for (const p of palettes) {
      const dr = r - p.r;
      const dg = g - p.g;
      const db = b - p.b;
      const dist = dr*dr + dg*dg + db*db;
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    }
    
    return `#${closest.r.toString(16).padStart(2,'0')}${closest.g.toString(16).padStart(2,'0')}${closest.b.toString(16).padStart(2,'0')}`.toUpperCase();
  }
}
