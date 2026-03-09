export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(env);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/compare") {
      return json({ error: "Not Found" }, 404, corsHeaders);
    }

    if (request.method !== "POST") {
      return json({ error: "Method Not Allowed" }, 405, corsHeaders);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, corsHeaders);
    }

    const question = (body.question || "").trim();
    if (!question) {
      return json({ error: "question is required" }, 400, corsHeaders);
    }

    const tasks = {
      chatgpt: askOpenAI(question, env),
      gemini: askGemini(question, env),
      claude: askClaude(question, env)
    };

    const settled = await Promise.allSettled([
      tasks.chatgpt,
      tasks.gemini,
      tasks.claude
    ]);

    const results = {
      chatgpt: settledResult(settled[0]),
      gemini: settledResult(settled[1]),
      claude: settledResult(settled[2])
    };

    return json({ results }, 200, corsHeaders);
  }
};

function settledResult(result) {
  if (result.status === "fulfilled") {
    return { ok: true, text: result.value };
  }
  return { ok: false, error: result.reason?.message || "unknown error" };
}

function buildCorsHeaders(env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), {
    status,
    headers
  });
}

async function askOpenAI(question, env) {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-4o-mini",
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

async function askGemini(question, env) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: question }]
        }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "(empty response)";
}

async function askClaude(question, env) {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is missing");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
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
