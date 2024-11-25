// Background Animation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create Constructor Function for Particles
function Particle(x, y, directionX, directionY, size, color) {
  this.x = x;
  this.y = y;
  this.directionX = directionX;
  this.directionY = directionY;
  this.size = size;
  this.color = color;
}

// Add draw method to particle prototype
Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  ctx.fillStyle = '#fff';
  ctx.fill();
};

// Add update method to particle prototype
Particle.prototype.update = function() {
  if (this.x + this.size > canvas.width || this.x - this.size < 0) {
    this.directionX = -this.directionX;
  }
  if (this.y + this.size > canvas.height || this.y - this.size < 0) {
    this.directionY = -this.directionY;
  }

  this.x += this.directionX;
  this.y += this.directionY;

  this.draw();
};

// Create particle array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2;
    let x = Math.random() * (innerWidth - size * 2);
    let y = Math.random() * (innerHeight - size * 2);
    let directionX = (Math.random() * 0.4) - 0.2;
    let directionY = (Math.random() * 0.4) - 0.2;
    let color = '#fff';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
}

init();
animate();

// Handle window resize
window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

// Form Submission Handling
const form = document.getElementById('document-form');
const loading = document.getElementById('loading');
const successMessage = document.getElementById('success-message');

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
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
  } finally {
    // Hide the loading spinner
    loading.style.display = 'none';
    form.reset();
  }
});
