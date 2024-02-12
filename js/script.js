const colors = [
  "#87CEEB",
  "#FFFACD",
  "#FFF0F5",
  "#F5FFFA",
  "#FF7F50",
  "#40E0D0",
  "#9DC183",
  "#D896FF",
  "#F5F5DC",
  "#708090",
  "#EA7E5D",
  "#1560BD",
  "#708238",
  "#FFDB58",
  "#008080",
  "#CB4154",
  "#36454F",
  "#FFE5B4",
  "#4B0082",
  "#228B22"
];

let currentColor = colors[0];
let size = 80;
let gradients = [];
let undoStack = [];
let redoStack = [];

let previewGradient = '';

const colorPicker = document.getElementById('colorPicker');

colors.forEach((color, index) => {
  const button = document.createElement('button');
  button.className = 'colorBtn';
  button.style.backgroundColor = color;
  if (index === 0) {
    button.classList.add('active');
  }
  button.setAttribute('data-color', color);
  button.addEventListener('click', function () {
    currentColor = this.getAttribute('data-color');
    const activeButton = document.querySelector('.colorBtn.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }
    this.classList.add('active');
  });
  colorPicker.appendChild(button);
});

const sizeDropdown = document.getElementById('size');
sizeDropdown.addEventListener('change', function () {
  size = this.value;
});

const canvas = document.getElementById('canvas');

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / rect.width * 100);
  const y = Math.round((e.clientY - rect.top) / rect.height * 100);
  addGradient(x, y, currentColor, size);
});

canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / rect.width * 100);
  const y = Math.round((e.clientY - rect.top) / rect.height * 100);
  
  previewGradient = `radial-gradient(circle at ${x}% ${y}%, ${currentColor}, transparent ${size}%)`;
  canvas.style.backgroundImage = [...gradients, previewGradient].join(', ');
});

canvas.addEventListener('mouseout', function () {
  canvas.style.backgroundImage = gradients.join(', ');
});

document.getElementById('undo').addEventListener('click', undoLast);
document.getElementById('redo').addEventListener('click', redoLast);
document.getElementById('reset').addEventListener('click', resetCanvas);

function addGradient(x, y, color, size) {
  const gradient = `radial-gradient(circle at ${x}% ${y}%, ${color}, transparent ${size}%)`;
  undoStack.push(gradient);
  updateCanvas();
}

function updateCanvas() {
  gradients = [...undoStack];
  canvas.style.backgroundImage = gradients.join(', ');
  updateCSSOutput();
}

function undoLast() {
  if (undoStack.length > 0) {
    const lastGradient = undoStack.pop(); // Remove the last gradient
    redoStack.push(lastGradient);
    updateCanvas();
  }
}

function redoLast() {
  if (redoStack.length > 0) {
    const lastGradient = redoStack.pop(); // Remove the last gradient
    undoStack.push(lastGradient);
    updateCanvas();
  }
}

function resetCanvas() {
  gradients = [];
  undoStack = [];
  redoStack = [];
  updateCanvas();
}

function updateCSSOutput() {
  const cssOutput = document.getElementById('cssOutput');
  if (gradients.length === 0) {
    cssOutput.textContent = "";
  } else {
    cssOutput.textContent = `.fancy {\n  background-image:\n    ${gradients.join(",\n    ")};\n}`;
  }
}

// Initialize with default color
updateCanvas();
