document.getElementById('workForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    purpose: document.getElementById('purpose').value,
    roles: document.getElementById('roles').value,
    safety: document.getElementById('safety').value,
    procedure: document.getElementById('procedure').value,
  };

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Generating your Standard Work Document...';

  try {
    const response = await fetch('https://your-backend-url.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    resultDiv.innerHTML = `
      <h2>Generated Standard Work Document</h2>
      <pre>${data.text}</pre>
    `;
  } catch (error) {
    resultDiv.innerHTML = '<p>Error generating document. Please try again later.</p>';
    console.error(error);
  }
});

