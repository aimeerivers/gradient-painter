// script.js
let currentColor = '#FF0000';
let gradients = [];
let undoStack = [];
let redoStack = [];

document.querySelectorAll('.colorBtn').forEach(btn => {
  btn.addEventListener('click', function () {
    currentColor = this.getAttribute('data-color');
  });
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
