export async function POST(req) {
  try {
    console.log("Upload request received"); // Log to confirm API is being triggered

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.log("No file found in the request");
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("File received:", file.name);

    // Convert file to Base64 for Gemini processing
    const buffer = await file.arrayBuffer();
    const fileData = Buffer.from(buffer).toString("base64");

    console.log("Base64 data generated, sending request to Google Gemini...");
    console.log("First 50 characters of Base64:", fileData.slice(0, 50)); // Log partial data for validation

    // 🔹 Define the AI Prompt
    const prompt = "Analyze this image and extract its structure into a clean, responsive HTML format using standard HTML and inline CSS. Make sure it follows a WordPress-friendly layout.";

    // 🔹 Send file to Google Gemini API
    try {
      console.log("Making request to Google Gemini...");
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt }, // 🔥 The prompt instructing Gemini
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: fileData,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      console.log("Google Gemini request completed");

      const geminiData = await geminiResponse.json();
      console.log("Response from Gemini:", geminiData); // ✅ Log Gemini's response

      if (!geminiResponse.ok) {
        throw new Error(geminiData.error?.message || "Failed to process file");
      }

      // 🔹 Extract HTML output from Gemini
      const generatedHTML = geminiData.candidates?.[0]?.content || "<p>Processing failed</p>";
      console.log("Generated HTML:", generatedHTML); // ✅ Log extracted HTML

      return new Response(
        JSON.stringify({ message: "File processed successfully", data: generatedHTML }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (geminiError) {
      console.error("Error while making request to Google Gemini:", geminiError);
      return new Response(JSON.stringify({ error: "Failed to process file with Google Gemini" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message || "File upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
