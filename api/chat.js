
const SYSTEM = `
You are Rose's Assistant, the friendly and professional AI assistant
on Rose Estrada's creative design portfolio.

ABOUT ROSE:
Rose Estrada is a Philippines-based Graphic Designer and Creative Designer
who blends creativity, technology, and strategy.

DESIGN SERVICES:
- Graphic Design
- Branding and Visual Identity
- Social Media Design
- Digital Advertising
- Packaging Design
- Apparel and T-shirt Design
- UI/UX Design
- Website Design
- Motion Graphics
- Marketing Collateral

PORTFOLIO PROJECTS:
- Zagu promotional campaigns and merchandise
- Sora Sips branding and UI/UX
- Horizon travel agency branding
- PixelCore design agency branding
- Kalo Gold apparel designs
- Concepcion Iloilo apparel designs
- E-commerce and mobile UI/UX concepts

CREATIVE TOOLS:
Adobe Photoshop, Adobe Illustrator, Adobe Dimension,
Canva, Figma, Framer, and WordPress.

RULES:
- Answer professionally, warmly, and concisely.
- You are an AI assistant, not Rose herself.
- Help visitors understand Rose's projects and services.
- Do not invent prices, availability, clients, or experience.
- For inquiries, direct visitors to the Contact section.
- Keep responses clear and easy to understand.
`;



const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite"
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function askGemini(model, apiKey, contents) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
          maxOutputTokens: 1000
        }
      }),
      signal: AbortSignal.timeout(12000)
    }
  );

  if (!response.ok) {
    const details = await response.text();

    console.error("Gemini request failed", {
      model,
      status: response.status,
      details: details.slice(0, 1000)
    });

    const error = new Error("Gemini request failed");
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  const reply = (
    data.candidates?.[0]?.content?.parts || []
  )
    .filter((part) => typeof part.text === "string")
    .map((part) => part.text)
    .join("")
    .trim();

  if (!reply) {
    console.error("Gemini returned no text", {
      model,
      finishReason: data.candidates?.[0]?.finishReason
    });
    throw new Error("Empty Gemini response");
  }

  return reply;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");

    return res.status(503).json({
      error: "Chat is not configured"
    });
  }

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
        !m.text.trim() ||
        m.text.length > 600
    )
  ) {
    return res.status(400).json({
      error: "Invalid messages"
    });
  }

  const contents = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  let lastError;

  for (const model of MODELS) {
    // Retry each model once for temporary failures.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const reply = await askGemini(
          model,
          apiKey,
          contents
        );

        return res.status(200).json({ reply });

      } catch (error) {
        lastError = error;

        console.error("Chat attempt failed", {
          model,
          attempt,
          status: error.status || "network/timeout"
        });

        // Authentication, invalid requests and quota
        // errors should not be retried.
        if ([400, 401, 403, 429].includes(error.status)) {
          return res.status(502).json({
            error: "Assistant temporarily unavailable"
          });
        }

        // Only retry transient failures.
        const retryable =
          !error.status ||
          [500, 502, 503, 504].includes(error.status);

        if (!retryable) {
          break;
        }

        if (attempt === 1) {
          await sleep(500);
        }
      }
    }
  }

  console.error("All Gemini attempts failed", {
    status: lastError?.status || "unknown"
  });

  return res.status(502).json({
    error: "Assistant temporarily unavailable"
  });
}