export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert file to Base64 for Gemini processing
    const buffer = await file.arrayBuffer();
    const fileData = Buffer.from(buffer).toString("base64");

    // 🔹 Define the AI Prompt
    const prompt = "Analyze this image and extract its structure into a clean, responsive HTML format using standard HTML and inline CSS. Make sure it follows a WordPress-friendly layout using divs, headings, paragraphs, and image placeholders.";

    // 🔹 Send file to Google Gemini API with the Prompt
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

    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      throw new Error(geminiData.error?.message || "Failed to process file");
    }

    console.log("Processed data from Gemini:", geminiData);

    // 🔹 Extract relevant HTML output from Gemini
    const generatedHTML = geminiData.candidates?.[0]?.content || "<p>Processing failed</p>";

    // 🔹 Send processed data to WordPress
    const wordpressResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        title: "AI-Generated Page",
        content: generatedHTML,
        status: "publish",
      }),
    });

    const wordpressData = await wordpressResponse.json();

    if (!wordpressResponse.ok) {
      throw new Error(wordpressData.message || "Failed to send data to WordPress");
    }

    console.log("WordPress Response:", wordpressData);

    return new Response(
      JSON.stringify({ message: "Page successfully created in WordPress!", post: wordpressData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message || "File upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
