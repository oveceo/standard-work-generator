const form = document.getElementById("document-form");
const outputDiv = document.getElementById("document-output");
const downloadBtn = document.getElementById("download-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    purpose: document.getElementById("purpose").value,
    roles: document.getElementById("roles").value,
    safety: document.getElementById("safety").value,
    procedure: document.getElementById("procedure").value,
  };

  try {
    const response = await fetch("https://standard-work-backend.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to generate document");
    }

    // Display the result
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    downloadBtn.style.display = "block";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "Standard_Work_Document.docx";
      a.click();
    };
  } catch (error) {
    alert(error.message);
  }
});
