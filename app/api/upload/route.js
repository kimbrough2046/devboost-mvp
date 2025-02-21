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

    // Convert file to a format that can be sent to WordPress
    const buffer = await file.arrayBuffer();
    const fileData = Buffer.from(buffer).toString("base64");

    // TODO: Send fileData to WordPress (Integrate API here)
    console.log("File received:", file.name); // Log for now

    return new Response(
      JSON.stringify({ message: "File processed successfully", name: file.name }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "File upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
