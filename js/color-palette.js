// Color palette initialization
const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF6600', '#FF9900',
  '#CC0000', '#990000', '#FF3300', '#FF6633', '#FF9966',
  '#FFCC99', '#FFCCCC', '#996633', '#663300', '#996600',
  '#CC9900', '#FFCC00', '#FFFF99', '#CCCC99', '#999999',
  '#666666', '#333333', '#CCCCCC', '#99CCFF', '#6699FF',
  '#3366FF', '#0033CC', '#006699', '#0099CC', '#00CC99',
  '#009966', '#006633'
];

// Initialize color palette
document.addEventListener('DOMContentLoaded', () => {
  const paletteContainer = document.getElementById('color-palette');
  if (paletteContainer) {
    colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.dataset.color = color;
      swatch.title = color;
      paletteContainer.appendChild(swatch);
    });
  }
});