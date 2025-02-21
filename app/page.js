"use client"; // Ensures this runs in the browser

import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    console.log("Uploading file:", selectedFile.name); // ✅ Log before upload

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", response); // ✅ Log API response

      const data = await response.json();
      alert(data.message || "Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }
  };

  return (
    <main>
      <h1>Welcome to DevBoost!</h1>
      <p>This is the MVP for our AI-powered WordPress page builder.</p>

      {/* File Upload Section */}
      <section className="upload-section">
        <h2>Upload Your Design</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload File</button>
      </section>
    </main>
  );
}
