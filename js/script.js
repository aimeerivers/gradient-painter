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
let gradients = [];
let undoStack = [];
let redoStack = [];

const colorPicker = document.getElementById('colorPicker');

colors.forEach(color => {
  const button = document.createElement('button');
  button.className = 'colorBtn';
  button.style.backgroundColor = color;
  button.setAttribute('data-color', color);
  button.addEventListener('click', function () {
    currentColor = this.getAttribute('data-color');
  });
  colorPicker.appendChild(button);
});

const canvas = document.getElementById('canvas');
canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / rect.width * 100);
  const y = Math.round((e.clientY - rect.top) / rect.height * 100);
  addGradient(x, y, currentColor);
});

document.getElementById('undo').addEventListener('click', undoLast);
document.getElementById('redo').addEventListener('click', redoLast);
document.getElementById('reset').addEventListener('click', resetCanvas);

function addGradient(x, y, color) {
  const size = 80; // Fixed size for simplicity
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
    cssOutput.textContent = `#canvas {\n  background-image:\n    ${gradients.join(",\n    ")};\n}`;
  }
}

// Initialize with default color
updateCanvas();
