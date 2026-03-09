function getAllowedOrigin(req) {
  const configured = process.env.ALLOWED_ORIGIN || "*";
  if (configured === "*") return "*";
  const origin = req.headers.origin || "";
  return origin === configured ? origin : configured;
}

function setCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", getAllowedOrigin(req));
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function settledResult(result) {
  if (result.status === "fulfilled") {
    return { ok: true, text: result.value };
  }
  return { ok: false, error: result.reason?.message || "unknown error" };
}

async function askOpenAI(question) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is missing");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise and helpful assistant." },
        { role: "user", content: question }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI request failed");
  }

  return data.choices?.[0]?.message?.content || "(empty response)";
}

async function askGemini(question) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is missing");

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: question }] }]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "(empty response)";
}

async function askClaude(question) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is missing");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
      max_tokens: 1000,
      messages: [{ role: "user", content: question }]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Claude request failed");
  }

  return data.content?.[0]?.text || "(empty response)";
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const question = (req.body?.question || "").trim();
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  const settled = await Promise.allSettled([
    askOpenAI(question),
    askGemini(question),
    askClaude(question)
  ]);

  return res.status(200).json({
    results: {
      chatgpt: settledResult(settled[0]),
      gemini: settledResult(settled[1]),
      claude: settledResult(settled[2])
    }
  });
}
