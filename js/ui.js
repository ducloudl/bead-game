// UI management - DOM manipulation and event handling
export class UIManager {
  constructor(board, tools, state, templates) {
    this.board = board;
    this.tools = tools;
    this.state = state;
    this.templates = templates;
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
    this.generateColorPalette();
    this.setupEventListeners();
    this.setupAdvancedToggle();
    this.setupTemplateApply();
    this.setupImageUpload();
    this.updateStats();
    
    // Select first color by default
    const firstSwatch = document.querySelector('.color-swatch');
    if (firstSwatch) {
      this.tools.selectColor(firstSwatch.dataset.color);
    }
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

      // Dark colors need visible border
      if (color.hex === '#000000' || color.hex === '#333333' ||
          color.hex === '#666666' || color.hex === '#999999') {
        swatch.style.border = '2px solid #ccc';
      }

      paletteContainer.appendChild(swatch);
    });
  }

  setupEventListeners() {
    // Undo/Redo
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const exportBtn = document.getElementById('export-btn');

    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.state.undo());
    }
    if (redoBtn) {
      redoBtn.addEventListener('click', () => this.state.redo());
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('确定要清空画布吗？')) {
          this.state.saveState();
          this.board.clear();
          this.updateStats();
        }
      });
    }
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToPNG());
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  setupAdvancedToggle() {
    const toggleBtn = document.getElementById('adv-toggle');
    const panel = document.getElementById('adv-panel');
    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('open');
        toggleBtn.textContent = panel.classList.contains('open') 
          ? '⚙️ 收起功能 ▴' 
          : '⚙️ 更多功能 ▾';
      });
    }
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
          uploadInput.value = '';
        }
      });
    }
  }

  handleKeyboard(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      this.state.undo();
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      this.state.redo();
    }
  }

  saveState() {
    this.state.saveState();
  }

  updateStats() {
    const countEl = document.getElementById('bead-count');
    if (countEl) {
      countEl.textContent = this.board.countBeads();
    }
  }

  exportToPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellPx = 15;
    
    canvas.width = this.board.cols * cellPx;
    canvas.height = this.board.rows * cellPx;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < this.board.rows; r++) {
      for (let c = 0; c < this.board.cols; c++) {
        const color = this.board.grid[r][c];
        if (color) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(c * cellPx + cellPx/2, r * cellPx + cellPx/2, cellPx/2 - 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const link = document.createElement('a');
    link.download = `拼豆作品_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
