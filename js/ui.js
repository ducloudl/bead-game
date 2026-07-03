// UI management - DOM manipulation and event handling
export class UIManager {
  constructor(board, tools, state, templates) {
    this.board = board;
    this.tools = tools;
    this.state = state;
    this.templates = templates;

    // Bead color palette - matching the colors used in findClosestColor
    this.colors = [
      { name: '红色', hex: '#FF0000' },
      { name: '橙色', hex: '#FF6600' },
      { name: '深橙', hex: '#FF9900' },
      { name: '黄色', hex: '#FFFF00' },
      { name: '浅黄', hex: '#FFFF99' },
      { name: '米色', hex: '#FFCC99' },
      { name: '棕色', hex: '#996633' },
      { name: '深棕', hex: '#663300' },
      { name: '金色', hex: '#CC9900' },
      { name: '绿色', hex: '#00FF00' },
      { name: '浅绿', hex: '#009966' },
      { name: '深绿', hex: '#006633' },
      { name: '青色', hex: '#00FFFF' },
      { name: '天蓝', hex: '#0099CC' },
      { name: '蓝色', hex: '#0000FF' },
      { name: '深蓝', hex: '#0033CC' },
      { name: '海军蓝', hex: '#6699FF' },
      { name: '浅蓝', hex: '#99CCFF' },
      { name: '紫色', hex: '#FF00FF' },
      { name: '粉色', hex: '#FFCCCC' },
      { name: '深红', hex: '#CC0000' },
      { name: '暗红', hex: '#990000' },
      { name: '鲜红', hex: '#FF3300' },
      { name: '玫红', hex: '#FF6633' },
      { name: '桃红', hex: '#FF9966' },
      { name: '珊瑚', hex: '#FFCCCC' },
      { name: '灰色', hex: '#999999' },
      { name: '中灰', hex: '#666666' },
      { name: '深灰', hex: '#333333' },
      { name: '白色', hex: '#FFFFFF' },
      { name: '黑色', hex: '#000000' },
    ];
  }

  async initialize() {
    // Generate color palette dynamically
    this.generateColorPalette();

    // Setup all event listeners
    this.setupEventListeners();

    // Wire up template apply button
    this.setupTemplateApply();

    // Wire up image upload
    this.setupImageUpload();

    // Initial stats update
    this.updateStats();
  }

  generateColorPalette() {
    const paletteContainer = document.getElementById('color-palette');
    if (!paletteContainer) return;

    paletteContainer.innerHTML = '';

    this.colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.dataset.color = color.hex;
      swatch.style.backgroundColor = color.hex;
      swatch.title = color.name;

      // Skip dark colors for visibility of selection border
      if (color.hex === '#000000' || color.hex === '#333333' ||
          color.hex === '#666666' || color.hex === '#999999') {
        swatch.style.border = '1px solid #ccc';
      }

      paletteContainer.appendChild(swatch);
    });
  }

  setupEventListeners() {
    // Tool buttons
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.tools.selectTool(btn.dataset.tool);
      });
    });

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.tools.selectColor(swatch.dataset.color);
      });
    });

    // Undo/Redo
    document.getElementById('undo-btn').addEventListener('click', () => {
      this.state.undo();
    });

    document.getElementById('redo-btn').addEventListener('click', () => {
      this.state.redo();
    });

    // Clear board
    document.getElementById('clear-btn').addEventListener('click', () => {
      if (confirm('确定要清空画布吗？')) {
        this.state.saveState();
        this.board.clear();
        this.updateStats();
      }
    });

    // Export
    document.getElementById('export-btn').addEventListener('click', () => {
      this.exportToPNG();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  setupTemplateApply() {
    const applyBtn = document.getElementById('apply-template-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const templateSelect = document.getElementById('template-select');
        const selectedTemplate = templateSelect.value;
        if (selectedTemplate) {
          this.templates.applyTemplate(selectedTemplate, this.tools.selectedColor);
          this.updateStats();
        }
      });
    }
  }

  setupImageUpload() {
    const uploadInput = document.getElementById('image-upload');
    if (uploadInput) {
      uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.templates.processImage(file, () => {
            this.updateStats();
          });
          // Reset input so same file can be re-uploaded
          uploadInput.value = '';
        }
      });
    }
  }

  handleKeyboard(e) {
    // Ctrl+Z - Undo
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      this.state.undo();
    }

    // Ctrl+Y - Redo
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      this.state.redo();
    }

    // Number keys for tools
    if (e.altKey) {
      switch (e.key) {
        case '1': this.tools.selectTool('pen'); break;
        case '2': this.tools.selectTool('eraser'); break;
        case '3': this.tools.selectTool('picker'); break;
        case '4': this.tools.selectTool('fill'); break;
      }
    }
  }

  exportToPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = this.board.cols * this.board.cellSize;
    canvas.height = this.board.rows * this.board.cellSize;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw beads
    for (let r = 0; r < this.board.rows; r++) {
      for (let c = 0; c < this.board.cols; c++) {
        const color = this.board.grid[r][c];
        if (color) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(
            c * this.board.cellSize + this.board.cellSize / 2,
            r * this.board.cellSize + this.board.cellSize / 2,
            this.board.cellSize / 2 - 1,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    // Download
    const link = document.createElement('a');
    link.download = 'bead-art.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  updateStats() {
    const beadCount = this.countBeads();
    const colorCounts = this.getColorCounts();

    document.getElementById('bead-count').textContent = beadCount;

    // Update color badges
    Object.entries(colorCounts).forEach(([color, count]) => {
      const swatch = document.querySelector(`.color-swatch[data-color="${color}"]`);
      if (swatch) {
        let badge = swatch.querySelector('.badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'badge';
          badge.style.cssText = 'position:absolute;font-size:8px;color:white;text-shadow:0 0 1px black;top:0;right:0;';
          swatch.style.position = 'relative';
          swatch.appendChild(badge);
        }
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
      }
    });
  }

  countBeads() {
    let count = 0;
    for (let r = 0; r < this.board.rows; r++) {
      for (let c = 0; c < this.board.cols; c++) {
        if (this.board.grid[r][c]) count++;
      }
    }
    return count;
  }

  getColorCounts() {
    const counts = {};
    for (let r = 0; r < this.board.rows; r++) {
      for (let c = 0; c < this.board.cols; c++) {
        const color = this.board.grid[r][c];
        if (color) {
          counts[color] = (counts[color] || 0) + 1;
        }
      }
    }
    return counts;
  }
}
