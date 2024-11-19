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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `
              You are an expert technical writer specializing in creating professional Standard Work Documents. Your task is to generate a clear, comprehensive, and intuitive Standard Work Document based on the user's input. Follow these guidelines:
              
              ### **1. Purpose and Scope**  
              - Provide a brief paragraph elaborating on the user's input to define the task's purpose and scope clearly.  
              - Ensure it sets the context for the procedure and identifies its significance.

              ### **2. Roles and Responsibilities**  
              - Use the user-provided list of roles to create a professional, detailed list.  
              - For each role, lightly elaborate on the responsibilities to ensure clarity of each person’s or position's duties.  

              ### **3. Safety**  
              - Write a brief paragraph highlighting safety considerations based on the user's input.  
              - Where necessary, expand to include relevant safety measures or precautions.

              ### **4. Procedure Content**  
              - Organize the procedure in a professional and intuitive step-by-step format.  
              - Ensure each step is clear, actionable, and includes any relevant elaborations or contextual details.

              ### **5. Quality Assurance**  
              - Based on the content provided, generate a brief list of Quality Assurance (QA) checks or best practices.  
              - These checks should align with the procedure to ensure quality and consistency.

              Ensure the entire document maintains a professional tone, is easy to follow, and provides value to the user by enhancing their inputs with relevant details and context.
            `,
          },
          {
            role: 'user',
            content: `
              Purpose: ${formData.purpose}
              Roles: ${formData.roles}
              Safety: ${formData.safety}
              Procedure: ${formData.procedure}
            `,
          },
        ],
        max_tokens: 10000,
      }),
    });

    const data = await response.json();
    resultDiv.innerHTML = `
      <h2>Generated Standard Work Document</h2>
      <pre>${data.choices[0].message.content}</pre>
    `;
  } catch (error) {
    resultDiv.innerHTML = '<p>Error generating document. Please try again later.</p>';
  }
});

