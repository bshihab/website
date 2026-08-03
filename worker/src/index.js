import { SYSTEM_CONTEXT } from './context.js';

// Only these origins may call the proxy. Everything else gets a 403 before we
// ever touch the Gemini key.
const ALLOWED_ORIGINS = new Set([
    'https://bilalshihab.com',
    'https://www.bilalshihab.com',
    'https://bshihab.github.io',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]);

const MODEL = 'gemini-2.5-flash';
const MAX_QUESTION_CHARS = 500;

function corsHeaders(origin) {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
    };
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') ?? '';
        const allowed = ALLOWED_ORIGINS.has(origin);

        if (request.method === 'OPTIONS') {
            return allowed
                ? new Response(null, { status: 204, headers: corsHeaders(origin) })
                : new Response(null, { status: 403 });
        }

        if (!allowed) return new Response('Forbidden', { status: 403 });

        const json = (body, status = 200) =>
            new Response(JSON.stringify(body), {
                status,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });

        if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

        // Per-IP rate limit. Skipped if the binding isn't configured, so the
        // Worker still deploys without it.
        if (env.RATE_LIMITER) {
            const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
            const { success } = await env.RATE_LIMITER.limit({ key: ip });
            if (!success) {
                return json({ error: 'Too many requests — please wait a moment.' }, 429);
            }
        }

        let question;
        try {
            ({ question } = await request.json());
        } catch {
            return json({ error: 'Invalid request body.' }, 400);
        }

        if (typeof question !== 'string' || !question.trim()) {
            return json({ error: 'Missing question.' }, 400);
        }
        if (question.length > MAX_QUESTION_CHARS) {
            return json({ error: 'Question too long.' }, 400);
        }

        let upstream;
        try {
            upstream = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Header rather than query string, so the key stays out of URLs and logs.
                        'x-goog-api-key': env.GEMINI_API_KEY,
                    },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
                        contents: [{ role: 'user', parts: [{ text: question }] }],
                        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
                    }),
                },
            );
        } catch {
            return json({ error: 'Could not reach the model. Please try again.' }, 502);
        }

        if (!upstream.ok) {
            // Never forward the upstream body — it can echo key or project details.
            const message =
                upstream.status === 429
                    ? 'Rate limited — please wait a moment and try again.'
                    : 'The model is unavailable right now. Please try again.';
            return json({ error: message }, upstream.status === 429 ? 429 : 502);
        }

        const data = await upstream.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return json({ reply: reply ?? "Couldn't generate a response." });
    },
};
