// script.js
let currentColor = 'red';
let gradients = [];
let undoHistory = [];

document.querySelectorAll('.colorBtn').forEach(btn => {
  btn.addEventListener('click', function () {
    currentColor = this.getAttribute('data-color');
  });
});

const canvas = document.getElementById('canvas');
canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addGradient(x, y, currentColor);
});

document.getElementById('undo').addEventListener('click', undoLast);

function addGradient(x, y, color) {
  const size = 100; // Fixed size for simplicity
  const gradient = `radial-gradient(circle at ${x}px ${y}px, ${color}, transparent)`;
  gradients.push(gradient);
  updateCanvas();
}

function updateCanvas() {
  canvas.style.backgroundImage = gradients.join(', ');
  updateCSSOutput();
}

function undoLast() {
  gradients.pop(); // Remove the last gradient
  updateCanvas();
}

function updateCSSOutput() {
  const cssOutput = document.getElementById('cssOutput');
  cssOutput.textContent = `background-image: ${gradients.join(', ')};`;
}

// Initialize with default color
updateCanvas();
