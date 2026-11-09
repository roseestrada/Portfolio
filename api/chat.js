
// Vercel serverless endpoint for Rose Estrada's Gemini chatbot.
// Set GEMINI_API_KEY in Vercel Environment Variables (Production).

const SYSTEM = `
You are the helpful, professional AI assistant on Rose Estrada's design portfolio.

Rose is a Philippines-based creative designer who blends creativity,
technology, and strategy.

Her work includes:
- Zagu promotional campaigns and merchandise
- Kalo Gold and Concepcion Iloilo apparel designs
- Branding and identity design
- Social media and advertising
- Packaging design
- Motion graphics
- UI/UX design

Her creative tools include:
Adobe Photoshop, Adobe Illustrator, Adobe Dimension,
Canva, Figma, Framer, and WordPress.

Answer questions about her portfolio and design services
concisely, professionally, and warmly.

Do not invent prices, availability, years of experience,
clients, personal details, or contact addresses.

For project inquiries, direct visitors to the Contact
section of the website.

You are an AI assistant, not Rose herself.
`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // Only allow POST requests.
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  // Check Gemini API key configuration.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing.");

    return res.status(503).json({
      error: "Chat is not configured yet"
    });
  }

  // Validate conversation messages.
  const messages = req.body?.messages;

  if (
    !Array.isArray(messages) ||
    messages.length < 1 ||
    messages.length > 12 ||
    messages.some(
      (m) =>
        !m ||
        !["user", "model"].includes(m.role) ||
        typeof m.text !== "string" ||
        m.text.length > 600
    )
  ) {
    return res.status(400).json({
      error: "Invalid messages"
    });
  }

  try {
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Send request to Google Gemini.
    const upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 350,
            temperature: 0.5
          }
        })
      }
    );

    // Log the actual Gemini API error for debugging.
    if (!upstream.ok) {
      const details = await upstream.text();

      let errorMessage = "Unknown Gemini API error";

      try {
        const errorData = JSON.parse(details);
        errorMessage =
          errorData.error?.message || errorMessage;
      } catch {
        errorMessage = details.slice(0, 500);
      }

      console.error("Gemini API error:", {
        status: upstream.status,
        message: errorMessage
      });

      // Keep internal error details hidden from visitors.
      return res.status(502).json({
        error: "Assistant temporarily unavailable"
      });
    }

    const data = await upstream.json();

    const reply = (
      data.candidates?.[0]?.content?.parts || []
    )
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error("Gemini returned an empty response.", {
        finishReason: data.candidates?.[0]?.finishReason,
        blockReason: data.promptFeedback?.blockReason
      });

      return res.status(502).json({
        error: "Assistant could not generate a response"
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("Gemini chatbot server error:", {
      name: error?.name,
      message: error?.message
    });

    return res.status(502).json({
      error: "Assistant temporarily unavailable"
    });
  }
}
