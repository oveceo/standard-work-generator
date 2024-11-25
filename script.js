// Background Animation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse Interaction
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Create Particle
function Particle(x, y, directionX, directionY, size, color) {
  this.x = x;
  this.y = y;
  this.directionX = directionX;
  this.directionY = directionY;
  this.size = size;
  this.color = color;
}

// Draw Method
Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  ctx.fillStyle = '#ecf0f1';
  ctx.fill();
};

// Update Method
Particle.prototype.update = function() {
  // Check if particle is still within canvas
  if (this.x > canvas.width || this.x < 0) {
    this.directionX = -this.directionX;
  }
  if (this.y > canvas.height || this.y < 0) {
    this.directionY = -this.directionY;
  }

  // Move particle
  this.x += this.directionX;
  this.y += this.directionY;

  // Mouse interaction
  let dx = mouse.x - this.x;
  let dy = mouse.y - this.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < mouse.radius + this.size) {
    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
      this.x += 10;
    }
    if (mouse.x > this.x && this.x > this.size * 10) {
      this.x -= 10;
    }
    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
      this.y += 10;
    }
    if (mouse.y > this.y && this.y > this.size * 10) {
      this.y -= 10;
    }
  }

  this.draw();
};

// Create Particle Array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (innerWidth - size * 2);
    let y = Math.random() * (innerHeight - size * 2);
    let directionX = (Math.random() * 2) - 1;
    let directionY = (Math.random() * 2) - 1;
    let color = '#ecf0f1';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
}

init();
animate();

// Resize Event
window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  init();
});

// Remove Mouse Position Periodically
setInterval(function() {
  mouse.x = undefined;
  mouse.y = undefined;
}, 1000);

// Form Submission Handling
const form = document.getElementById('document-form');
const loading = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const generateAnotherBtn = document.getElementById('generate-another');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show the loading spinner
  loading.style.display = 'block';
  successMessage.style.display = 'none';

  const formData = {
    purpose: document.getElementById('purpose').value,
    roles: document.getElementById('roles').value,
    safety: document.getElementById('safety').value,
    procedure: document.getElementById('procedure').value,
  };

  try {
    const response = await fetch('https://standard-work-backend.onrender.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate document. Please try again.');
    }

    // Process the response and initiate download
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Standard_Work_Document.docx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // Show success message
    successMessage.style.display = 'block';
    form.style.display = 'none';
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
  } finally {
    // Hide the loading spinner
    loading.style.display = 'none';
    form.reset();
  }
});

// Generate Another Document Button
generateAnotherBtn.addEventListener('click', () => {
  successMessage.style.display = 'none';
  form.style.display = 'block';
});
