export async function POST(req) {
  try {
    console.log("Upload request received");

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

    // Convert file to Base64 properly
    const buffer = await file.arrayBuffer();
    const fileData = Buffer.from(buffer).toString("base64");

    console.log("Base64 data generated successfully (first 50 chars):", fileData.slice(0, 50));

    // 🔹 Define the AI Prompt
    const prompt = "Analyze this image and extract its structure into a clean, responsive HTML format using standard HTML and inline CSS. Make sure it follows a WordPress-friendly layout.";

    try {
      console.log("🔄 Sending request to Google Gemini...");

      // 🔹 Send file to Google Gemini API (corrected structure)
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
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: fileData.replace(/\s/g, ""), // Remove any spaces in Base64
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      console.log("✅ Request sent to Gemini, waiting for response...");

      const geminiData = await geminiResponse.json();

      console.log("📩 Response from Gemini:", JSON.stringify(geminiData, null, 2));

      if (!geminiResponse.ok) {
        throw new Error(geminiData.error?.message || "Failed to process file");
      }

      // Extract the HTML output
      const generatedHTML = geminiData.candidates?.[0]?.content || "<p>Processing failed</p>";
      console.log("✅ Generated HTML:", generatedHTML);

      return new Response(
        JSON.stringify({ message: "File processed successfully", data: generatedHTML }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (geminiError) {
      console.error("❌ Error while making request to Google Gemini:", geminiError);
      return new Response(
        JSON.stringify({ error: "Failed to process file with Google Gemini" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("❌ Upload error:", error);
    return new Response(JSON.stringify({ error: error.message || "File upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
