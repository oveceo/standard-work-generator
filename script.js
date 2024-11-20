// Toggle Navigation Menu on Mobile (Optional, if implemented)
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

// Smooth Scroll for Anchor Links
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetID = link.getAttribute('href');
    const targetSection = document.querySelector(targetID);
    const offsetTop = targetSection.offsetTop - 70;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// Form Submission Handling
const form = document.getElementById('document-form');
const loading = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show the loading spinner
  loading.style.display = 'block';

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

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Create a link to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Standard_Work_Document.docx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
  } finally {
    // Hide the loading spinner and reset the form
    loading.style.display = 'none';
    form.reset();
  }
});
